"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { transactionsAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { DollarSign, Search, Edit, Loader2, Plus, ArrowUpRight, ArrowDownRight, Send } from "lucide-react"

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [searchTerm, typeFilter, transactions])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await transactionsAPI.getAllTransactions()
      setTransactions(response.transactions)
      setFilteredTransactions(response.transactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm),
      )
    }

    setFilteredTransactions(filtered)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-5 w-5 text-emerald-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "transfer":
        return <Send className="h-5 w-5 text-blue-500" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Transaction Management</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => router.push("/admin/transactions/create")}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Transaction
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Manage all transactions in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="mr-2">{getTransactionIcon(transaction.type)}</div>
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${
                            transaction.type === "deposit"
                              ? "text-emerald-600"
                              : transaction.type === "withdrawal"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/transactions/${transaction._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="mt-1">
                  {searchTerm || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start by creating a new transaction"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
