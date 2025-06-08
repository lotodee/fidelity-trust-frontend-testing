import { create } from "zustand";
import { usersAPI } from "@/lib/api/users";
import { chatAPI } from "@/lib/api/chat";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  unreadCount?: number;
  isTyping?: boolean;
  isOnline?: boolean;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}

interface Message {
  _id: string;
  content: string;
  sender: "user" | "admin" | "customer";
  timestamp: Date;
  isRead: boolean;
  userId: string;
}

interface AdminChatStore {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchUsers: () => Promise<void>;
  updateUserStatus: (userId: string, status: boolean) => void;
  updateUserTyping: (userId: string, isTyping: boolean) => void;
  updateUserLastMessage: (userId: string, message: Message) => void;
  updateUserUnreadCount: (userId: string, count: number) => void;
}

export const useAdminChatStore = create<AdminChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  searchQuery: "",

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  fetchUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await usersAPI.getAllUsers();

      if (response.success) {
        const usersWithChats = await Promise.all(
          response.data.map(async (user: User) => {
            try {
              const chatResponse = await chatAPI.getUserMessagesByUserId(
                user._id
              );
              const messages = chatResponse.data || [];
              const unreadCount = messages.filter(
                (msg: Message) => msg.sender === "user" && !msg.isRead
              ).length;
              const lastMessage = messages[messages.length - 1];

              return {
                ...user,
                unreadCount,
                isOnline: true, // Default to online
                lastMessage: lastMessage
                  ? {
                      content: lastMessage.message,
                      timestamp: new Date(lastMessage.createdAt),
                    }
                  : undefined,
              };
            } catch (error) {
              console.error(
                `Error fetching messages for user ${user._id}:`,
                error
              );
              return {
                ...user,
                isOnline: true, // Default to online even on error
              };
            }
          })
        );
        set({ users: usersWithChats });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserStatus: (userId: string, status: boolean) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, isOnline: status } : user
      ),
    }));
  },

  updateUserTyping: (userId: string, isTyping: boolean) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, isTyping } : user
      ),
    }));
  },

  updateUserLastMessage: (userId: string, message: Message) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId
          ? {
              ...user,
              lastMessage: {
                content: message.content,
                timestamp: message.timestamp,
              },
            }
          : user
      ),
    }));
  },

  updateUserUnreadCount: (userId: string, count: number) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, unreadCount: count } : user
      ),
    }));
  },
}));
