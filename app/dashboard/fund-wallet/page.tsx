"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Bitcoin, Loader2, Copy, CheckCircle, QrCode } from "lucide-react";
import Image from "next/image";
import {
  transactionsAPI,
  TransactionType,
  TransactionStatus,
} from "@/lib/api/transactions";
import { Informer } from "@/components/ui/informer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cryptoAPI } from "@/lib/api/get-usdt";
import { number } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";

interface PendingTransaction {
  id: string;
  address: string;
  date: string;
  amount: string;
  status: string;
}

export default function FundWallet() {
  const [amount, setAmount] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [btcAmount, setBtcAmount] = useState<number | null>(null); // start as null

  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "address" | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([]);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [informer, setInformer] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
  } | null>(null);

  useEffect(() => {
    const fetchBTC = async () => {
      if (!amount || isNaN(Number(amount))) {
        return;
      }

      const amountInBtc = await cryptoAPI.convertUSDToBTC(amount);
      setBtcAmount(amountInBtc);
      console.log("the btc amount", amountInBtc);
    };

    const timeout = setTimeout(fetchBTC, 500);

    return () => clearTimeout(timeout);
  }, [amount]);

  const formattedBTC = useMemo(() => {
    return btcAmount ? `≈ ${btcAmount} BTC` : "";
  }, [btcAmount]);

  const handleGenerateAddress = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setInformer({
        title: "Invalid amount",
        message: "Please enter a valid amount to fund your wallet.",
        type: "error",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call to generate Bitcoin address
    setTimeout(() => {
      setBitcoinAddress("bc1q0ppjjf6ryerj55xvarya35p3y7p92ffjxz0m08");
      setIsGenerating(false);
    }, 2000);
  };

  const handleConfirmPayment = async () => {
    if (!amount || !paymentMethod) {
      setInformer({
        title: "Missing information",
        message: "Please enter an amount and select a payment method.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionData = {
        amount: Number.parseFloat(amount),
        subtype: "Bitcoin Transfer",
        data: {
          bitcoinAddress: bitcoinAddress,
          paymentMethod: paymentMethod,
          btcAmount: btcAmount,
        },
      };

      const response = await transactionsAPI.fundWallet(
        transactionData.amount,
        transactionData.subtype,
        transactionData.data
      );

      setCurrentTransaction(response.data);
      setPendingTransactions((prev) => [response.data, ...prev]);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setShowReceipt(true);
        setShowConfirmation(false);
        setPaymentMethod(null);
        setBitcoinAddress("");
        setAmount("");
      }, 2000);

      setInformer({
        title: "Payment initiated",
        message: "Your payment has been added to pending transactions.",
        type: "success",
      });
    } catch (error) {
      setInformer({
        title: "Error",
        message: "Failed to process payment. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

    setInformer({
      title: "Address copied",
      message: "Bitcoin address copied to clipboard.",
      type: "success",
    });
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
          <h1 className="text-3xl font-bold mb-2">Fund Your Wallet</h1>
          <p className="text-gray-500">Choose your preferred funding method</p>
        </motion.div>

        <Tabs defaultValue="bitcoin" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger
              value="bitcoin"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Bitcoin className="w-4 h-4 mr-2" />
              Bitcoin
            </TabsTrigger>
            <TabsTrigger value="wire" disabled className="rounded-lg">
              Wire Transfer
            </TabsTrigger>
            <TabsTrigger value="deposit" disabled className="rounded-lg">
              Direct Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bitcoin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-none shadow-lg">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">
                      Fund with Bitcoin
                    </CardTitle>
                    <CardDescription>
                      Enter the amount and choose your preferred payment method.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
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
                          />
                        </div>
                        {formattedBTC && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md mt-2"
                          >
                            <Bitcoin className="w-4 h-4 text-yellow-500" />
                            <span>{formattedBTC}</span>
                          </motion.div>
                        )}
                      </div>

                      {amount &&
                        Number.parseFloat(amount) > 0 &&
                        !showConfirmation && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant={
                                  paymentMethod === "qr" ? "default" : "outline"
                                }
                                className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                onClick={() => setPaymentMethod("qr")}
                              >
                                <QrCode className="h-8 w-8" />
                                <span>Scan QR Code</span>
                              </Button>
                              <Button
                                variant={
                                  paymentMethod === "address"
                                    ? "default"
                                    : "outline"
                                }
                                className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                onClick={() => {
                                  setPaymentMethod("address");
                                  handleGenerateAddress();
                                }}
                              >
                                <Bitcoin className="h-8 w-8" />
                                <span>Get Address</span>
                              </Button>
                            </div>

                            {paymentMethod && (
                              <Button
                                className="w-full bg-emerald-500 hover:bg-emerald-600 h-12 text-lg"
                                onClick={() => setShowConfirmation(true)}
                              >
                                Continue to Payment
                              </Button>
                            )}
                          </motion.div>
                        )}

                      {showConfirmation && paymentMethod && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="p-6 border rounded-xl bg-gray-50">
                            <h3 className="font-medium text-lg mb-4">
                              Payment Summary
                            </h3>
                            <div className="space-y-3 text-base">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-medium">
                                  ${amount} ({btcAmount} BTC)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Method:</span>
                                <span className="font-medium">
                                  {paymentMethod === "qr"
                                    ? "QR Code"
                                    : "Bitcoin Address"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {paymentMethod === "qr" ? (
                            <div className="flex flex-col items-center space-y-4 p-6 border rounded-xl bg-white">
                              <div className="relative w-48 h-48">
                                <Image
                                  src="/qr.jpeg"
                                  alt="Bitcoin QR Code"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <p className="text-sm text-gray-500 text-center">
                                Scan this QR code with your Bitcoin wallet to
                                send funds
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-base">
                                Bitcoin Address
                              </Label>
                              <div className="flex">
                                <Input
                                  value={bitcoinAddress}
                                  readOnly
                                  className="rounded-r-none font-mono text-sm h-12"
                                />
                                <Button
                                  onClick={copyToClipboard}
                                  variant="outline"
                                  className="rounded-l-none border-l-0 h-12"
                                >
                                  {copied ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}

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
                              onClick={handleConfirmPayment}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <LoadingSpinner size="sm" className="mr-2" />
                              ) : null}
                              {isSubmitting
                                ? "Processing..."
                                : "Confirm Payment"}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Funding Status</CardTitle>
                    <CardDescription>
                      Track the status of your funding transactions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {pendingTransactions.length > 0 ? (
                        <div className="space-y-4">
                          {pendingTransactions.map((tx) => (
                            <motion.div
                              key={tx.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-lg">
                                  ${tx.amount}
                                </div>
                                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  {tx.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mb-1">
                                Address: {tx?.address?.substring(0, 10)}...
                              </div>
                              <div className="text-sm text-gray-500">
                                Date: {new Date(tx?.date).toLocaleString()}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Bitcoin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No funding transactions yet.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="wire">
            <Card>
              <CardHeader>
                <CardTitle>Wire Transfer</CardTitle>
                <CardDescription>This feature is coming soon.</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Direct Deposit</CardTitle>
                <CardDescription>This feature is coming soon.</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>

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
                Payment Successful!
              </h3>
              <p className="text-gray-500 text-center">
                Your payment has been initiated successfully.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Transaction Receipt
              </DialogTitle>
              <DialogDescription>Your transaction details</DialogDescription>
            </DialogHeader>

            {currentTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-6 border rounded-xl space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {currentTransaction._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">
                      ${currentTransaction.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span>{currentTransaction.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        currentTransaction.status === TransactionStatus.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : currentTransaction.status ===
                            TransactionStatus.SUCCESS
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentTransaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>
                      {new Date(currentTransaction.createdAt).toLocaleString()}
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
      </div>
    </DashboardLayout>
  );
}
