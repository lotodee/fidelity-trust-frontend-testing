"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, User, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { io, type Socket } from "socket.io-client"

interface Message {
  id: number
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")

    socketRef.current.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to chat server")
    })

    socketRef.current.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from chat server")
    })

    socketRef.current.on("message", (data: any) => {
      const newMessage: Message = {
        id: Date.now(),
        text: data.message || data.text,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Send message via Socket.IO
    if (socketRef.current && isConnected) {
      socketRef.current.emit("message", {
        text: message,
        userId: "user123", // This should come from auth context
        timestamp: new Date(),
      })
    }

    setMessage("")
    setIsTyping(true)

    // Simulate agent response if not connected to real backend
    if (!isConnected) {
      setTimeout(() => {
        const agentMessage: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message. An agent will respond shortly.",
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 rounded-full h-14 w-14 shadow-lg bg-emerald-500 hover:bg-emerald-600 text-navy-900 z-50"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[90vw] max-w-md h-[70vh] max-h-[500px] z-50"
          >
            <Card className="h-full flex flex-col shadow-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between p-4 border-b bg-emerald-500 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Customer Support</h3>
                    <div className="flex items-center gap-1 text-xs">
                      <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-300" : "bg-red-300"}`} />
                      {isConnected ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.sender === "user" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {msg.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.sender === "user" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="text-sm">{msg.text}</div>
                        <div
                          className={`text-xs mt-1 opacity-70 ${
                            msg.sender === "user" ? "text-emerald-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                        <Bot className="h-3 w-3" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
