//@ts-nocheck
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI, usersAPI } from "@/lib/api";
import { authUtils } from "@/lib/store";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
  balance: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: (isAdmin?: boolean) => void;
  setUserBalance: (balance: number) => void;
  refreshUserData: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      initialized: false,

      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authAPI.login({ email, password });
          authUtils.storeToken("token", token);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            (error.code === "ERR_NETWORK"
              ? error.message
              : "An unknown error occurred");
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      adminLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, admin } = await authAPI.adminLogin({
            email,
            password,
          });
          authUtils.storeToken("adminToken", token);
          set({
            user: admin,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            (error.code === "ERR_NETWORK"
              ? error.message
              : "An unknown error occurred");
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authAPI.register({
            firstName,
            lastName,
            email,
            password,
          });
          authUtils.storeToken("token", token);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            (error.code === "ERR_NETWORK"
              ? error.message
              : "An unknown error occurred");
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      logout: (isAdmin = false) => {
        authUtils.removeToken("token");
        authUtils.removeToken("adminToken");
        window.location.href = isAdmin ? "/auth/admin-login" : "/";
        set({ user: null, isAuthenticated: false });
      },

      setUserBalance: (balance) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              balance,
            },
          });
        }
      },

      refreshUserData: async () => {
        set({ isLoading: true });
        try {
          const { user } = await usersAPI.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          // If there's an error, we don't change authentication state
          // This allows the interceptor to handle 401 errors
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        user: state.user ?? null,
        isAuthenticated: state.isAuthenticated ?? false,
        error: state.error ?? null,
        initialized: state.initialized ?? false,
        isLoading: false,
      }),
    }
  )
);
