"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownRight, Wallet, Send, Search } from "lucide-react"

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("")

  const allTransactions = [
    {
      id: 1,
      name: "Starbucks",
      date: "Today, 10:30 AM",
      amount: "-$5.75",
      type: "expense",
      category: "send",
    },
    {
      id: 2,
      name: "PayPal Transfer",
      date: "Yesterday, 2:15 PM",
      amount: "+$50.00",
      type: "income",
      category: "fund",
    },
    {
      id: 3,
      name: "Amazon",
      date: "May 18, 2025",
      amount: "-$45.23",
      type: "expense",
      category: "send",
    },
    {
      id: 4,
      name: "Bitcoin Deposit",
      date: "May 17, 2025",
      amount: "+$500.00",
      type: "income",
      category: "fund",
    },
    {
      id: 5,
      name: "Bitcoin Withdrawal",
      date: "May 15, 2025",
      amount: "-$200.00",
      type: "expense",
      category: "withdraw",
    },
    {
      id: 6,
      name: "Salary Deposit",
      date: "May 10, 2025",
      amount: "+$2,500.00",
      type: "income",
      category: "fund",
    },
    {
      id: 7,
      name: "Rent Payment",
      date: "May 5, 2025",
      amount: "-$1,200.00",
      type: "expense",
      category: "send",
    },
    {
      id: 8,
      name: "Bitcoin Withdrawal",
      date: "May 1, 2025",
      amount: "-$150.00",
      type: "expense",
      category: "withdraw",
    },
  ]

  const filteredTransactions = (category: string) => {
    return allTransactions
      .filter((tx) => (category === "all" ? true : tx.category === category))
      .filter((tx) => tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || tx.amount.includes(searchTerm))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fund":
        return <ArrowDownRight className="h-5 w-5" />
      case "withdraw":
        return <Wallet className="h-5 w-5" />
      case "send":
        return <Send className="h-5 w-5" />
      default:
        return category === "expense" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* <h1 className="text-2xl font-bold">Transactions</h1> */}
          <div className="relative ml-auto w-full max-w-xs my-2">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-500" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View and filter your transaction history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="fund">Fund</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>

              {["all", "fund", "send", "withdraw"].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {filteredTransactions(category).length > 0 ? (
                      filteredTransactions(category).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between py-4 border-b last:border-0"
                        >
                          <div className="flex items-center">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                transaction.type === "expense"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {getCategoryIcon(transaction.category)}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">
                                {transaction.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {transaction.date}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`font-medium ${
                              transaction.type === "expense"
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {transaction.amount}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        No transactions found.
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
