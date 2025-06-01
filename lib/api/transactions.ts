import api from "./axios";
import { mockData } from "@/lib/mock-data";

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real";

export enum TransactionType {
  FUND_WALLET = "fundWallet",
  SEND_MONEY = "sendMoney",
  WITHDRAW = "withdraw",
}

export enum TransactionAction {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  subtype: string;
  action: TransactionAction;
  status: TransactionStatus;
  amount: number;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: TransactionType;
  subtype: string;
  action: TransactionAction;
  amount: number;
  data: Record<string, any>;
}

export interface UpdateTransactionData {
  status: TransactionStatus;
}

export const transactionsAPI = {
  getUserTransactions: async () => {
    if (APP_STATE === "mock") {
      return mockData.getUserTransactions();
    }

    const response = await api.get("/transaction/user");
    return response.data;
  },

  getAllTransactions: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllTransactions();
    }

    const response = await api.get("/admin/transactions");
    return response.data;
  },

  getTransactionById: async (transactionId: string) => {
    if (APP_STATE === "mock") {
      return mockData.getTransactionById(transactionId);
    }

    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },

  createTransaction: async (transactionData: CreateTransactionData) => {
    if (APP_STATE === "mock") {
      return mockData.createTransaction(transactionData);
    }

    const response = await api.post("/transactions", transactionData);
    return response.data;
  },

  updateTransactionStatus: async (
    transactionId: string,
    status: TransactionStatus
  ) => {
    if (APP_STATE === "mock") {
      return mockData.updateTransaction(transactionId, { status });
    }

    const response = await api.put(`/transactions/${transactionId}/status`, {
      status,
    });
    return response.data;
  },

  fundWallet: async (
    amount: number,
    subtype: string,
    data: Record<string, any>
  ) => {
    if (APP_STATE === "mock") {
      return mockData.fundWallet(amount);
    }

    const response = await api.post("/transaction/fund", {
      amount,
      subtype,
      ...data,
    });
    return response.data;
  },

  withdraw: async (
    amount: number,
    subtype: string,
    data: Record<string, any>
  ) => {
    if (APP_STATE === "mock") {
      return mockData.withdraw(amount);
    }

    const response = await api.post("/transaction/withdraw", {
      amount,
      subtype,
      ...data,
    });
    return response.data;
  },

  sendMoney: async (data: {
    amount: number;
    subtype: string;
    [key: string]: any;
  }) => {
  

    const response = await api.post("/transaction/send", data);
    return response.data;
  },
};
