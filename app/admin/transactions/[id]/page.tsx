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

export default function EditTransaction({ params }: { params: { id: string } }) {
  const [transaction, setTransaction] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [userId, setUserId] = useState("")
  const [recipientId, setRecipientId] = useState("")
  const [type, setType] = useState("deposit")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("pending")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch users first
      const usersResponse = await usersAPI.getAllUsers()
      setUsers(usersResponse.users)

      // Then fetch transaction
      const transactionResponse = await transactionsAPI.getTransactionById(params.id)
      const transactionData = transactionResponse.transaction
      setTransaction(transactionData)

      // Set form values
      setUserId(transactionData.userId)
      setType(transactionData.type)
      setAmount(transactionData.amount.toString())
      setStatus(transactionData.status)
      setDescription(transactionData.description || "")
      if (transactionData.recipientId) {
        setRecipientId(transactionData.recipientId)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transaction details. Please try again.",
      })
      router.push("/admin/transactions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !status) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      })
      return
    }

    setIsSaving(true)
    try {
      const transactionData = {
        status,
        amount: Number.parseFloat(amount),
        description,
      }

      await transactionsAPI.updateTransaction(params.id, transactionData)

      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating transaction:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transaction. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </AdminLayout>
    )
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
            <CardTitle>Edit Transaction</CardTitle>
            <CardDescription>Update transaction details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User</Label>
                <Select value={userId} disabled>
                  <SelectTrigger id="userId">
                    <SelectValue>
                      {users.find((user) => user._id === userId)?.firstName}{" "}
                      {users.find((user) => user._id === userId)?.lastName}
                    </SelectValue>
                  </SelectTrigger>
                </Select>
                <p className="text-sm text-gray-500">User cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={type} disabled>
                  <SelectTrigger id="type">
                    <SelectValue>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectValue>
                  </SelectTrigger>
                </Select>
                <p className="text-sm text-gray-500">Transaction type cannot be changed</p>
              </div>

              {type === "transfer" && (
                <div className="space-y-2">
                  <Label htmlFor="recipientId">Recipient</Label>
                  <Select value={recipientId} disabled>
                    <SelectTrigger id="recipientId">
                      <SelectValue>
                        {users.find((user) => user._id === recipientId)?.firstName}{" "}
                        {users.find((user) => user._id === recipientId)?.lastName}
                      </SelectValue>
                    </SelectTrigger>
                  </Select>
                  <p className="text-sm text-gray-500">Recipient cannot be changed</p>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter transaction description"
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
