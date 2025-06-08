//@ts-nocheck
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI } from "@/lib/api/auth";
import { usersAPI } from "@/lib/api/users";
import { authUtils } from "@/lib/store";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
  balance: number;
  availableBalance: number;
  currentBalance: number;
  accountNumber: string;
  isEmailVerified: boolean;
  kycVerified: boolean;
  balanceVisibility: {
    available: boolean;
    current: boolean;
  };
  personalInfo?: any;
  lastLogin: Date;
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
    password: string,
    pin: string,
    personalInfo?: any
  ) => Promise<{ data: { user: User } }>;
  logout: (isAdmin?: boolean) => void;
  updateUserBalances: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
  setUser: (user: User) => void;
}

interface AdminLoginResponse {
  data: {
    token: string;
    firstName: string;
    data?: {
      firstName: string;
    };
  };
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

      setUser: (user) => set({ user, isAuthenticated: true }),

      initialize: async () => {
        console.log("Auth: Initializing auth state");
        const token = authUtils.getToken("token");
        console.log("Auth: Token exists", !!token);

        if (token) {
          console.log("Auth: Setting authenticated state");
          set({ isAuthenticated: true });
          try {
            console.log("Auth: Refreshing user data");
            // await get().refreshUserData();
            console.log("Auth: User data refreshed", get().user);
          } catch (error) {
            console.error("Auth: Error refreshing user data", error);
          }
        }
        console.log("Auth: Marking as initialized");
        set({ initialized: true });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });

          const token = response.data.token;
          const userData = response.data.user;

          authUtils.storeToken("token", token);
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.log("the error message", error);
          const errorMessage =
            error.response?.data?.message ||
            (error.code === "ERR_NETWORK"
              ? error.message
              : "An unknown error occurred");
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      adminLogin: async (
        email: string,
        password: string
      ): Promise<AdminLoginResponse> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.adminLogin({
            email,
            password,
          });

          console.log("the admin login respons in lib", response.data);
          authUtils.storeToken("adminToken", response.data.token);
          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
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

      register: async (
        firstName,
        lastName,
        email,
        password,
        pin,
        personalInfo
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({
            firstName,
            lastName,
            email,
            password,
            pin,
            personalInfo,
            role: "customer",
            balance: 0,
            availableBalance: 0,
            currentBalance: 0,
            isEmailVerified: false,
            kycVerified: false,
            balanceVisibility: {
              available: true,
              current: true,
            },
          });

          const token = response.data.token;
          const userData = response.data.user;

          authUtils.storeToken("token", token);
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return response;
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

      updateUserBalances: async () => {
        try {
          const response = await usersAPI.getCurrentUser();
          const user = get().user;
          if (user) {
            set({
              user: {
                ...user,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                balance: response.data.balance,
                availableBalance: response.data.availableBalance,
                currentBalance: response.data.currentBalance,
                isEmailVerified: response.data.isEmailVerified,
                kycVerified: response.data.kycVerified,
                balanceVisibility: response.data.balanceVisibility,
                personalInfo: response.data.personalInfo,
                lastLogin: response.data.lastLogin,
              },
            });
          }
        } catch (error) {
          console.error("Failed to update user data:", error);
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
