"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Search,
  MoreVertical,
  MessageSquare,
  Loader2,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/lib/store/auth";
import { usersAPI } from "@/lib/api/users";
import { chatAPI } from "@/lib/api/chat";
import { TimeStamp } from "@/components/ui/time-stamp";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAdminChatStore } from "@/lib/store/admin-chat";

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

function ChatContent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: adminUser } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const NAME_SPACE = "/admin";
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    users,
    existingChats,
    isLoading,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    fetchExistingChats,
    updateUserStatus,
    updateUserTyping,
    updateUserLastMessage,
    updateUserUnreadCount,
    selectedUser,
    selectUser,
  } = useAdminChatStore();

  useEffect(() => {
    if (!adminUser) {
      router.push("/auth/entry");
      return;
    }

    fetchUsers();
    fetchExistingChats();
    initializeSocket();
  }, [adminUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      if (selectedUser && message.userId === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: message._id,
            content: message.content,
            sender: message.sender === "customer" ? "user" : "admin",
            timestamp: new Date(message.timestamp),
            isRead: message.isRead || false,
            userId: message.userId,
          },
        ]);
        scrollToBottom();
      }

      updateUserLastMessage(message.userId, {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        timestamp: new Date(message.timestamp),
        isRead: message.isRead || false,
        userId: message.userId,
      });

      if (message.sender === "customer" && !message.isRead) {
        const user = users.find((u) => u._id === message.userId);
        if (user) {
          updateUserUnreadCount(message.userId, (user.unreadCount || 0) + 1);
        }
      }
    };

    const handleUserTyping = ({ userId }: { userId: string }) => {
      updateUserTyping(userId, true);
    };

    const handleUserStoppedTyping = ({ userId }: { userId: string }) => {
      updateUserTyping(userId, false);
    };

    const handleUserStatus = ({
      userId,
      status,
    }: {
      userId: string;
      status: boolean;
    }) => {
      updateUserStatus(userId, status);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);
    socket.on("user_status", handleUserStatus);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
      socket.off("user_status", handleUserStatus);
    };
  }, [socket, selectedUser, users]);

  const initializeSocket = () => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}${NAME_SPACE}`, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      if (adminUser?._id) {
        newSocket.emit("join", adminUser._id);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("[Admin Chat] Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  };

  const fetchUserMessages = async (userId: string) => {
    const response = await chatAPI.getUserMessagesByUserId(userId);

    if (response.success) {
      const transformedMessages = response.data.map((msg: any) => ({
        _id: msg._id,
        content: msg.message,
        sender: msg.isUser ? ("user" as const) : ("admin" as const),
        timestamp: new Date(msg.createdAt),
        isRead: msg.isRead || false,
        userId: msg.userId,
      }));
      setMessages(transformedMessages);
      scrollToBottom();
    }
  };

  const handleUserSelect = async (user: User) => {
    selectUser(user);
    await fetchUserMessages(user._id);

    if (user.unreadCount && user.unreadCount > 0) {
      try {
        await chatAPI.markAdminMessagesRead(user._id);
        updateUserUnreadCount(user._id, 0);
      } catch (error) {
        console.error(
          `Error marking messages as read for user ${user._id}:`,
          error
        );
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser || !socket) {
      return;
    }

    try {
      const response = await chatAPI.sendAdminMessage(
        selectedUser._id,
        message
      );

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            _id: response.data._id,
            content: message,
            sender: "admin",
            timestamp: new Date(response.data.createdAt),
            isRead: false,
            userId: selectedUser._id,
          },
        ]);

        updateUserLastMessage(selectedUser._id, {
          _id: response.data._id,
          content: message,
          sender: "admin",
          timestamp: new Date(response.data.createdAt),
          isRead: false,
          userId: selectedUser._id,
        });

        socket.emit("message", {
          userId: selectedUser._id,
          message: {
            _id: response.data._id,
            content: message,
            sender: "admin",
            timestamp: new Date(),
            isRead: false,
            userId: selectedUser._id,
          },
        });

        setMessage("");
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExistingChats = existingChats.filter(
    (chat) =>
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin-role");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel.",
    });

    router.push("/auth/entry");
  };

  const handleTyping = () => {
    if (!socket || !selectedUser?._id) return;

    setIsTyping(true);
    socket.emit("admin_typing", { userId: selectedUser._id, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("admin_typing", {
        userId: selectedUser._id,
        isTyping: false,
      });
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col p-4"
      >
        <div className="flex h-full gap-4">
          {/* Users Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-80 bg-white rounded-2xl shadow-sm flex flex-col ${
              selectedUser ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Messages
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                  </div>
                ) : (
                  <div className="p-2 space-y-4">
                    {/* Existing Conversations */}
                    {filteredExistingChats.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 px-3 mb-2">
                          Existing Conversations
                        </h3>
                        <div className="space-y-1">
                          {filteredExistingChats.map((chat) => (
                            <motion.div
                              key={chat.userId}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedUser?._id === chat.userId
                                  ? "bg-emerald-50"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => {
                                const user = users.find(
                                  (u) => u._id === chat.userId
                                );
                                if (user) handleUserSelect(user);
                              }}
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-emerald-100">
                                  <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                    {chat.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {chat.isOnline && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">
                                    {chat.userName}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    <TimeStamp timestamp={chat.lastMessageAt} />
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage}
                                  </p>
                                  {chat.isTyping && (
                                    <span className="text-xs text-emerald-500">
                                      typing...
                                    </span>
                                  )}
                                </div>
                              </div>
                              {chat.unreadCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shadow-sm"
                                >
                                  {chat.unreadCount}
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Users */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 px-3 mb-2">
                        All Users
                      </h3>
                      <div className="space-y-1">
                        {filteredUsers
                          .filter(
                            (user) =>
                              !existingChats.some(
                                (chat) => chat.userId === user._id
                              )
                          )
                          .map((user) => (
                            <motion.div
                              key={user._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedUser?._id === user._id
                                  ? "bg-emerald-50"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleUserSelect(user)}
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-emerald-100">
                                  <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                    {user.firstName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {user.isOnline && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  {user.lastMessage && (
                                    <span className="text-xs text-gray-500">
                                      <TimeStamp
                                        timestamp={user.lastMessage.timestamp}
                                      />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-500 truncate">
                                    {user.lastMessage?.content ||
                                      "No messages yet"}
                                  </p>
                                  {user.isTyping && (
                                    <span className="text-xs text-emerald-500">
                                      typing...
                                    </span>
                                  )}
                                </div>
                              </div>
                              {user.unreadCount && user.unreadCount > 0 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shadow-sm"
                                >
                                  {user.unreadCount}
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col"
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-emerald-100">
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {selectedUser.firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {selectedUser.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedUser.isTyping
                          ? "typing..."
                          : selectedUser.isOnline
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => selectUser(null)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${
                            msg.sender === "admin"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-end gap-2 max-w-[75%] ${
                              msg.sender === "admin" ? "flex-row-reverse" : ""
                            }`}
                          >
                            {msg.sender === "user" && (
                              <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-emerald-100">
                                <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                  {selectedUser.firstName
                                    .charAt(0)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                msg.sender === "admin"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <div
                                className={`flex items-center gap-2 mt-1.5 ${
                                  msg.sender === "admin"
                                    ? "text-emerald-50"
                                    : "text-gray-500"
                                }`}
                              >
                                <TimeStamp timestamp={msg.timestamp} />
                                {msg.sender === "admin" && (
                                  <span className="text-xs opacity-80">
                                    {msg.isRead ? "Read" : "Delivered"}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Input
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <Button
                      type="submit"
                      className="h-11 w-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Select a user to start chatting
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Choose from the list of users on the left
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminChat() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </AdminLayout>
  );
}
