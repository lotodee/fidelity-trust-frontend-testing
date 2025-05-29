"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Bitcoin, Loader2, Copy, CheckCircle, QrCode } from "lucide-react";
import Image from "next/image";

export default function FundWallet() {
  const [amount, setAmount] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "address" | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState([
    {
      id: 1,
      address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      date: "May 19, 2025",
      amount: "0.0045 BTC",
      status: "Pending",
    },
  ]);
  const { toast } = useToast();

  const handleGenerateAddress = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to fund your wallet.",
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

  const handleConfirmPayment = () => {
    if (!amount || !paymentMethod) return;

    const newTransaction = {
      id: Date.now(),
      address: paymentMethod === "qr" ? "QR Code Payment" : bitcoinAddress,
      date: new Date().toLocaleDateString(),
      amount: `${(Number.parseFloat(amount) / 40000).toFixed(6)} BTC`,
      status: "Pending",
    };

    setPendingTransactions([newTransaction, ...pendingTransactions]);
    setShowConfirmation(false);
    setPaymentMethod(null);
    setBitcoinAddress("");
    setAmount("");

    toast({
      title: "Payment initiated",
      description: "Your payment has been added to pending transactions.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

    toast({
      title: "Address copied",
      description: "Bitcoin address copied to clipboard.",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Fund Your Wallet</h1>

        <Tabs defaultValue="bitcoin" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
            <TabsTrigger value="wire" disabled>
              Wire Transfer
            </TabsTrigger>
            <TabsTrigger value="deposit" disabled>
              Direct Deposit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bitcoin">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fund with Bitcoin</CardTitle>
                  <CardDescription>
                    Enter the amount and choose your preferred payment method.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-8"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    {amount &&
                      Number.parseFloat(amount) > 0 &&
                      !showConfirmation && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant={
                                paymentMethod === "qr" ? "default" : "outline"
                              }
                              className="h-24 flex flex-col items-center justify-center gap-2"
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
                              className="h-24 flex flex-col items-center justify-center gap-2"
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
                              className="w-full bg-emerald-500 hover:bg-emerald-600"
                              onClick={() => setShowConfirmation(true)}
                            >
                              Continue to Payment
                            </Button>
                          )}
                        </div>
                      )}

                    {showConfirmation && paymentMethod && (
                      <div className="space-y-6">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Payment Summary</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount:</span>
                              <span>
                                ${amount} (
                                {(Number.parseFloat(amount) / 40000).toFixed(6)}{" "}
                                BTC)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Method:</span>
                              <span>
                                {paymentMethod === "qr"
                                  ? "QR Code"
                                  : "Bitcoin Address"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {paymentMethod === "qr" ? (
                          <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg">
                            <div className="relative w-48 h-48">
                              <Image
                                src="/qr.jpeg"
                                alt="Bitcoin QR Code"
                                fill
                                className="object-contain"
                              />
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                              Scan this QR code with your Bitcoin wallet to send
                              funds
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Bitcoin Address</Label>
                            <div className="flex">
                              <Input
                                value={bitcoinAddress}
                                readOnly
                                className="rounded-r-none font-mono text-sm"
                              />
                              <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="rounded-l-none border-l-0"
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
                            className="flex-1"
                            onClick={() => setShowConfirmation(false)}
                          >
                            Back
                          </Button>
                          <Button
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                            onClick={handleConfirmPayment}
                          >
                            Confirm Payment
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-gray-500">
                    Note: Bitcoin transactions typically take 10-60 minutes to
                    confirm. Your funds will be available in your wallet once
                    the transaction is confirmed.
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funding Status</CardTitle>
                  <CardDescription>
                    Track the status of your funding transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {pendingTransactions.map((tx) => (
                        <div key={tx.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{tx.amount}</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              {tx.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            Address: {tx.address.substring(0, 10)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            Date: {tx.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No funding transactions yet.
                    </div>
                  )}
                </CardContent>
              </Card>
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
      </div>
    </DashboardLayout>
  );
}
