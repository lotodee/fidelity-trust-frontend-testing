import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}

interface TransactionData {
  [key: string]: any;
}

interface Transaction {
  _id: string;
  action: "credit" | "debit";
  amount: number;
  type: string;
  subtype: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountNumber: string;
  };
  bitcoinAddress?: string;
  btcAmount?: number;
  paymentMethod?: string;
}

interface AdminTransactionStore {
  selectedUser: User | null;
  selectedTransaction: Transaction | null;
  setSelectedUser: (user: User | null) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  clearSelectedUser: () => void;
  clearSelectedTransaction: () => void;
  dynamicFields: Array<{ key: string; value: string }>;
  addDynamicField: (key: string, value: string) => void;
  updateDynamicField: (index: number, key: string, value: string) => void;
  removeDynamicField: (index: number) => void;
  clearDynamicFields: () => void;
}

interface AdminTransactionsStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (
    transactionId: string,
    updatedTransaction: Partial<Transaction>
  ) => void;
  deleteTransaction: (transactionId: string) => void;
  clearTransactions: () => void;
}

export const useAdminTransactionStore = create<AdminTransactionStore>(
  (set) => ({
    selectedUser: null,
    selectedTransaction: null,
    setSelectedUser: (user) => set({ selectedUser: user }),
    setSelectedTransaction: (transaction) =>
      set({ selectedTransaction: transaction }),
    clearSelectedUser: () => set({ selectedUser: null }),
    clearSelectedTransaction: () => set({ selectedTransaction: null }),
    dynamicFields: [],
    addDynamicField: (key, value) =>
      set((state) => ({
        dynamicFields: [...state.dynamicFields, { key, value }],
      })),
    updateDynamicField: (index, key, value) =>
      set((state) => ({
        dynamicFields: state.dynamicFields.map((field, i) =>
          i === index ? { key, value } : field
        ),
      })),
    removeDynamicField: (index) =>
      set((state) => ({
        dynamicFields: state.dynamicFields.filter((_, i) => i !== index),
      })),
    clearDynamicFields: () => set({ dynamicFields: [] }),
  })
);

export const useAdminTransactionsStore = create<AdminTransactionsStore>(
  (set) => ({
    transactions: [],
    setTransactions: (transactions) => set({ transactions }),
    addTransaction: (transaction) =>
      set((state) => ({ transactions: [...state.transactions, transaction] })),
    updateTransaction: (transactionId, updatedTransaction) =>
      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction._id === transactionId
            ? { ...transaction, ...updatedTransaction }
            : transaction
        ),
      })),
    deleteTransaction: (transactionId) =>
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) => transaction._id !== transactionId
        ),
      })),
    clearTransactions: () => set({ transactions: [] }),
  })
);
