"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { stocksAPI } from "@/lib/api/stocks";
import { useUserStocksStore } from "@/lib/store/user-stocks";
import { v4 as uuidv4 } from "uuid";
import { usersAPI } from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/auth";
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

interface BoughtStock {
  id: string;
  stockId: string;
  userId: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  purchaseDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  companyName: string;
  sector: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  yearHigh: string;
  yearLow: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Update the buy dialog content
const BuyStockDialog = ({
  stock,
  onClose,
  onSubmit,
  isProcessing,
}: {
  stock: Stock;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isProcessing: boolean;
}) => {
  const [quantity, setQuantity] = useState("");
  const totalCost = quantity ? parseInt(quantity) * stock.price : 0;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Buy {stock.symbol}</DialogTitle>
        <DialogDescription>
          {stock.name} - {formatCurrency(stock.price)} per share
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Number of Shares</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
          {quantity && (
            <div className="text-sm text-gray-500">
              Total Cost: {formatCurrency(totalCost)}
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm text-gray-600">
          <p className="font-medium">Important Information:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>This purchase will be deducted from your available balance</li>
            <li>
              Fidelity Trust acts as a platform and does not own the stocks
            </li>
            <li>
              Stock prices are real-time and may change before purchase
              completion
            </li>
            <li>All transactions are final and cannot be reversed</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isProcessing || !quantity}
            onClick={() => onSubmit(parseInt(quantity))}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Purchase"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Add the sell dialog component
const SellStockDialog = ({
  stock,
  onClose,
  onSubmit,
  isProcessing,
}: {
  stock: BoughtStock;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isProcessing: boolean;
}) => {
  const [quantity, setQuantity] = useState("");
  const totalValue = quantity ? parseInt(quantity) * stock.currentPrice : 0;
  const profitLoss = quantity
    ? (stock.currentPrice - stock.purchasePrice) * parseInt(quantity)
    : 0;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Sell {stock.stockId}</DialogTitle>
        <DialogDescription>
          {stock.companyName} - {formatCurrency(stock.currentPrice)} per share
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Number of Shares to Sell</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={stock.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Max: ${stock.quantity} shares`}
            required
          />
          {quantity && (
            <div className="space-y-1 text-sm">
              <div className="text-gray-500">
                Total Value: {formatCurrency(totalValue)}
              </div>
              <div
                className={`${
                  profitLoss >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {profitLoss >= 0 ? "+" : ""}
                {formatCurrency(profitLoss)} (
                {(
                  (profitLoss / (stock.purchasePrice * parseInt(quantity))) *
                  100
                ).toFixed(2)}
                %)
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm text-gray-600">
          <p className="font-medium">Important Information:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>The proceeds will be added to your available balance</li>
            <li>
              Stock prices are real-time and may change before sale completion
            </li>
            <li>All transactions are final and cannot be reversed</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              isProcessing || !quantity || parseInt(quantity) > stock.quantity
            }
            onClick={() => onSubmit(parseInt(quantity))}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Sale"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default function StocksPage() {
  const { toast } = useToast();
  const { user, updateUserBalances } = useAuthStore();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [buyQuantity, setBuyQuantity] = useState("");
  const [pin, setPin] = useState("");
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { boughtStocks, addBoughtStock, setBoughtStocks } =
    useUserStocksStore();
  const [showInformer, setShowInformer] = useState(false);
  const [informerData, setInformerData] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
  } | null>(null);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [selectedStockForSale, setSelectedStockForSale] =
    useState<BoughtStock | null>(null);
  const [apiExhausted, setApiExhausted] = useState(false);

  // Fetch initial stocks (top gainers and losers)
  useEffect(() => {
    fetchTopMovers();
  }, []);

  const fetchTopMovers = async () => {
    setIsLoadingStocks(true);
    try {
      const response = await stocksAPI.getTopMovers();

      if (response.Information) {
        setApiExhausted(true);
        // setInformerData({
        //   type: "info",
        //   title: "Stock Data Update",
        //   message:
        //     "We're currently updating our stock information. Please check back in a few minutes.",
        // });
        //  setShowInformer(true);
        return;
      }

      setApiExhausted(false);
      const topGainers = response.top_gainers || [];
      const topLosers = response.top_losers || [];

      const formattedStocks = [...topGainers, ...topLosers].map(
        (stock: any) => ({
          id: stock.ticker,
          symbol: stock.ticker,
          name: stock.company_name,
          price: parseFloat(stock.price),
          change: parseFloat(stock.change_amount),
          changePercent: parseFloat(stock.change_percentage),
          volume: parseInt(stock.volume),
          marketCap: parseInt(stock.market_cap),
        })
      );

      setStocks(formattedStocks);
    } catch (error) {
      console.error("Error fetching top movers:", error);
      setInformerData({
        type: "error",
        title: "Error",
        message: "Failed to fetch stock data. Please try again.",
      });
      setShowInformer(true);
    } finally {
      setIsLoadingStocks(false);
    }
  };

  // Handle stock search
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await stocksAPI.searchStocks(searchTerm);
      const results = response.bestMatches || [];

      const formattedResults = await Promise.all(
        results.map(async (result: any) => {
          const quote = await stocksAPI.getStockQuote(result["1. symbol"]);
          const quoteData = quote["Global Quote"] || {};

          return {
            id: result["1. symbol"],
            symbol: result["1. symbol"],
            name: result["2. name"],
            price: parseFloat(quoteData["05. price"] || "0"),
            change: parseFloat(quoteData["09. change"] || "0"),
            changePercent: parseFloat(
              quoteData["10. change percent"]?.replace("%", "") || "0"
            ),
            volume: parseInt(quoteData["06. volume"] || "0"),
            marketCap: 0, // Market cap not available in search results
          };
        })
      );

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching stocks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search stocks. Please try again.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const totalPortfolioValue = boughtStocks.reduce(
    (sum, stock) => sum + stock.currentValue,
    0
  );
  const totalProfitLoss = boughtStocks.reduce(
    (sum, stock) => sum + stock.profitLoss,
    0
  );
  const totalProfitLossPercent =
    totalPortfolioValue > 0
      ? (totalProfitLoss / (totalPortfolioValue - totalProfitLoss)) * 100
      : 0;

  const handleBuyStock = (stock: Stock) => {
    console.log("Selected stock for purchase:", {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      volume: stock.volume,
      marketCap: stock.marketCap,
    });
    setSelectedStock(stock);
    setShowBuyDialog(true);
  };

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?._id) return;

      try {
        const response = await stocksAPI.getEnrichedPortfolio(user._id);
        if (response.success) {
          setBoughtStocks(response.data);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setInformerData({
          type: "error",
          title: "Error",
          message: "Failed to fetch your portfolio data. Please try again.",
        });
        setShowInformer(true);
      }
    };

    fetchPortfolio();
  }, [user?._id]);

