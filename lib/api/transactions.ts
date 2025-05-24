import api from "./axios"
import { mockData } from "@/lib/mock-data"

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real"

export interface Transaction {
  _id: string
  userId: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  status: "pending" | "completed" | "failed"
  description?: string
  recipientId?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionData {
  userId: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  status?: "pending" | "completed" | "failed"
  description?: string
  recipientId?: string
}

export interface UpdateTransactionData {
  status?: "pending" | "completed" | "failed"
  amount?: number
  description?: string
}

export const transactionsAPI = {
  getUserTransactions: async () => {
    if (APP_STATE === "mock") {
      return mockData.getUserTransactions()
    }

    const response = await api.get("/transactions")
    return response.data
  },

  getAllTransactions: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllTransactions()
    }

    const response = await api.get("/admin/transactions")
    return response.data
  },

  getTransactionById: async (transactionId: string) => {
    if (APP_STATE === "mock") {
      return mockData.getTransactionById(transactionId)
    }

    const response = await api.get(`/transactions/${transactionId}`)
    return response.data
  },

  createTransaction: async (transactionData: CreateTransactionData) => {
    if (APP_STATE === "mock") {
      return mockData.createTransaction(transactionData)
    }

    const response = await api.post("/admin/transactions", transactionData)
    return response.data
  },

  updateTransaction: async (transactionId: string, transactionData: UpdateTransactionData) => {
    if (APP_STATE === "mock") {
      return mockData.updateTransaction(transactionId, transactionData)
    }

    const response = await api.put(`/admin/transactions/${transactionId}`, transactionData)
    return response.data
  },

  fundWallet: async (amount: number) => {
    if (APP_STATE === "mock") {
      return mockData.fundWallet(amount)
    }

    const response = await api.post("/transactions/fund", { amount })
    return response.data
  },

  withdraw: async (amount: number) => {
    if (APP_STATE === "mock") {
      return mockData.withdraw(amount)
    }

    const response = await api.post("/transactions/withdraw", { amount })
    return response.data
  },

  transfer: async (data: { recipientId: string; amount: number }) => {
    if (APP_STATE === "mock") {
      return mockData.transfer(data)
    }

    const response = await api.post("/transactions/transfer", data)
    return response.data
  },
}
