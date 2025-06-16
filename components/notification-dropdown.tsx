"use client";

import { Bell, MessageSquare, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/lib/store/notifications";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminChatStore } from "@/lib/store/admin-chat";

export function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    handleNotificationClick,
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const lastNotificationTime = useRef<number>(0);
  const router = useRouter();
  const { users, fetchUsers, selectUser } = useAdminChatStore();

  useEffect(() => {
    // Initialize notification sound
    notificationSound.current = new Audio("/notification-sound.mp3");
  }, []);

  useEffect(() => {
    // Get the latest notification
    const latestNotification = notifications[0];
    if (
      !latestNotification ||
      !latestNotification.type ||
      !latestNotification.content ||
      !latestNotification.data ||
      latestNotification.existing // Skip if notification has already been shown
    ) {
      console.log(
        "[NotificationDropdown] Invalid or existing notification received, skipping sound and dropdown"
      );
      return;
    }

    const currentTime = new Date().getTime();
    const timeSinceLastNotification =
      currentTime - lastNotificationTime.current;

    // Only play sound and open dropdown if it's been more than 5 seconds since the last notification
    if (timeSinceLastNotification > 5000) {
      console.log("[NotificationDropdown] Playing notification sound for:", {
        type: latestNotification.type,
        content: latestNotification.content,
        data: latestNotification.data,
      });

      // Play notification sound
      notificationSound.current?.play().catch((error) => {
        console.error(
          "[NotificationDropdown] Error playing notification sound:",
          error
        );
      });

      // Open dropdown
      setIsOpen(true);

      // Update last notification time
      lastNotificationTime.current = currentTime;

      // Mark notification as existing
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === latestNotification.id ? { ...n, existing: true } : n
        ),
      }));
    }
  }, [notifications]);

  const handleNotificationAction = async (notification: any) => {
    console.log("[NotificationDropdown] Handling notification action:", {
      type: notification.type,
      data: notification.data,
      content: notification.content,
    });

    const result = handleNotificationClick(notification);

    // Close the dropdown
    setIsOpen(false);

    // Handle routing based on notification type
    if (result?.type === "chat" && result?.data?.userId !== "admin") {
      console.log("[NotificationDropdown] Processing chat notification:", {
        userId: result?.data?.senderId,
        path: result.path,
      });

      // For admin chat, we need to fetch users and select the specific user
      if (result.path === "/admin/chat") {
        console.log("[NotificationDropdown] Fetching users for admin chat");
        await fetchUsers();
        const targetUser = users.find((u) => u._id === result.data.senderId);

        console.log("found the target user", targetUser);
        console.log("[NotificationDropdown] Found target user:", targetUser);
        if (targetUser) {
          console.log("[NotificationDropdown] Selecting user:", targetUser._id);
          selectUser(targetUser);
        } else {
          console.warn(
            "[NotificationDropdown] Target user not found:",
            result.data.userId
          );
        }
      }
    }

    // Navigate to the appropriate page
    console.log("[NotificationDropdown] Navigating to:", result.path);
    router.push(result.path);
  };

  const getNotificationContent = (notification: any) => {
    if (notification.type === "transaction") {
      const { action, amount, status } = notification.data;
      return {
        icon: <CreditCard className="h-4 w-4" />,
        title: `${action === "credit" ? "Credit" : "Debit"} Alert`,
        description: `${
          action === "credit" ? "Received" : "Sent"
        } ${amount} - ${status}`,
      };
    } else if (notification.type === "chat") {
      const { isAdmin } = notification.data;
      return {
        icon: <MessageSquare className="h-4 w-4" />,
        title: isAdmin ? "New Message from Admin" : "New Message",
        description: notification.content,
      };
    }
    return {
      icon: <Bell className="h-4 w-4" />,
      title: "Notification",
      description: notification.content,
    };
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => useNotificationStore.getState().markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const content = getNotificationContent(notification);
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 cursor-pointer",
                    !notification.read && "bg-emerald-50/50"
                  )}
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {content.icon}
                      <span className="font-medium">{content.title}</span>
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{content.description}</p>
                  <span className="text-xs text-gray-500">
                    {format(notification.timestamp, "MMM d, h:mm a")}
                  </span>
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
