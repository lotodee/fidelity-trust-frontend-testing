import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
}

interface Transaction {
  _id: string;
  userId: User;
  type: string;
  subtype: string;
  action: string;
  amount: number;
  status: string;
  data: {
    data: {
      description?: string;
      recipientAccount?: string;
      recipientId?: string;
      recipientName?: string;
      senderAccountNumber?: string;
      senderId?: string;
      senderName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface AdminStore {
  selectedUser: User | null;
  selectedTransaction: Transaction | null;
  setSelectedUser: (user: User | null) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedUser: null,
  selectedTransaction: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedTransaction: (transaction) =>
    set({ selectedTransaction: transaction }),
}));
