import { create } from "zustand";

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

interface UserStocksStore {
  boughtStocks: BoughtStock[];
  addBoughtStock: (stock: BoughtStock) => void;
  setBoughtStocks: (stocks: BoughtStock[]) => void;
  removeBoughtStock: (stockId: string) => void;
}

export const useUserStocksStore = create<UserStocksStore>((set) => ({
  boughtStocks: [],
  addBoughtStock: (stock) =>
    set((state) => ({
      boughtStocks: [...state.boughtStocks, stock],
    })),
  setBoughtStocks: (stocks) => set({ boughtStocks: stocks }),
  removeBoughtStock: (stockId) =>
    set((state) => ({
      boughtStocks: state.boughtStocks.filter((stock) => stock.id !== stockId),
    })),
}));
