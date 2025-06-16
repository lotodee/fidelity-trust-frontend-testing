"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  MessageSquare,
  Bitcoin,
  Mail,
  User,
  Copy,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/lib/store/auth";
import { transactionsAPI } from "@/lib/api/transactions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  _id: string;
  action: "credit" | "debit";
  amount: number;
  type: string;
  subtype: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountNumber: string;
  };
  bitcoinAddress?: string;
  btcAmount?: number;
  paymentMethod?: string;
  description?: string;
}

export default function Dashboard() {
  const [userName, setUserName] = useState("John");
  const [availableBalance, setAvailableBalance] = useState("$4,923.82");
  const [currentBalance, setCurrentBalance] = useState("$5,123.82");
  const [showAvailableBalance, setShowAvailableBalance] = useState(true);
  const [showCurrentBalance, setShowCurrentBalance] = useState(true);
  const [showKycModal, setShowKycModal] = useState(false);
  const { user, updateUserBalances } = useAuthStore();
  const [kycStatus, setKycStatus] = useState<"pending" | "verified" | "failed">(
    "pending"
  );
  const isMobile = useIsMobile();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchRecentTransactions = async () => {
    try {
      const res = await transactionsAPI.getUserTransactions();
      const flattened = res.data.map((txn: any) => {
        const nestedData = txn.data || {};
        return {
          ...txn,
          ...nestedData,
          data: undefined,
        };
      });
      console.log("Recent Transactions Data:", flattened);
      setRecentTransactions(flattened.slice(0, 5)); // Get only 5 most recent transactions
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  useEffect(() => {
    fetchRecentTransactions();
    updateUserBalances();
  }, [updateUserBalances]);

  const getCategoryIcon = (transaction: Transaction) => {
    switch (transaction.subtype) {
      case "Bitcoin Transfer":
        return <Bitcoin className="h-5 w-5" />;
      case "member":
        return <User className="h-5 w-5" />;
      case "mailcheck":
        return <Mail className="h-5 w-5" />;
      case "wire-transfer":
      case "wire":
        return <Send className="h-5 w-5" />;
      default:
        return transaction.action === "credit" ? (
          <ArrowDownRight className="h-5 w-5" />
        ) : (
          <ArrowUpRight className="h-5 w-5" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(amount);
  };

  // useEffect(() => {
  //   // Check KYC status on component mount
  //   const timer = setTimeout(() => {
  //     if (kycStatus === "pending") {
  //       setShowKycModal(true);
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [kycStatus]);

  // const handleCompleteKyc = () => {
  //   setShowKycModal(false)
  //   // Redirect to KYC completion flow
  //   // router.push("/dashboard/kyc")
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* KYC Verification Modal */}

        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 bg-gradient-to-r from-emerald-800 to-emerald-900 p-6 text-white shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-emerald-100 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-emerald-100">
                  Available Balance
                </div>
                <button
                  onClick={() => setShowAvailableBalance(!showAvailableBalance)}
                  className="text-emerald-100 hover:text-white transition-colors"
                >
                  {showAvailableBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-3xl font-bold">
                {showAvailableBalance
                  ? formatBalance(user?.availableBalance || 0)
                  : "••••••"}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <div className="text-sm text-emerald-100">Current Balance</div>
                <button
                  onClick={() => setShowCurrentBalance(!showCurrentBalance)}
                  className="text-emerald-100 hover:text-white transition-colors"
                >
                  {showCurrentBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="text-xl font-semibold text-emerald-100">
                {showCurrentBalance
                  ? formatBalance(user?.currentBalance || 0)
                  : "••••••"}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
          >
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/fund-wallet">
                <Wallet className="h-5 w-5" />
                <span>Add Money</span>
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
            {/* <Button
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white flex items-center justify-center gap-2 h-auto py-3 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/dashboard/cards">
                <WalletCards className="h-5 w-5" />
                <span>Cards</span>
              </Link>
            </Button> */}
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Monthly Income
              </CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-500">
                Monthly Expenses
              </CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-500">
                Savings Goal
              </CardTitle>
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
        </motion.section> */}

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
                <CardDescription>
                  Your recent financial activity
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/transactions">See All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg px-4 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowReceipt(true);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          transaction.action === "debit"
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {transaction.action === "debit" ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {transaction.description || transaction.subtype}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(transaction.createdAt),
                              "MMM d, yyyy h:mm a"
                            )}
                          </span>
                        </div>
                        {transaction.bitcoinAddress && (
                          <div className="text-xs text-gray-500 mt-1">
                            BTC: {transaction.btcAmount}
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`font-medium text-lg ${
                        transaction.action === "debit"
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {transaction.action === "debit" ? "-" : "+"}$
                      {transaction.amount.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Transaction Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Transaction Receipt
              </DialogTitle>
              <DialogDescription>Transaction details</DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-6 border rounded-xl space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {selectedTransaction._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">
                      {selectedTransaction.action === "debit" ? "-" : "+"}$
                      {selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span>{selectedTransaction.subtype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(selectedTransaction.status)}
                    >
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>
                      {format(
                        new Date(selectedTransaction.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </span>
                  </div>
                  {selectedTransaction.bitcoinAddress && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bitcoin Amount:</span>
                        <span className="font-medium">
                          {selectedTransaction.btcAmount} BTC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bitcoin Address:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {selectedTransaction.bitcoinAddress}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">User:</span>
                    <span className="font-medium">
                      {selectedTransaction.userId.firstName}{" "}
                      {selectedTransaction.userId.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account:</span>
                    <span className="font-medium">
                      {selectedTransaction.userId.accountNumber}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowReceipt(false)}>Close</Button>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>

        {isMobile && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <MessageSquare className="h-12 w-12 text-emerald-200 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Live Support</h3>
                  <p className="text-emerald-100 mb-6">
                    Get instant help from our support team
                  </p>
                  <a href="/dashboard/chat" className="w-full">
                    <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-10">
                      Start Chat
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </div>
    </DashboardLayout>
  );
}
