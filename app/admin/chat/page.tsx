"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, MessageSquare } from "lucide-react";

interface User {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "admin";
  timestamp: Date;
}

export default function AdminChat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample users data
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "I need help with my transaction",
      timestamp: new Date(),
      unread: 2,
      avatar: "/user1.png",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Thank you for your assistance",
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      avatar: "/user2.png",
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "When will my account be activated?",
      timestamp: new Date(Date.now() - 7200000),
      unread: 1,
      avatar: "/user3.png",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: "admin",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate user response
    setTimeout(() => {
      const userResponse: Message = {
        id: messages.length + 2,
        content: "Thank you for your help!",
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userResponse]);
    }, 1000);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-8rem)]"
        >
          <Card className="h-full border-none shadow-lg">
            <div className="grid grid-cols-12 h-full">
              {/* Users List */}
              <div className="col-span-4 border-r">
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </CardHeader>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-1 p-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? "bg-emerald-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{user.name}</p>
                            <span className="text-xs text-gray-500">
                              {user.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {user.lastMessage}
                          </p>
                        </div>
                        {user.unread > 0 && (
                          <div className="h-5 w-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                            {user.unread}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Panel */}
              <div className="col-span-8 flex flex-col">
                {selectedUser ? (
                  <>
                    <CardHeader className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={selectedUser.avatar}
                              alt={selectedUser.name}
                            />
                            <AvatarFallback>
                              {selectedUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {selectedUser.name}
                            </CardTitle>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.sender === "admin"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex items-end space-x-2 max-w-[80%] ${
                                msg.sender === "admin"
                                  ? "flex-row-reverse space-x-reverse"
                                  : ""
                              }`}
                            >
                              {msg.sender === "user" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                  />
                                  <AvatarFallback>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  msg.sender === "admin"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {msg.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <form
                        onSubmit={handleSendMessage}
                        className="flex space-x-2"
                      >
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                        />
                        <Button
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-600"
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
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
