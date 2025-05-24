"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Wallet, Send, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

export default function Dashboard() {
  const [userName, setUserName] = useState("")
  const [balance, setBalance] = useState("$4,923.82")
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Starbucks",
      date: "Today, 10:30 AM",
      amount: "-$5.75",
      type: "expense",
    },
    {
      id: 2,
      name: "PayPal Transfer",
      date: "Yesterday, 2:15 PM",
      amount: "+$50.00",
      type: "income",
    },
    {
      id: 3,
      name: "Amazon",
      date: "May 18, 2025",
      amount: "-$45.23",
      type: "expense",
    },
    {
      id: 4,
      name: "Walmart",
      date: "May 17, 2025",
      amount: "-$12.40",
      type: "expense",
    },
  ])

  useEffect(() => {
    const name = sessionStorage.getItem("user-name")
    if (name) {
      setUserName(name)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
              <p className="text-gray-300 mt-1">Here's what's happening with your account today.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-300">Available Balance</div>
              <div className="text-3xl font-bold">{balance}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3"
              asChild
            >
              <Link href="/dashboard/fund-wallet">
                <Wallet className="h-5 w-5" />
                <span>Fund Wallet</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3"
              asChild
            >
              <Link href="/dashboard/withdraw">
                <ArrowUpRight className="h-5 w-5" />
                <span>Withdraw</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3"
              asChild
            >
              <Link href="/dashboard/send-money">
                <Send className="h-5 w-5" />
                <span>Send Money</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3"
              asChild
            >
              <Link href="/dashboard/coins">
                <CreditCard className="h-5 w-5" />
                <span>Cards</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">$2,450.00</div>
                <div className="ml-2 flex items-center text-emerald-500 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">$1,280.00</div>
                <div className="ml-2 flex items-center text-red-500 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Savings Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">$5,000.00</div>
                <div className="ml-2 text-sm text-gray-500">
                  <span>of $10,000</span>
                </div>
              </div>
              <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Transactions */}
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent financial activity</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/transactions">See All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === "expense" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {transaction.type === "expense" ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                      </div>
                    </div>
                    <div
                      className={`font-medium ${transaction.type === "expense" ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  )
}
