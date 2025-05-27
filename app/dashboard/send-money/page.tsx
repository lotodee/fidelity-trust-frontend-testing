"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTransferStore } from "@/lib/store/transfer"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, User, Building, Mail, CreditCard } from "lucide-react"

const transferOptions = [
  {
    id: "zelle",
    name: "Zelle",
    description: "Send money instantly with email or phone",
    icon: "/placeholder.svg?height=40&width=40",
    disabled: true,
    comingSoon: true,
  },
  {
    id: "wire",
    name: "Wire Transfer",
    description: "Secure bank-to-bank transfers",
    icon: Building,
    disabled: false,
  },
  {
    id: "billpay",
    name: "Bill Pay",
    description: "Pay bills and utilities",
    icon: CreditCard,
    disabled: true,
    comingSoon: true,
  },
  {
    id: "mailcheck",
    name: "Mail Check",
    description: "Send physical checks by mail",
    icon: Mail,
    disabled: false,
  },
  {
    id: "member",
    name: "Member to Member",
    description: "Transfer to other FidelityTrust members",
    icon: User,
    disabled: false,
  },
]

export default function SendMoney() {
  const { toast } = useToast()
  const {
    isModalOpen,
    selectedType,
    formData,
    isLoading,
    searchResults,
    openModal,
    closeModal,
    setFormData,
    setLoading,
    setSearchResults,
  } = useTransferStore()

  const [pin, setPin] = useState("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState([
    {
      id: 1,
      recipient: "John Doe",
      type: "Wire Transfer",
      amount: "$250.00",
      date: "May 18, 2025",
      status: "Pending",
    },
  ])

  const handleTransferClick = (type: string) => {
    const option = transferOptions.find((opt) => opt.id === type)
    if (option?.disabled) {
      toast({
        title: "Coming Soon",
        description: `${option.name} will be available soon!`,
      })
      return
    }
    openModal(type as any)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPinDialog(true)
  }

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      toast({
        variant: "destructive",
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
      })
      return
    }

    setLoading(true)
    setShowPinDialog(false)

    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: Date.now(),
        recipient: formData.recipientName || formData.memberEmail || "Unknown",
        type: transferOptions.find((opt) => opt.id === selectedType)?.name || "Transfer",
        amount: `$${Number.parseFloat(formData.amount).toFixed(2)}`,
        date: new Date().toLocaleDateString(),
        status: "Pending",
      }

      setPendingTransactions([newTransaction, ...pendingTransactions])
      setLoading(false)
      closeModal()
      setPin("")

      toast({
        title: "Transfer Initiated",
        description: "Your transfer has been submitted for processing.",
      })
    }, 2000)
  }

  const handleMemberSearch = (email: string) => {
    if (email.length > 2) {
      // Simulate member search
      const mockResults = [
        { id: 1, name: "John Smith", email: "john.smith@email.com", accountNumber: "****1234" },
        { id: 2, name: "Jane Doe", email: "jane.doe@email.com", accountNumber: "****5678" },
      ].filter(
        (user) =>
          user.email.toLowerCase().includes(email.toLowerCase()) ||
          user.name.toLowerCase().includes(email.toLowerCase()),
      )
      setSearchResults(mockResults)
    } else {
      setSearchResults([])
    }
  }

  const renderTransferForm = () => {
    switch (selectedType) {
      case "wire":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName || ""}
                onChange={(e) => setFormData({ recipientName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Account Number *</Label>
              <Input
                id="recipientAccount"
                value={formData.recipientAccount || ""}
                onChange={(e) => setFormData({ recipientAccount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber || ""}
                onChange={(e) => setFormData({ routingNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={formData.bankName || ""}
                onChange={(e) => setFormData({ bankName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAddress">Bank Address</Label>
              <Textarea
                id="bankAddress"
                value={formData.bankAddress || ""}
                onChange={(e) => setFormData({ bankAddress: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        )

      case "member":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberSearch">Search Member *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="memberSearch"
                  placeholder="Enter email or name"
                  value={formData.memberEmail || ""}
                  onChange={(e) => {
                    setFormData({ memberEmail: e.target.value })
                    handleMemberSearch(e.target.value)
                  }}
                  className="pl-10"
                  required
                />
              </div>
              {searchResults.length > 0 && (
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setFormData({
                          memberEmail: user.email,
                          memberAccountNumber: user.accountNumber,
                        })
                        setSearchResults([])
                      }}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">Account: {user.accountNumber}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case "mailcheck":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName || ""}
                onChange={(e) => setFormData({ recipientName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Mailing Address *</Label>
              <Textarea
                id="recipientAddress"
                value={formData.recipientAddress || ""}
                onChange={(e) => setFormData({ recipientAddress: e.target.value })}
                placeholder="Enter complete mailing address"
                rows={3}
                required
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold mb-6">Send Money</h1>

          {/* Transfer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {transferOptions.map((option, index) => {
              const IconComponent =
                typeof option.icon === "string"
                  ? () => <img src={option.icon || "/placeholder.svg"} alt={option.name} className="h-8 w-8" />
                  : option.icon

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      option.disabled ? "opacity-60" : "hover:scale-105"
                    }`}
                    onClick={() => handleTransferClick(option.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{option.name}</h3>
                            {option.comingSoon && (
                              <Badge variant="secondary" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Pending Transfers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>Track the status of your money transfers</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingTransactions.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{tx.amount}</div>
                          <Badge
                            variant={tx.status === "Pending" ? "secondary" : "default"}
                            className={tx.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          To: {tx.recipient} • {tx.type}
                        </div>
                        <div className="text-sm text-gray-500">Date: {tx.date}</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No recent transfers</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Transfer Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedType && transferOptions.find((opt) => opt.id === selectedType)?.name}</DialogTitle>
              <DialogDescription>Enter the transfer details below</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderTransferForm()}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.amount}
                    onChange={(e) => setFormData({ amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What's this transfer for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                  Continue
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* PIN Verification Dialog */}
        <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Your PIN</DialogTitle>
              <DialogDescription>Enter your 4-digit PIN to authorize this transfer</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Transaction PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest"
                  placeholder="••••"
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowPinDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  disabled={isLoading || pin.length !== 4}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Authorize Transfer"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
