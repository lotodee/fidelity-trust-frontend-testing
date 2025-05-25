"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usersAPI, transactionsAPI } from "@/lib/api"
import { Users, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0)
  const [transactionCount, setTransactionCount] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch users
        const usersResponse = await usersAPI.getAllUsers()
        setUserCount(usersResponse.users.length)

        // Fetch transactions
        const transactionsResponse = await transactionsAPI.getAllTransactions()
        setTransactionCount(transactionsResponse.transactions.length)

        // Get recent transactions (last 5)
        const sortedTransactions = [...transactionsResponse.transactions]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)

        setRecentTransactions(sortedTransactions)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-5 w-5 text-emerald-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "transfer":
        return <Activity className="h-5 w-5 text-blue-500" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{isLoading ? "..." : userCount}</div>
                <Users className="h-8 w-8 text-navy-500 opacity-80" />
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-start text-navy-600 hover:text-navy-800 p-0"
                onClick={() => router.push("/admin/users")}
              >
                View all users →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{isLoading ? "..." : transactionCount}</div>
                <DollarSign className="h-8 w-8 text-emerald-500 opacity-80" />
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full justify-start text-navy-600 hover:text-navy-800 p-0"
                onClick={() => router.push("/admin/transactions")}
              >
                View all transactions →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start bg-emerald-500 hover:bg-emerald-600"
                onClick={() => router.push("/admin/users/create")}
              >
                <Users className="mr-2 h-4 w-4" />
                Create New User
              </Button>
              <Button
                className="w-full justify-start bg-navy-500 hover:bg-navy-600"
                onClick={() => router.push("/admin/transactions/create")}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Create Transaction
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions">
              <TabsList className="mb-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                {isLoading ? (
                  <div className="text-center py-4">Loading recent transactions...</div>
                ) : recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction._id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{transaction.type}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`font-medium ${
                              transaction.type === "deposit"
                                ? "text-emerald-500"
                                : transaction.type === "withdrawal"
                                  ? "text-red-500"
                                  : "text-blue-500"
                            }`}
                          >
                            {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-4"
                            onClick={() => router.push(`/admin/transactions/${transaction._id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent transactions found.</div>
                )}

                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => router.push("/admin/transactions")}>
                    View All Transactions
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
