"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { transactionsAPI, usersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function CreateTransaction() {
  const [users, setUsers] = useState<any[]>([])
  const [userId, setUserId] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [type, setType] = useState("deposit")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("pending")
  const [description, setDescription] = useState("")
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const response = await usersAPI.getAllUsers()
      setUsers(response.users)
      if (response.users.length > 0) {
        setUserId(response.users[0]._id)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId || !type || !amount || !status) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      })
      return
    }

    if (type === "transfer" && !recipientId) {
      toast({
        variant: "destructive",
        title: "Missing recipient",
        description: "Please select a recipient for the transfer.",
      })
      return
    }

    setIsCreating(true)
    try {
      const transactionData = {
        userId,
        type,
        amount: Number.parseFloat(amount),
        status,
        description,
        ...(type === "transfer" && { recipientId }),
      }

      await transactionsAPI.createTransaction(transactionData)

      toast({
        title: "Transaction created",
        description: "The transaction has been created successfully.",
      })

      router.push("/admin/transactions")
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create Transaction</CardTitle>
            <CardDescription>Create a new transaction in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User</Label>
                  <Select value={userId} onValueChange={setUserId} required>
                    <SelectTrigger id="userId">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === "transfer" && (
                  <div className="space-y-2">
                    <Label htmlFor="recipientId">Recipient</Label>
                    <Select value={recipientId} onValueChange={setRecipientId} required>
                      <SelectTrigger id="recipientId">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((user) => user._id !== userId)
                          .map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.firstName} {user.lastName} ({user.email})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus} required>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter transaction description"
                    rows={3}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Transaction"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
