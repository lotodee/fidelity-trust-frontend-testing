import api from "./axios";
import { mockData } from "@/lib/mock-data";

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real";

export interface ChatMessage {
  _id: string;
  userId: string;
  message: string;
  sender: "user" | "admin";
  createdAt: string;
}

export const chatAPI = {
  getUserMessages: async () => {
    if (APP_STATE === "mock") {
      return mockData.getUserMessages();
    }

    const response = await api.get("/chat/messages");
    return response.data;
  },

  getAllMessages: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllMessages();
    }

    const response = await api.get("/chat/admin/messages");
    return response.data;
  },

  getUserMessagesByUserId: async (userId: string) => {
    if (APP_STATE === "mock") {
      return mockData.getUserMessagesByUserId(userId);
    }

    const response = await api.get(`/chat/admin/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (message: string) => {
    if (APP_STATE === "mock") {
      return mockData.sendMessage(message);
    }

    const response = await api.post("/chat/messages", { message });
    return response.data;
  },

  sendAdminMessage: async (userId: string, message: string) => {
    if (APP_STATE === "mock") {
      return mockData.sendAdminMessage(userId, message);
    }

    const response = await api.post("/chat/admin/messages", {
      userId,
      message,
    });
    return response.data;
  },

  markMessagesRead: async () => {
    if (APP_STATE === "mock") {
      return { success: true };
    }

    const response = await api.post("/chat/messages/read");
    return response.data;
  },

  markAdminMessagesRead: async (userId: string) => {
    if (APP_STATE === "mock") {
      return { success: true };
    }

    const response = await api.put(`/chat/admin/messages/${userId}/read`);
    return response.data;
  },
};
