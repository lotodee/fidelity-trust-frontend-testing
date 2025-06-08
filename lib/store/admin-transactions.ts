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
  userId: User;
  type: string;
  subtype: string;
  action: string;
  amount: number;
  status: string;
  data: TransactionData;
  createdAt: string;
  updatedAt: string;
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
