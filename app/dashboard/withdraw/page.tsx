"use client";

import type React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Bitcoin,
  Loader2,
  Copy,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Informer } from "@/components/ui/informer";
import { transactionsAPI } from "@/lib/api/transactions";

interface PendingWithdrawal {
  id: number;
  address: string;
  amount: string;
  date: string;
  status: string;
}

export default function Withdraw() {
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentWithdrawal, setCurrentWithdrawal] =
    useState<PendingWithdrawal | null>(null);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    PendingWithdrawal[]
  >([
    {
      id: 1,
      address: "bc1q8c6fshw2dlwun7ekn4yrm3kz8hg6krc7pvpn2c",
      amount: "0.0025 BTC",
      date: "May 18, 2025",
      status: "Pending",
    },
  ]);
  const { toast } = useToast();
  const [informer, setInformer] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
  } | null>(null);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bitcoinAddress || !amount) {
      setInformer({
        title: "Missing information",
        message: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    // Simple validation for Bitcoin address
    if (bitcoinAddress.length < 26 || bitcoinAddress.length > 35) {
      setInformer({
        title: "Invalid Bitcoin address",
        message: "Please enter a valid Bitcoin address.",
        type: "error",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmWithdrawal = async () => {
    setIsLoading(true);

    try {
      const transactionData = {
        amount: Number.parseFloat(amount),
        subtype: "withdraw",
        data: {
          bitcoinAddress,
          btcAmount: (Number.parseFloat(amount) / 40000).toFixed(6),
        },
      };

      const response = await transactionsAPI.withdraw(
        transactionData.amount,
        transactionData.subtype,
        transactionData.data
      );

      // Add to pending withdrawals
      const newWithdrawal = {
        id: response.data._id,
        address: bitcoinAddress,
        amount: `${(Number.parseFloat(amount) / 40000).toFixed(6)} BTC`,
        date: new Date().toLocaleDateString(),
        status: response.data.status,
      };

      setCurrentWithdrawal(newWithdrawal);
      setPendingWithdrawals([newWithdrawal, ...pendingWithdrawals]);
      setShowSuccess(true);

      // Reset form
      setBitcoinAddress("");
      setAmount("");
      setShowConfirmation(false);

      setTimeout(() => {
        setShowSuccess(false);
        setShowReceipt(true);
      }, 2000);

      setInformer({
        title: "Withdrawal request submitted",
        message: "Your withdrawal is pending approval.",
        type: "success",
      });
    } catch (error) {
      setInformer({
        title: "Error",
        message: "Failed to process withdrawal. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
          <p className="text-gray-500">
            Withdraw your funds to your Bitcoin wallet
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Withdraw to Bitcoin</CardTitle>
                <CardDescription>
                  Enter your Bitcoin wallet address and the amount you want to
                  withdraw.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bitcoinAddress" className="text-base">
                      Bitcoin Wallet Address
                    </Label>
                    <Input
                      id="bitcoinAddress"
                      placeholder="bc1q..."
                      value={bitcoinAddress}
                      onChange={(e) => setBitcoinAddress(e.target.value)}
                      required
                      className="font-mono text-sm h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base">
                      Amount (USD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8 h-12 text-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    {amount && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md mt-2"
                      >
                        <Bitcoin className="w-4 h-4 text-yellow-500" />
                        <span>
                          ≈ {(Number.parseFloat(amount) / 40000).toFixed(6)} BTC
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {!showConfirmation && (
                    <Button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-lg"
                    >
                      Continue to Withdrawal
                    </Button>
                  )}

                  {showConfirmation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="p-6 border rounded-xl bg-gray-50">
                        <h3 className="font-medium text-lg mb-4">
                          Withdrawal Summary
                        </h3>
                        <div className="space-y-3 text-base">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Amount:</span>
                            <span className="font-medium">
                              ${amount} (
                              {(Number.parseFloat(amount) / 40000).toFixed(6)}{" "}
                              BTC)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">To Address:</span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {bitcoinAddress.substring(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          className="flex-1 h-12"
                          onClick={() => setShowConfirmation(false)}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 h-12"
                          onClick={handleConfirmWithdrawal}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                          ) : null}
                          {isLoading ? "Processing..." : "Confirm Withdrawal"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-gray-500">
                  Note: Withdrawals are subject to approval and may take 1-3
                  business days to process. A small network fee may apply.
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Pending Withdrawals</CardTitle>
                <CardDescription>
                  Track the status of your withdrawal requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {pendingWithdrawals.length > 0 ? (
                    <div className="space-y-4">
                      {pendingWithdrawals.map((withdrawal) => (
                        <motion.div
                          key={withdrawal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-lg">
                              {withdrawal.amount}
                            </div>
                            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              {withdrawal.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            Address: {withdrawal.address.substring(0, 10)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            Date: {withdrawal.date}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Bitcoin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending withdrawals.</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                Withdrawal Initiated!
              </h3>
              <p className="text-gray-500 text-center">
                Your withdrawal request has been submitted successfully.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Withdrawal Receipt</DialogTitle>
              <DialogDescription>Your withdrawal details</DialogDescription>
            </DialogHeader>

            {currentWithdrawal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-6 border rounded-xl space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {currentWithdrawal.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">
                      {currentWithdrawal.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To Address:</span>
                    <span className="font-mono text-sm">
                      {currentWithdrawal.address.substring(0, 10)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {currentWithdrawal.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{currentWithdrawal.date}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowReceipt(false)}>Close</Button>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
