import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  currentBalance: number;
  availableBalance: number;
  isEmailVerified: boolean;
  kycVerified: boolean;
  accountNumber: string;
}

interface AdminUsersStore {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updatedUser: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  clearUsers: () => void;
}

export const useAdminUsersStore = create<AdminUsersStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (userId, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, ...updatedUser } : user
      ),
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user._id !== userId),
    })),
  clearUsers: () => set({ users: [] }),
}));
