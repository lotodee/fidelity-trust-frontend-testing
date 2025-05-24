"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send } from "lucide-react"

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can I help you today?", sender: "agent" }])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage = { id: Date.now(), text: message, sender: "user" }
    setMessages([...messages, userMessage])
    setMessage("")

    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        text: "Thanks for your message. An agent will respond shortly.",
        sender: "agent",
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 1000)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 rounded-full h-14 w-14 shadow-lg bg-emerald-500 hover:bg-emerald-600 text-navy-900"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[90vw] max-w-md h-[70vh] max-h-[500px] flex flex-col shadow-xl border border-gray-200 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Customer Support</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-emerald-500 hover:bg-emerald-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
