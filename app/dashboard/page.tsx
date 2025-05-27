"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Send,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  AlertCircle,
  WalletCards,
} from "lucide-react"

export default function Dashboard() {
  const [userName, setUserName] = useState("John")
  const [availableBalance, setAvailableBalance] = useState("$4,923.82")
  const [currentBalance, setCurrentBalance] = useState("$5,123.82")
  const [showAvailableBalance, setShowAvailableBalance] = useState(true)
  const [showCurrentBalance, setShowCurrentBalance] = useState(true)
  const [showKycModal, setShowKycModal] = useState(false)
  const [kycVerified, setKycVerified] = useState(false)

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
    // Check KYC status on component mount
    const timer = setTimeout(() => {
      if (!kycVerified) {
        setShowKycModal(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [kycVerified])

  const handleCompleteKyc = () => {
    setShowKycModal(false)
    // Redirect to KYC completion flow
    // router.push("/dashboard/kyc")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* KYC Verification Modal */}
        <Dialog open={showKycModal} onOpenChange={setShowKycModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Complete Your Verification
              </DialogTitle>
              <DialogDescription>
                To ensure the security of your account and comply with regulations, please complete your KYC (Know Your
                Customer) verification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Required:</strong> Upload a government-issued ID and proof of address to verify your identity
                  and unlock all features.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowKycModal(false)} className="flex-1">
                  Later
                </Button>
                <Button onClick={handleCompleteKyc} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                  Complete Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-navy-800 to-navy-900  p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
              <p className="text-gray-300 mt-1">Here's what's happening with your account today.</p>
            </div>
            <div className="mt-4 md:mt-0 space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-300">Available Balance</div>
                <button
                  onClick={() => setShowAvailableBalance(!showAvailableBalance)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {showAvailableBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-3xl font-bold">{showAvailableBalance ? availableBalance : "••••••"}</div>

              <div className="flex items-center gap-2 mt-2">
                <div className="text-sm text-gray-300">Current Balance</div>
                <button
                  onClick={() => setShowCurrentBalance(!showCurrentBalance)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {showCurrentBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-xl font-semibold text-gray-300">
                {showCurrentBalance ? currentBalance : "••••••"}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/fund-wallet">
                <Wallet className="h-5 w-5" />
                <span>Fund Wallet</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/withdraw">
                <ArrowUpRight className="h-5 w-5" />
                <span>Withdraw</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/send-money">
                <Send className="h-5 w-5" />
                <span>Send Money</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/coins">
                <WalletCards className="h-5 w-5" />
                <span>Cards</span>
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
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

          <Card className="hover:shadow-lg transition-shadow duration-200">
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

          <Card className="hover:shadow-lg transition-shadow duration-200">
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
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
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
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </DashboardLayout>
  )
}
