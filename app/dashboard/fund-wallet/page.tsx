"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Bitcoin, Loader2, Copy, CheckCircle } from "lucide-react"

export default function FundWallet() {
  const [amount, setAmount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [bitcoinAddress, setBitcoinAddress] = useState("")
  const [copied, setCopied] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState([
    {
      id: 1,
      address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      date: "May 19, 2025",
      amount: "0.0045 BTC",
      status: "Pending",
    },
  ])
  const { toast } = useToast()

  const handleGenerateAddress = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount to fund your wallet.",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API call to generate Bitcoin address
    setTimeout(() => {
      const randomAddress =
        "bc1q" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setBitcoinAddress(randomAddress)
      setIsGenerating(false)

      // Add to pending transactions
      const newTransaction = {
        id: Date.now(),
        address: randomAddress,
        date: new Date().toLocaleDateString(),
        amount: `${(Number.parseFloat(amount) / 40000).toFixed(6)} BTC`,
        status: "Pending",
      }

      setPendingTransactions([newTransaction, ...pendingTransactions])

      toast({
        title: "Bitcoin address generated",
        description: "Send the exact amount to complete your transaction.",
      })
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bitcoinAddress)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)

    toast({
      title: "Address copied",
      description: "Bitcoin address copied to clipboard.",
    })
  }

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
                    Enter the amount you want to fund and we'll generate a Bitcoin address for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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

                    {bitcoinAddress ? (
                      <div className="space-y-2 mt-4">
                        <Label>Bitcoin Address</Label>
                        <div className="flex">
                          <Input value={bitcoinAddress} readOnly className="rounded-r-none font-mono text-sm" />
                          <Button onClick={copyToClipboard} variant="outline" className="rounded-l-none border-l-0">
                            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Send exactly {(Number.parseFloat(amount) / 40000).toFixed(6)} BTC to this address.
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={handleGenerateAddress}
                        disabled={isGenerating || !amount}
                        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Address...
                          </>
                        ) : (
                          <>
                            <Bitcoin className="mr-2 h-4 w-4" />
                            Generate Bitcoin Address
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-gray-500">
                    Note: Bitcoin transactions typically take 10-60 minutes to confirm. Your funds will be available in
                    your wallet once the transaction is confirmed.
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Funding Status</CardTitle>
                  <CardDescription>Track the status of your funding transactions.</CardDescription>
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
                          <div className="text-sm text-gray-500 mb-1">Address: {tx.address.substring(0, 10)}...</div>
                          <div className="text-sm text-gray-500">Date: {tx.date}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No funding transactions yet.</div>
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
  )
}
