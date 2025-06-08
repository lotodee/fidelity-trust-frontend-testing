import api from "./axios";


export const notificationsAPI = {
  // Get all notifications for the current user
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },

  // Mark a notification as read
  markAsRead: async (notificationId: string) => {
    const response = await api.put(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(
      `/notifications/${notificationId}`
    );
    return response.data;
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    const response = await api.delete("/notifications");
    return response.data;
  },
};
