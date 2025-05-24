"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Send, Loader2 } from "lucide-react"

export default function SendMoney() {
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState([
    {
      id: 1,
      recipient: "John Doe",
      bank: "Chase Bank",
      amount: "$250.00",
      date: "May 18, 2025",
      status: "Pending",
    },
  ])
  const { toast } = useToast()

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault()

    if (!accountName || !accountNumber || !bankName || !amount) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Add to pending transactions
      const newTransaction = {
        id: Date.now(),
        recipient: accountName,
        bank: bankName,
        amount: `$${Number.parseFloat(amount).toFixed(2)}`,
        date: new Date().toLocaleDateString(),
        status: "Pending",
      }

      setPendingTransactions([newTransaction, ...pendingTransactions])

      // Reset form
      setAccountName("")
      setAccountNumber("")
      setBankName("")
      setAmount("")
      setDescription("")

      setIsLoading(false)

      toast({
        title: "Money sent successfully",
        description: "Your transaction is pending approval.",
      })
    }, 2000)
  }

  const banks = [
    "Chase Bank",
    "Bank of America",
    "Wells Fargo",
    "Citibank",
    "Capital One",
    "TD Bank",
    "PNC Bank",
    "U.S. Bank",
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Send Money</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient's details to send money.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMoney} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="John Doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select value={bankName} onValueChange={setBankName} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this payment for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Money
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Transfers</CardTitle>
              <CardDescription>Track the status of your money transfers.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTransactions.length > 0 ? (
                <div className="space-y-4">
                  {pendingTransactions.map((tx) => (
                    <div key={tx.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{tx.amount}</div>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        To: {tx.recipient} • {tx.bank}
                      </div>
                      <div className="text-sm text-gray-500">Date: {tx.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No pending transfers.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
