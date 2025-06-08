"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelectedSymbolStore } from "@/lib/store/selected-symbol";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const StockDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { selectedSymbol, setSelectedSymbol } = useSelectedSymbolStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.symbol) {
      setSelectedSymbol(params.symbol as string);
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [params.symbol, setSelectedSymbol]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Stock Detail: {selectedSymbol}</h1>
          <p className="text-gray-500 mt-1">
            Detailed information about {selectedSymbol}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Placeholder for stock details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
              <p className="text-gray-600">
                We're working on implementing real-time stock data, trading
                functionality, and detailed analytics for {selectedSymbol}. Stay
                tuned for updates!
              </p>
            </div>
          </div>

          {/* Placeholder for trading panel */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Trading Panel</h2>
              <p className="text-gray-600">
                Trading functionality will be available soon. You'll be able to:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>View real-time price data</li>
                <li>Place buy and sell orders</li>
                <li>Track your position</li>
                <li>View historical performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StockDetailPage;
