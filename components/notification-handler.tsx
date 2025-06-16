"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/lib/store/notifications";
import { useToast } from "@/components/ui/use-toast";

export function NotificationHandler() {
  const { notifications, initializeSocket, disconnectSocket } =
    useNotificationStore();
  const { toast } = useToast();

  useEffect(() => {
    console.log("[NotificationHandler] Initializing...");
    initializeSocket();
    return () => {
      console.log("[NotificationHandler] Cleaning up...");
      disconnectSocket();
    };
  }, [initializeSocket, disconnectSocket]);

  useEffect(() => {
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      console.log(
        "[NotificationHandler] Showing toast for new notification:",
        latestNotification
      );

      let title = "";
      let description = "";

      if (latestNotification.type === "transaction") {
        const { action, amount, status } = latestNotification.data;
        title = `${action === "credit" ? "Credit" : "Debit"} Alert`;
        description = `${
          action === "credit" ? "Received" : "Sent"
        } ${amount} - ${status}`;
      } else if (latestNotification.type === "chat") {
        const { isAdmin } = latestNotification.data;
        title = isAdmin ? "New Message from Admin" : "New Message";
        description = latestNotification.content;
      }

      toast({
        title,
        description,
        duration: 5000,
        onClick: () => {
          console.log(
            "[NotificationHandler] Toast clicked, handling notification click"
          );
          useNotificationStore
            .getState()
            .handleNotificationClick(latestNotification);
        },
      });
    }
  }, [notifications, toast]);

  return null;
}
