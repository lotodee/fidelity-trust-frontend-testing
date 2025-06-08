import { create } from "zustand";
import { notificationsAPI } from "@/lib/api/notifications";
import { io, Socket } from "socket.io-client";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "transaction" | "system" | "alert";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  data?: {
    transactionId?: string;
    amount?: number;
    status?: string;
  };
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  isLoading: boolean;
  error: string | null;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  socket: null,
  isLoading: false,
  error: null,

  initializeSocket: () => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: {
          token:
            sessionStorage.getItem("auth-token") ||
            sessionStorage.getItem("adminToken"),
        },
      }
    );

    socket.on("notification", (notification: Notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await notificationsAPI.getNotifications();
      const unreadCount = response.data.filter(
        (n: Notification) => !n.read
      ).length;
      set({ notifications: response.data, unreadCount, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error) {
      set({ error: "Failed to mark notification as read" });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({ error: "Failed to mark all notifications as read" });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n._id !== notificationId
        ),
        unreadCount: state.notifications.find((n) => n._id === notificationId)
          ?.read
          ? state.unreadCount
          : state.unreadCount - 1,
      }));
    } catch (error) {
      set({ error: "Failed to delete notification" });
    }
  },

  deleteAllNotifications: async () => {
    try {
      await notificationsAPI.deleteAllNotifications();
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      set({ error: "Failed to delete all notifications" });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
