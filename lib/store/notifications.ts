import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./auth";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "chat" | "transaction";
  content: string;
  data: {
    userId: string;
    transactionId?: string;
    isAdmin?: boolean;
    type?: string;
    action?: "credit" | "debit";
    amount?: number;
    status?: string;
  };
  timestamp: Date;
  read: boolean;
  existing: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  adminSocket: Socket | null;
  isConnected: boolean;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  deleteAllNotifications: () => void;
  handleNotificationClick: (notification: Notification) => {
    type: string;
    path: string;
    data?: any;
  };
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      socket: null,
      adminSocket: null,
      isConnected: false,

      initializeSocket: () => {
        console.log("[Notifications] Initializing socket connection...");
        const user = useAuthStore.getState().user;
        const isAdmin = sessionStorage.getItem("user-role") === "admin";

        // Initialize user notifications socket
        const userSocket = io(
          `${
            process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
          }/user-notifications`,
          {
            withCredentials: true,
            path: "/socket.io",
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
            forceNew: true,
          }
        );

        // Initialize admin notifications socket if user is admin
        let adminSocket: Socket | null = null;
        if (isAdmin) {
          adminSocket = io(
            `${
              process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
            }/admin-notifications`,
            {
              withCredentials: true,
              path: "/socket.io",
              transports: ["websocket"],
              reconnection: true,
              reconnectionAttempts: 5,
              reconnectionDelay: 1000,
              autoConnect: true,
              forceNew: true,
            }
          );
        }

        // Log all socket events for debugging
        userSocket.onAny((eventName, ...args) => {
          console.log(
            `[Notifications] User socket event received: ${eventName}`,
            args
          );
        });

        if (adminSocket) {
          adminSocket.onAny((eventName, ...args) => {
            console.log(
              `[Notifications] Admin socket event received: ${eventName}`,
              args
            );
          });
        }

        userSocket.on("connect", () => {
          console.log("[Notifications] User socket connected successfully", {
            id: userSocket.id,
            connected: userSocket.connected,
            transport: userSocket.io.engine.transport.name,
          });

          if (user?._id && !isAdmin) {
            const roomName = `user_${user._id}`;
            console.log("[Notifications] Attempting to join user room:", {
              roomName,
              userId: user._id,
              socketId: userSocket.id,
              connected: userSocket.connected,
            });

            userSocket.emit("join", roomName, (response: any) => {
              console.log("[Notifications] Join user room response:", response);
            });
          }

          // Set connection status to true when user socket connects
          set({ isConnected: true });
        });

        if (adminSocket) {
          adminSocket.on("connect", () => {
            console.log("[Notifications] Admin socket connected successfully", {
              id: adminSocket.id,
              connected: adminSocket.connected,
              transport: adminSocket.io.engine.transport.name,
            });

            console.log("[Notifications] Attempting to join admin room");
            adminSocket.emit("join", "admin", (response: any) => {
              console.log(
                "[Notifications] Join admin room response:",
                response
              );
            });
          });
        }

        // Handle notifications from both sockets
        const handleNotification = (notification: any) => {
          console.log("this is notification actually", notification);
          // Immediately check if this has a type field - if not, it's not a notification
          if (!notification?.type) {
            console.log(
              "[Notifications] Non-notification event received, skipping:",
              notification
            );
            return;
          }

          // Validate if this is a real notification
          if (!notification.content || !notification.data) {
            console.log(
              "[Notifications] Received invalid notification, skipping:",
              notification
            );
            return;
          }

          console.log("[Notifications] Received new notification:", {
            socketId: userSocket.id,
            connected: userSocket.connected,
            notification: {
              type: notification.type,
              content: notification.content,
              data: notification.data,
            },
          });

          // Log specific details based on notification type
          if (notification.type === "transaction") {
            console.log("[Notifications] Transaction notification details:", {
              action: notification.data.action,
              amount: notification.data.amount,
              status: notification.data.status,
              transactionId: notification.data.transactionId,
              socketId: userSocket.id,
            });
          } else if (notification.type === "chat") {
            console.log("[Notifications] Chat notification details:", {
              isAdmin: notification.data.isAdmin,
              senderId: notification.data.senderId,
              senderName: notification.data.senderName,
              message: notification.content,
              socketId: userSocket.id,
            });
          }

          set((state) => {
            // Check for duplicate notifications within 5 seconds
            const now = new Date().getTime();
            const isDuplicate = state.notifications.some(
              (existingNotification) => {
                const existingTimestamp =
                  existingNotification.timestamp instanceof Date
                    ? existingNotification.timestamp.getTime()
                    : new Date(existingNotification.timestamp).getTime();

                const timeDiff = Math.abs(now - existingTimestamp);
                return (
                  timeDiff < 5000 && // Within 5 seconds
                  existingNotification.type === notification.type &&
                  existingNotification.content === notification.content &&
                  JSON.stringify(existingNotification.data) ===
                    JSON.stringify(notification.data)
                );
              }
            );

            if (isDuplicate) {
              console.log(
                "[Notifications] Duplicate notification detected, skipping"
              );
              return state;
            }

            const newNotification = {
              ...notification,
              timestamp: new Date(),
              read: false,
              existing: false,
            };
            console.log("[Notifications] Adding notification to state:", {
              notification: newNotification,
              currentState: {
                notificationCount: state.notifications.length,
                unreadCount: state.unreadCount,
              },
            });
            return {
              notifications: [newNotification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            };
          });
        };

        userSocket.on("notification", handleNotification);
        if (adminSocket) {
          adminSocket.on("notification", handleNotification);
        }

        // Handle disconnections
        userSocket.on("disconnect", (reason) => {
          console.log("[Notifications] User socket disconnected:", {
            reason,
            socketId: userSocket.id,
            wasConnected: userSocket.connected,
          });
          set({ isConnected: false });
        });

        if (adminSocket) {
          adminSocket.on("disconnect", (reason) => {
            console.log("[Notifications] Admin socket disconnected:", {
              reason,
              socketId: adminSocket.id,
              wasConnected: adminSocket.connected,
            });
          });
        }

        set({ socket: userSocket, adminSocket });
      },

      disconnectSocket: () => {
        const { socket, adminSocket } = get();
        if (socket) {
          console.log("[Notifications] Disconnecting user socket...");
          socket.disconnect();
        }
        if (adminSocket) {
          console.log("[Notifications] Disconnecting admin socket...");
          adminSocket.disconnect();
        }
        set({ socket: null, adminSocket: null, isConnected: false });
      },

      markAsRead: (notificationId: string) => {
        console.log(
          "[Notifications] Marking notification as read:",
          notificationId
        );
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllAsRead: () => {
        console.log("[Notifications] Marking all notifications as read");
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (notificationId: string) => {
        console.log("[Notifications] Deleting notification:", notificationId);
        set((state) => ({
          notifications: state.notifications.filter(
            (n) => n.id !== notificationId
          ),
          unreadCount: state.notifications.find((n) => n.id === notificationId)
            ?.read
            ? state.unreadCount
            : Math.max(0, state.unreadCount - 1),
        }));
      },

      deleteAllNotifications: () => {
        console.log("[Notifications] Deleting all notifications");
        set({ notifications: [], unreadCount: 0 });
      },

      handleNotificationClick: (notification: Notification) => {
        console.log("[Notifications] Handling notification click:", {
          type: notification.type,
          content: notification.content,
          data: notification.data,
        });

        const isAdmin = sessionStorage.getItem("user-role") === "admin";

        if (!notification.read) {
          console.log(
            "[Notifications] Marking notification as read before navigation"
          );
          get().markAsRead(notification.id);
        }

        switch (notification.type) {
          case "chat":
            if (isAdmin) {
              console.log("[Notifications] Admin chat notification clicked:", {
                userId: notification.data.userId,
                path: "/admin/chat",
              });
              return {
                type: "chat",
                path: "/admin/chat",
                data: { userId: notification.data.userId },
              };
            } else {
              console.log("[Notifications] User chat notification clicked");
              return {
                type: "chat",
                path: "/dashboard/chat",
              };
            }
          case "transaction":
            console.log("[Notifications] Transaction notification clicked:", {
              isAdmin,
              path: isAdmin ? "/admin/transactions" : "/dashboard/transactions",
            });
            return {
              type: "transaction",
              path: isAdmin ? "/admin/transactions" : "/dashboard/transactions",
            };
          default:
            console.log(
              "[Notifications] Unknown notification type clicked:",
              notification.type
            );
            return {
              type: "unknown",
              path: isAdmin ? "/admin/dashboard" : "/dashboard",
            };
        }
      },
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        isConnected: state.isConnected,
      }),
    }
  )
);
