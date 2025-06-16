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

interface ExistingChat {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  messages: any[];
  isOnline?: boolean;
  isTyping?: boolean;
}

interface AdminChatStore {
  users: User[];
  existingChats: ExistingChat[];
  isLoading: boolean;
  searchQuery: string;
  selectedUser: User | null;
  setSearchQuery: (query: string) => void;
  fetchUsers: () => Promise<void>;
  fetchExistingChats: () => Promise<void>;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  updateUserTyping: (userId: string, isTyping: boolean) => void;
  updateUserLastMessage: (userId: string, message: any) => void;
  updateUserUnreadCount: (userId: string, count: number) => void;
  selectUser: (user: User) => void;
}

export const useAdminChatStore = create<AdminChatStore>((set, get) => ({
  users: [],
  existingChats: [],
  isLoading: false,
  searchQuery: "",
  selectedUser: null,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  fetchExistingChats: async () => {
    try {
      set({ isLoading: true });
      const response = await chatAPI.getAllMessages();

      if (response.success) {
        const formattedChats = response.data.map((chat: any) => ({
          userId: chat.userId,
          userName: chat.userName,
          userEmail: chat.userEmail,
          lastMessage: chat.lastMessage,
          lastMessageAt: new Date(chat.lastMessageAt),
          unreadCount: chat.unreadCount,
          messages: chat.messages,
          isOnline: chat.isOnline,
          isTyping: chat.isTyping,
        }));
        set({ existingChats: formattedChats });
      }
    } catch (error) {
      console.error("Error fetching existing chats:", error);
    } finally {
      set({ isLoading: false });
    }
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
                (msg: any) => msg.isUser && !msg.isRead
              ).length;
              const lastMessage = messages[messages.length - 1];

              return {
                ...user,
                unreadCount,
                isOnline: true,
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
                isOnline: true,
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

  updateUserStatus: (userId: string, isOnline: boolean) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, isOnline } : user
      ),
      existingChats: state.existingChats.map((chat) =>
        chat.userId === userId ? { ...chat, isOnline } : chat
      ),
    }));
  },

  updateUserTyping: (userId: string, isTyping: boolean) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, isTyping } : user
      ),
      existingChats: state.existingChats.map((chat) =>
        chat.userId === userId ? { ...chat, isTyping } : chat
      ),
    }));
  },

  updateUserLastMessage: (userId: string, message: any) => {
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
      existingChats: state.existingChats.map((chat) =>
        chat.userId === userId
          ? {
              ...chat,
              lastMessage: message.content,
              lastMessageAt: message.timestamp,
            }
          : chat
      ),
    }));
  },

  updateUserUnreadCount: (userId: string, count: number) => {
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, unreadCount: count } : user
      ),
      existingChats: state.existingChats.map((chat) =>
        chat.userId === userId ? { ...chat, unreadCount: count } : chat
      ),
    }));
  },

  selectUser: (user: User) => {
    set({ selectedUser: user });
  },
}));
