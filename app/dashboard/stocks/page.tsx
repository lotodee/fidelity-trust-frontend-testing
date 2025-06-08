"use client";

import type React from "react";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  Search,
  DollarSign,
  BarChart3,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Informer } from "@/components/ui/informer";

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface UserStock {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function StocksPage() {
  const { toast } = useToast();
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      volume: 45678900,
      marketCap: 2800000000000,
    },
    {
      id: "2",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 138.21,
      change: -1.87,
      changePercent: -1.33,
      volume: 23456789,
      marketCap: 1750000000000,
    },
    {
      id: "3",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 378.85,
      change: 4.32,
      changePercent: 1.15,
      volume: 34567890,
      marketCap: 2900000000000,
    },
    {
      id: "4",
      symbol: "TSLA",
      name: "Tesla, Inc.",
      price: 248.5,
      change: -8.75,
      changePercent: -3.4,
      volume: 67890123,
      marketCap: 790000000000,
    },
    {
      id: "5",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 151.94,
      change: 1.23,
      changePercent: 0.82,
      volume: 45123678,
      marketCap: 1580000000000,
    },
  ]);

  const [portfolio, setPortfolio] = useState<UserStock[]>([
    {
      symbol: "AAPL",
      quantity: 10,
      averagePrice: 170.0,
      currentValue: 1754.3,
      profitLoss: 54.3,
      profitLossPercent: 3.19,
    },
    {
      symbol: "MSFT",
      quantity: 5,
      averagePrice: 365.0,
      currentValue: 1894.25,
      profitLoss: 69.25,
      profitLossPercent: 3.79,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [buyQuantity, setBuyQuantity] = useState("");
  const [pin, setPin] = useState("");
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInformer, setShowInformer] = useState(false);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPortfolioValue = portfolio.reduce(
    (sum, stock) => sum + stock.currentValue,
    0
  );
  const totalProfitLoss = portfolio.reduce(
    (sum, stock) => sum + stock.profitLoss,
    0
  );
  const totalProfitLossPercent =
    totalPortfolioValue > 0
      ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100
      : 0;

  const handleBuyStock = (stock: Stock) => {
    setSelectedStock(stock);
    setShowBuyDialog(true);
    setShowInformer(true);
    setTimeout(() => {
      setShowInformer(false);
    }, 3000);
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStock || !buyQuantity || !pin) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (pin.length !== 4) {
      toast({
        variant: "destructive",
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const quantity = Number.parseInt(buyQuantity);
      const totalCost = selectedStock.price * quantity;

      // Update portfolio
      const existingStock = portfolio.find(
        (p) => p.symbol === selectedStock.symbol
      );
      if (existingStock) {
        const newQuantity = existingStock.quantity + quantity;
        const newTotalInvested =
          existingStock.averagePrice * existingStock.quantity + totalCost;
        const newAveragePrice = newTotalInvested / newQuantity;

        existingStock.quantity = newQuantity;
        existingStock.averagePrice = newAveragePrice;
        existingStock.currentValue = newQuantity * selectedStock.price;
        existingStock.profitLoss =
          existingStock.currentValue - newTotalInvested;
        existingStock.profitLossPercent =
          (existingStock.profitLoss / newTotalInvested) * 100;
      } else {
        portfolio.push({
          symbol: selectedStock.symbol,
          quantity,
          averagePrice: selectedStock.price,
          currentValue: totalCost,
          profitLoss: 0,
          profitLossPercent: 0,
        });
      }

      setPortfolio([...portfolio]);
      setIsLoading(false);
      setShowBuyDialog(false);
      setBuyQuantity("");
      setPin("");
      setSelectedStock(null);

      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${quantity} shares of ${selectedStock.symbol}`,
      });
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {showInformer && (
          <Informer
            type="info"
            title="Coming Soon"
            message="Stock trading functionality will be available soon. Stay tuned for updates!"
            onClose={() => setShowInformer(false)}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Stocks</h1>
              <p className="text-gray-500 mt-1">
                Track and manage your investments
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/70">Portfolio Value</div>
                  <BarChart3 className="h-5 w-5 text-white/70" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(totalPortfolioValue)}
                </div>
                <div className="text-sm text-white/70">Total Investment</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/70">Total P&L</div>
                  {totalProfitLoss >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-white/70" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-white/70" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(totalProfitLoss)}
                </div>
                <div className="text-sm text-white/70">
                  {totalProfitLoss >= 0 ? "+" : ""}
                  {Math.abs(totalProfitLossPercent).toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-800 to-blue-950 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/70">Holdings</div>
                  <DollarSign className="h-5 w-5 text-white/70" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {portfolio.length}
                </div>
                <div className="text-sm text-white/70">Active Positions</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-800 to-purple-950 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/70">Available Stocks</div>
                  <Search className="h-5 w-5 text-white/70" />
                </div>
                <div className="text-2xl font-bold mb-1">{stocks.length}</div>
                <div className="text-sm text-white/70">Tradable Assets</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Stocks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Available stocks for trading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredStocks.map((stock, index) => (
                    <motion.div
                      key={stock.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="font-bold text-gray-600">
                              {stock.symbol[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(stock.price)}
                          </div>
                          <div
                            className={`text-sm flex items-center justify-end ${
                              stock.change >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {stock.change >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} (
                            {stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span>Vol: {formatNumber(stock.volume)}</span>
                          <span>Cap: {formatCurrency(stock.marketCap)}</span>
                        </div>
                        <Button
                          onClick={() => handleBuyStock(stock)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle>Your Portfolio</CardTitle>
                <CardDescription>
                  Current holdings and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((stock, index) => (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="font-bold text-gray-600">
                                {stock.symbol[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {stock.symbol}
                              </div>
                              <div className="text-sm text-gray-500">
                                {stock.quantity} shares
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(stock.currentValue)}
                            </div>
                            <div
                              className={`text-sm flex items-center justify-end ${
                                stock.profitLoss >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {stock.profitLoss >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                              )}
                              {stock.profitLoss >= 0 ? "+" : ""}
                              {formatCurrency(stock.profitLoss)} (
                              {stock.profitLossPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Avg. Price: {formatCurrency(stock.averagePrice)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No stocks in your portfolio yet</p>
                    <p className="text-sm">
                      Start investing to build your portfolio
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Buy Stock Dialog */}
        <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buy {selectedStock?.symbol}</DialogTitle>
              <DialogDescription>
                {selectedStock?.name} -{" "}
                {selectedStock && formatCurrency(selectedStock.price)} per share
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Number of Shares</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
                {buyQuantity && selectedStock && (
                  <div className="text-sm text-gray-500">
                    Total:{" "}
                    {formatCurrency(
                      Number.parseInt(buyQuantity) * selectedStock.price
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyPin">Transaction PIN</Label>
                <Input
                  id="buyPin"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest"
                  placeholder="••••"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBuyDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Shares"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