  // Update handleBuySubmit to remove PIN verification
  const handleBuySubmit = async (quantity: number) => {
    if (!selectedStock) return;

    const totalCost = quantity * selectedStock.price;

    if (user?.availableBalance < totalCost) {
      setInformerData({
        type: "error",
        title: "Insufficient Balance",
        message: "You don't have enough balance to complete this purchase",
      });
      setShowInformer(true);
      return;
    }

    try {
      setIsProcessing(true);

      // Proceed with purchase using the stock's symbol as the stockId
      const purchase = await stocksAPI.buyStock({
        stockId: selectedStock.id, // Using the stock symbol as the ID
        quantity,
        purchasePrice: selectedStock.price,
        totalCost,
      });

      // Refresh portfolio data
      const portfolioResponse = await stocksAPI.getEnrichedPortfolio(user._id);
      if (portfolioResponse.success) {
        setBoughtStocks(portfolioResponse.data);
      }

      setShowBuyDialog(false);
      setSelectedStock(null);

      setInformerData({
        type: "success",
        title: "Success",
        message: `Successfully purchased ${quantity} shares of ${selectedStock.symbol}`,
      });
      setShowInformer(true);

      // Refresh user's balance
      const updatedBalances = await usersAPI.getUserBalances();
      if (updatedBalances) {
        useAuthStore.setState({ user: { ...user, ...updatedBalances } });
      }
    } catch (error) {
      console.error("Error buying stock:", error);
      setInformerData({
        type: "error",
        title: "Error",
        message: "Failed to complete the purchase. Please try again.",
      });
      setShowInformer(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add handleSellSubmit function
  const handleSellSubmit = async (quantity: number) => {
    if (!selectedStockForSale) return;

    try {
      setIsProcessing(true);

      // Call the sell stock API
      const sale = await stocksAPI.sellStock({
        stockId: selectedStockForSale.id,
        quantity,
        salePrice: selectedStockForSale.currentPrice,
        totalValue: quantity * selectedStockForSale.currentPrice,
      });

      // Refresh portfolio data
      const portfolioResponse = await stocksAPI.getEnrichedPortfolio(user._id);
      if (portfolioResponse.success) {
        setBoughtStocks(portfolioResponse.data);
      }

      setShowSellDialog(false);
      setSelectedStockForSale(null);

      setInformerData({
        type: "success",
        title: "Success",
        message: `Successfully sold ${quantity} shares of ${selectedStockForSale.stockId}`,
      });
      setShowInformer(true);

      // Refresh user's balance
      const updatedBalances = await usersAPI.getUserBalances();
      if (updatedBalances) {
        useAuthStore.setState({ user: { ...user, ...updatedBalances } });
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      setInformerData({
        type: "error",
        title: "Error",
        message: "Failed to complete the sale. Please try again.",
      });
      setShowInformer(true);
    } finally {
      setIsProcessing(false);
    }
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
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
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
                  {boughtStocks.length}
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
                {apiExhausted ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="bg-gray-50 rounded-xl p-8 max-w-lg w-full border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                          <Clock className="h-12 w-12 text-blue-500 animate-pulse" />
                          <RefreshCw className="h-6 w-6 text-blue-400 absolute -bottom-2 -right-2 animate-spin" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-center mb-3 text-gray-800">
                        Market Data Update in Progress
                      </h3>

                      <div className="space-y-4 text-center">
                        <p className="text-gray-600">
                          We're currently refreshing our stock market data to
                          ensure you have the most accurate information.
                        </p>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <p className="text-sm text-blue-700 font-medium mb-1">
                                Why is this happening?
                              </p>
                              <p className="text-sm text-blue-600">
                                To maintain data accuracy, we periodically
                                update our market information. This usually
                                takes just a few minutes.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          <span>Please check back in a few minutes</span>
                        </div>

                        <Button
                          onClick={fetchTopMovers}
                          variant="outline"
                          className="mt-4"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {(searchTerm ? searchResults : stocks).map(
                      (stock, index) => (
                        <motion.div
                          key={stock.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="font-bold text-gray-600 text-lg">
                                  {stock.symbol[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-lg">
                                  {stock.symbol}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stock.name}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-400">
                                    Vol: {formatNumber(stock.volume)}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    •
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    Cap: {formatCurrency(stock.marketCap)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">
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
                              <Button
                                onClick={() => handleBuyStock(stock)}
                                className="mt-2 bg-emerald-500 hover:bg-emerald-600"
                                size="sm"
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                Buy
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Stocks */}
            {boughtStocks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Stocks</CardTitle>
                  <CardDescription>
                    Current holdings and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {boughtStocks.map((stock, index) => (
                      <motion.div
                        key={stock.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="font-bold text-gray-600">
                                {stock.stockId[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {stock.stockId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {stock.companyName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {stock.sector} • {stock.quantity} shares
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
                            <Button
                              onClick={() => {
                                setSelectedStockForSale(stock);
                                setShowSellDialog(true);
                              }}
                              disabled={apiExhausted}
                              className="mt-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              size="sm"
                            >
                              Sell
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-gray-500">
                          <div>
                            <div className="font-medium">Avg. Price</div>
                            <div>{formatCurrency(stock.purchasePrice)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Current Price</div>
                            <div>{formatCurrency(stock.currentPrice)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Total Cost</div>
                            <div>{formatCurrency(stock.totalCost)}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-xs text-gray-500">
                          <div>
                            <div className="font-medium">P/E Ratio</div>
                            <div>{stock.peRatio}</div>
                          </div>
                          <div>
                            <div className="font-medium">Dividend Yield</div>
                            <div>{stock.dividendYield}%</div>
                          </div>
                          <div>
                            <div className="font-medium">Market Cap</div>
                            <div>{formatNumber(parseInt(stock.marketCap))}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Buy Stock Dialog */}
        <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          {selectedStock && (
            <BuyStockDialog
              stock={selectedStock}
              onClose={() => {
                setShowBuyDialog(false);
                setSelectedStock(null);
              }}
              onSubmit={handleBuySubmit}
              isProcessing={isProcessing}
            />
          )}
        </Dialog>

        {/* Sell Stock Dialog */}
        <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
          {selectedStockForSale && (
            <SellStockDialog
              stock={selectedStockForSale}
              onClose={() => {
                setShowSellDialog(false);
                setSelectedStockForSale(null);
              }}
              onSubmit={handleSellSubmit}
              isProcessing={isProcessing}
            />
          )}
        </Dialog>

        {/* Informer */}
        {showInformer && informerData && (
          <Informer
            type={informerData.type}
            title={informerData.title}
            message={informerData.message}
            onClose={() => setShowInformer(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
