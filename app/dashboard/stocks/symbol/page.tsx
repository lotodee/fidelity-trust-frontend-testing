"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelectedSymbolStore } from "@/lib/store/selected-symbol";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { stocksAPI } from "@/lib/api/stocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Informer } from "@/components/ui/informer";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  description: string;
  sector: string;
  industry: string;
  peRatio: number;
  eps: number;
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

const StockDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { selectedSymbol, setSelectedSymbol } = useSelectedSymbolStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.symbol) {
      setSelectedSymbol(params.symbol as string);
      fetchStockData(params.symbol as string);
    }
  }, [params.symbol, setSelectedSymbol]);

  const fetchStockData = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch both quote and overview data
      const [quoteResponse, overviewResponse] = await Promise.all([
        stocksAPI.getStockQuote(symbol),
        stocksAPI.getCompanyOverview(symbol),
      ]);

      const quoteData = quoteResponse["Global Quote"] || {};
      const overviewData = overviewResponse;

      const detail: StockDetail = {
        symbol: symbol,
        name: overviewData.Name || symbol,
        price: parseFloat(quoteData["05. price"] || "0"),
        change: parseFloat(quoteData["09. change"] || "0"),
        changePercent: parseFloat(
          quoteData["10. change percent"]?.replace("%", "") || "0"
        ),
        volume: parseInt(quoteData["06. volume"] || "0"),
        marketCap: parseInt(overviewData.MarketCapitalization || "0"),
        description: overviewData.Description || "",
        sector: overviewData.Sector || "",
        industry: overviewData.Industry || "",
        peRatio: parseFloat(overviewData.PERatio || "0"),
        eps: parseFloat(overviewData.EPS || "0"),
        dividendYield: parseFloat(overviewData.DividendYield || "0"),
        beta: parseFloat(overviewData.Beta || "0"),
        fiftyTwoWeekHigh: parseFloat(overviewData["52WeekHigh"] || "0"),
        fiftyTwoWeekLow: parseFloat(overviewData["52WeekLow"] || "0"),
      };

      setStockDetail(detail);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Failed to fetch stock data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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

  const handleBuyStock = (stock: StockDetail) => {
    // Implement buy functionality
    console.log("Buying stock:", stock);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <Informer
            type="error"
            title="Error"
            message={error}
            onClose={() => router.push("/dashboard/stocks")}
          />
        </div>
      </DashboardLayout>
    );
  }

  if (!stockDetail) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">
            {stockDetail.name} ({stockDetail.symbol})
          </h1>
          <p className="text-gray-500 mt-1">
            {stockDetail.sector} • {stockDetail.industry}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(stockDetail.price)}
                    </p>
                    <div
                      className={`flex items-center text-sm ${
                        stockDetail.change >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {stockDetail.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {stockDetail.change >= 0 ? "+" : ""}
                      {formatCurrency(stockDetail.change)} (
                      {stockDetail.changePercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Market Cap</p>
                    <p className="text-xl font-semibold">
                      {formatNumber(stockDetail.marketCap)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="text-xl font-semibold">
                      {formatNumber(stockDetail.volume)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">P/E Ratio</p>
                    <p className="text-xl font-semibold">
                      {stockDetail.peRatio.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{stockDetail.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">EPS</p>
                    <p className="font-semibold">
                      {formatCurrency(stockDetail.eps)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Dividend Yield</p>
                    <p className="font-semibold">
                      {stockDetail.dividendYield.toFixed(2)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Beta</p>
                    <p className="font-semibold">
                      {stockDetail.beta.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">52 Week Range</p>
                    <p className="font-semibold">
                      {formatCurrency(stockDetail.fiftyTwoWeekLow)} -{" "}
                      {formatCurrency(stockDetail.fiftyTwoWeekHigh)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trading Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Current Price</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(stockDetail.price)}
                    </p>
                    <div
                      className={`flex items-center text-sm mt-1 ${
                        stockDetail.change >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {stockDetail.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {stockDetail.change >= 0 ? "+" : ""}
                      {formatCurrency(stockDetail.change)} (
                      {stockDetail.changePercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Trading Status</p>
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <span className="text-emerald-700">Market Open</span>
                      <span className="text-emerald-700">•</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => handleBuyStock(stockDetail)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Buy {stockDetail.symbol}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StockDetailPage;
