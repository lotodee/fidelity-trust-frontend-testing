"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Bitcoin, Loader2 } from "lucide-react"

export default function Withdraw() {
  const [bitcoinAddress, setBitcoinAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingWithdrawals, setPendingWithdrawals] = useState([
    {
      id: 1,
      address: "bc1q8c6fshw2dlwun7ekn4yrm3kz8hg6krc7pvpn2c",
      amount: "0.0025 BTC",
      date: "May 18, 2025",
      status: "Pending",
    },
  ])
  const { toast } = useToast()

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()

    if (!bitcoinAddress || !amount) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      })
      return
    }

    // Simple validation for Bitcoin address
    if (bitcoinAddress.length < 26 || bitcoinAddress.length > 35) {
      toast({
        variant: "destructive",
        title: "Invalid Bitcoin address",
        description: "Please enter a valid Bitcoin address.",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Add to pending withdrawals
      const newWithdrawal = {
        id: Date.now(),
        address: bitcoinAddress,
        amount: `${(Number.parseFloat(amount) / 40000).toFixed(6)} BTC`,
        date: new Date().toLocaleDateString(),
        status: "Pending",
      }

      setPendingWithdrawals([newWithdrawal, ...pendingWithdrawals])

      // Reset form
      setBitcoinAddress("")
      setAmount("")

      setIsLoading(false)

      toast({
        title: "Withdrawal request submitted",
        description: "Your withdrawal is pending approval.",
      })
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw to Bitcoin</CardTitle>
              <CardDescription>Enter your Bitcoin wallet address and the amount you want to withdraw.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bitcoinAddress">Bitcoin Wallet Address</Label>
                  <Input
                    id="bitcoinAddress"
                    placeholder="bc1q..."
                    value={bitcoinAddress}
                    onChange={(e) => setBitcoinAddress(e.target.value)}
                    required
                    className="font-mono text-sm"
                  />
                </div>

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
                      required
                    />
                  </div>
                  {amount && (
                    <p className="text-sm text-gray-500">≈ {(Number.parseFloat(amount) / 40000).toFixed(6)} BTC</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Bitcoin className="mr-2 h-4 w-4" />
                      Withdraw to Bitcoin
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-gray-500">
                Note: Withdrawals are subject to approval and may take 1-3 business days to process. A small network fee
                may apply.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawals</CardTitle>
              <CardDescription>Track the status of your withdrawal requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingWithdrawals.length > 0 ? (
                <div className="space-y-4">
                  {pendingWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{withdrawal.amount}</div>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {withdrawal.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-1">
                        Address: {withdrawal.address.substring(0, 10)}...
                      </div>
                      <div className="text-sm text-gray-500">Date: {withdrawal.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No pending withdrawals.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
