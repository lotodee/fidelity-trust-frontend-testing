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
  role: "user" | "admin";
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
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/admin-login", credentials);

    return response.data;
  },

  register: async (userData: RegisterData) => {
    if (APP_STATE === "mock") {
      return mockData.register(userData);
    }

    const response = await api.post("/auth/register", userData);

    console.log("respose reg", response);
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

  // resetPassword: async (data: { token: string; password: string }) => {
  //   if (APP_STATE === "mock") {
  //     return mockData.resetPassword(data);
  //   }

  //   const response = await api.post("/auth/reset-password", data);
  //   return response.data;
  // },

  verifyEmail: async (token: string) => {
    if (APP_STATE === "mock") {
      return mockData.verifyEmail(token);
    }

    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  verifyUser: async (data: { email: string; ssnLastFour: string }) => {
    try {
      const response = await api.post("/auth/verify-user", data);
      return response.data;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  },

  resetPassword: async (data: { userId: string; newPassword: string }) => {
    try {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  changeAdminPassword: async (
    adminId: string,
    data: { currentPassword: string; newPassword: string }
  ) => {
    try {
      const response = await api.put(
        `/auth/admin/change-password/${adminId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error changing admin password:", error);
      throw error;
    }
  },

  getAdminProfile: async () => {
    try {
      const response = await api.get("/auth/admin/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  },
};
