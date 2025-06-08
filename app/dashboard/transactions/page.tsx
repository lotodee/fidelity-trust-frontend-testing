"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Send,
  Search,
  Bitcoin,
  Mail,
  User,
  Download,
  Copy,
  Printer,
  DollarSign,
} from "lucide-react";
import { transactionsAPI } from "@/lib/api/transactions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Informer } from "@/components/ui/informer";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
}

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );
  const [informer, setInformer] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
  } | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await transactionsAPI.getUserTransactions();
      const flattened = res.data.map((txn: any) => {
        const nestedData = txn.data || {};
        return {
          ...txn,
          ...nestedData,
          data: undefined,
        };
      });
      console.log(flattened);
      setTransactions(flattened);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = () => {
    return transactions
      .filter((tx) => {
        if (activeTab === "incoming") {
          return tx.action === "credit" || tx.type === "credit";
        } else {
          return tx.action === "debit" || tx.type === "debit";
        }
      })
      .filter((tx) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          tx.subtype.toLowerCase().includes(searchLower) ||
          tx.amount.toString().includes(searchTerm) ||
          tx.userId.firstName.toLowerCase().includes(searchLower) ||
          tx.userId.lastName.toLowerCase().includes(searchLower) ||
          tx.userId.accountNumber.includes(searchTerm)
        );
      });
  };

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

  const handleDownloadReceipt = () => {
    if (!selectedTransaction) return;

    const doc = new jsPDF();

    // Add logo or header
    doc.setFontSize(20);
    doc.text("FidelityTrust", 105, 20, { align: "center" });

    // Add receipt title
    doc.setFontSize(16);
    doc.text("Transaction Receipt", 105, 30, { align: "center" });

    // Add transaction details
    doc.setFontSize(10);
    const details = [
      ["Transaction ID:", selectedTransaction._id],
      [
        "Date:",
        format(
          new Date(selectedTransaction.createdAt),
          "MMMM d, yyyy 'at' h:mm a"
        ),
      ],
      ["Status:", selectedTransaction.status],
      ["Type:", selectedTransaction.subtype],
      ["Amount:", `$${selectedTransaction.amount.toLocaleString()}`],
      ["Account Number:", selectedTransaction.userId.accountNumber],
      [
        "Account Holder:",
        `${selectedTransaction.userId.firstName} ${selectedTransaction.userId.lastName}`,
      ],
    ];

    if (selectedTransaction.btcAmount) {
      details.push(["Bitcoin Amount:", `${selectedTransaction.btcAmount} BTC`]);
    }
    if (selectedTransaction.bitcoinAddress) {
      details.push(["Bitcoin Address:", selectedTransaction.bitcoinAddress]);
    }

    // Add footer
    doc.setFontSize(8);
    doc.text(
      "This receipt serves as proof of your transaction. Keep it for your records.",
      105,
      280,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`transaction-receipt-${selectedTransaction._id}.pdf`);

    setInformer({
      title: "Receipt Downloaded",
      message: "Your transaction receipt has been downloaded successfully.",
      type: "success",
    });
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <DashboardLayout>
      {informer && (
        <Informer
          message={informer.message}
          type={informer.type}
          title={informer.title}
          onClose={() => setInformer(null)}
        />
      )}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            <div className="mb-6">
              <div className="flex space-x-2 border-b">
                <button
                  onClick={() => setActiveTab("incoming")}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "incoming"
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Incoming
                  {activeTab === "incoming" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("outgoing")}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "outgoing"
                      ? "text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Outgoing
                  {activeTab === "outgoing" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? (
                  <div className="text-center py-10 text-gray-500">
                    Loading transactions...
                  </div>
                ) : filteredTransactions().length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions().map((transaction) => (
                      <motion.div
                        key={transaction._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between py-4 border-b last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-4 cursor-pointer"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowReceipt(true);
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              transaction.action === "debit"
                                ? "bg-red-100 text-red-600"
                                : "bg-emerald-100 text-emerald-600"
                            }`}
                          >
                            {getCategoryIcon(transaction)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {transaction.subtype}
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(
                                new Date(transaction.createdAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </div>
                            {transaction.bitcoinAddress && (
                              <div className="text-xs text-gray-500 mt-1">
                                BTC: {transaction.btcAmount}
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
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
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 text-gray-500"
                  >
                    <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium">
                      No transactions found
                    </h3>
                    <p className="mt-1">
                      {searchTerm
                        ? "Try adjusting your search"
                        : `No ${activeTab} transactions available`}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Transaction Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl">
                  Transaction Receipt
                </DialogTitle>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs px-3 py-1",
                    getStatusColor(selectedTransaction?.status || "")
                  )}
                >
                  {selectedTransaction?.status}
                </Badge>
              </div>
              <DialogDescription className="text-base">
                {selectedTransaction?.createdAt
                  ? format(
                      new Date(selectedTransaction.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )
                  : "Date not available"}
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Receipt Header */}
                <div className="text-center py-6 border-b">
                  <div className="text-sm text-gray-500 mb-2">
                    Transaction Amount
                  </div>
                  <div
                    className={cn(
                      "text-3xl font-bold",
                      selectedTransaction.action === "debit"
                        ? "text-red-600"
                        : "text-emerald-600"
                    )}
                  >
                    {selectedTransaction.action === "debit" ? "-" : "+"}$
                    {selectedTransaction.amount.toLocaleString()}
                  </div>
                  {selectedTransaction.btcAmount && (
                    <div className="text-sm text-gray-500 mt-2">
                      ≈ {selectedTransaction.btcAmount} BTC
                    </div>
                  )}
                </div>

                {/* Transaction Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Transaction Type
                      </div>
                      <div className="font-medium">
                        {truncateText(selectedTransaction.subtype)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Transaction ID
                      </div>
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {truncateText(selectedTransaction._id, 20)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Account Number
                      </div>
                      <div className="font-medium">
                        {truncateText(selectedTransaction.userId.accountNumber)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Account Holder
                      </div>
                      <div className="font-medium">
                        {truncateText(
                          `${selectedTransaction.userId.firstName} ${selectedTransaction.userId.lastName}`
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedTransaction.bitcoinAddress && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Bitcoin Address
                      </div>
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded break-all">
                        {truncateText(selectedTransaction.bitcoinAddress, 25)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTransaction._id);
                      setInformer({
                        title: "Copied",
                        message: "Transaction ID copied to clipboard",
                        type: "success",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy ID
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadReceipt}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  <p>This receipt serves as proof of your transaction.</p>
                  <p className="mt-1">Keep it for your records.</p>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
