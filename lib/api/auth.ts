import api from "./axios";
import { mockData } from "@/lib/mock-data";

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pin: string;
  personalInfo?: any;
  role: "customer" | "admin";
  balance: number;
  availableBalance: number;
  currentBalance: number;
  isEmailVerified: boolean;
  kycStatus: boolean;
  balanceVisibility: {
    available: boolean;
    current: boolean;
  };
}

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    console.log("Login API called");

    if (APP_STATE === "mock") {
      console.log("Using mock data for login");
      return mockData.login(credentials);
    }

    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  adminLogin: async (credentials: { email: string; password: string }) => {
    if (APP_STATE === "mock") {
      return mockData.adminLogin(credentials);
    }

    const response = await api.post("/auth/admin-login", credentials);

    // console.log("the resposne from the login",response)
    return response.data;
  },

  register: async (userData: RegisterData) => {
    if (APP_STATE === "mock") {
      return mockData.register(userData);
    }

    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (APP_STATE === "mock") {
      return mockData.changePassword(data);
    }

    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    if (APP_STATE === "mock") {
      return mockData.forgotPassword(email);
    }

    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    if (APP_STATE === "mock") {
      return mockData.resetPassword(data);
    }

    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    if (APP_STATE === "mock") {
      return mockData.verifyEmail(token);
    }

    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },
};
