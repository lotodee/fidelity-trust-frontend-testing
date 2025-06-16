import axios from "axios";
import api from "./axios";

const API_KEYS = ["ZJ3JA48D5LEL040X", "GGECYTFD7CX9J0TL"];
let currentKeyIndex = 0;

const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

const makeAlphaVantageRequest = async (params: any) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        ...params,
        apikey: API_KEYS[currentKeyIndex],
      },
    });

    // Check if API key is exhausted
    if (response.data.Information) {
      console.log("API key exhausted, rotating to next key");
      getNextApiKey();
      // Retry with new key
      return axios.get(BASE_URL, {
        params: {
          ...params,
          apikey: API_KEYS[currentKeyIndex],
        },
      });
    }

    return response;
  } catch (error) {
    console.error("Error in Alpha Vantage request:", error);
    throw error;
  }
};

const BASE_URL = "https://www.alphavantage.co/query";

interface StockPortfolioItem {
  id: string;
  userId: string;
  stockId: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  purchaseDate: Date;
  status: "active" | "sold";
  createdAt: Date;
  updatedAt: Date;
}

interface StockPortfolio {
  success: boolean;
  data: StockPortfolioItem[];
}

export const stocksAPI = {
  // Alpha Vantage API endpoints
  getStockQuote: async (symbol: string) => {
    try {
      const response = await makeAlphaVantageRequest({
        function: "GLOBAL_QUOTE",
        symbol,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      throw error;
    }
  },

  getCompanyOverview: async (symbol: string) => {
    try {
      const response = await makeAlphaVantageRequest({
        function: "OVERVIEW",
        symbol,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching company overview:", error);
      throw error;
    }
  },

  getDailyTimeSeries: async (symbol: string) => {
    try {
      const response = await makeAlphaVantageRequest({
        function: "TIME_SERIES_DAILY",
        symbol,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching daily time series:", error);
      throw error;
    }
  },

  getTopMovers: async () => {
    try {
      const response = await makeAlphaVantageRequest({
        function: "TOP_GAINERS_LOSERS",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top movers:", error);
      throw error;
    }
  },

  searchStocks: async (keywords: string) => {
    try {
      const response = await makeAlphaVantageRequest({
        function: "SYMBOL_SEARCH",
        keywords,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching stocks:", error);
      throw error;
    }
  },

  // Backend API endpoints (using the existing axios instance)
  buyStock: async (data: {
    stockId: string;
    quantity: number;
    purchasePrice: number;
    totalCost: number;
  }) => {
    try {
      const response = await api.post("/stocks/purchase", data);
      return response.data;
    } catch (error) {
      console.error("Error buying stock:", error);
      throw error;
    }
  },

  getPortfolio: async (userId: string): Promise<StockPortfolio> => {
    try {
      const response = await api.get(`/stocks/portfolio/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      throw error;
    }
  },

  getEnrichedPortfolio: async (userId: string) => {
    try {
      // Get portfolio data from backend
      const portfolio = await stocksAPI.getPortfolio(userId);

      // Enrich each stock with current market data
      const enrichedStocks = await Promise.all(
        portfolio.data.map(async (stock) => {
          try {
            // Get current stock data from Alpha Vantage
            const quote = await stocksAPI.getStockQuote(stock.stockId);
            const quoteData = quote["Global Quote"] || {};

            // Get company overview
            const overview = await stocksAPI.getCompanyOverview(stock.stockId);

            return {
              ...stock,
              currentPrice: parseFloat(quoteData["05. price"] || "0"),
              currentValue:
                parseFloat(quoteData["05. price"] || "0") * stock.quantity,
              profitLoss:
                (parseFloat(quoteData["05. price"] || "0") -
                  stock.purchasePrice) *
                stock.quantity,
              profitLossPercent:
                ((parseFloat(quoteData["05. price"] || "0") -
                  stock.purchasePrice) /
                  stock.purchasePrice) *
                100,
              companyName: overview.Name || stock.stockId,
              sector: overview.Sector || "Unknown",
              marketCap: overview.MarketCapitalization || "0",
              peRatio: overview.PERatio || "0",
              dividendYield: overview.DividendYield || "0",
              yearHigh: overview["52WeekHigh"] || "0",
              yearLow: overview["52WeekLow"] || "0",
            };
          } catch (error) {
            console.error(`Error enriching stock ${stock.stockId}:`, error);
            return {
              ...stock,
              currentPrice: stock.purchasePrice,
              currentValue: stock.totalCost,
              profitLoss: 0,
              profitLossPercent: 0,
              companyName: stock.stockId,
              sector: "Unknown",
              marketCap: "0",
              peRatio: "0",
              dividendYield: "0",
              yearHigh: "0",
              yearLow: "0",
            };
          }
        })
      );

      return {
        success: true,
        data: enrichedStocks,
      };
    } catch (error) {
      console.error("Error getting enriched portfolio:", error);
      throw error;
    }
  },

  sellStock: async (data: {
    stockId: string;
    quantity: number;
    salePrice: number;
    totalValue: number;
  }) => {
      try {
        
      const response = await api.post("/stocks/sell", data);
      return response.data;
    } catch (error) {
      console.error("Error selling stock:", error);
      throw error;
    }
  },
};
