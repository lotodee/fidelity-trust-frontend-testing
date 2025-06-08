import api from "./axios";
import { mockData } from "@/lib/mock-data";

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
  personalInfo?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    ssn?: string;
    driverLicense?: string;
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  balance?: number;
  availableBalance?: number;
  currentBalance?: number;
  role?: string;
  isEmailVerified?: boolean;
  kycVerified?: boolean;
  balanceVisibility?: {
    available: boolean;
    current: boolean;
  };
  personalInfo?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    ssn?: string;
    driverLicense?: string;
  };
}

export const usersAPI = {
  getCurrentUser: async () => {
    if (APP_STATE === "mock") {
      return mockData.getCurrentUser();
    }

    const response = await api.get(`/user/me/`);
    return response.data;
  },

  getUserBalances: async () => {
    if (APP_STATE === "mock") {
      return mockData.getCurrentUser();
    }

    const response = await api.get("/user/balances");
    return response.data;
  },
  verifyUserPin: async (pin: string) => {
    if (APP_STATE === "mock") {
      return mockData.getCurrentUser();
    }

    const response = await api.post("/user/verify-pin", { pin });
    return response.data;
  },

  getAllMembersAccount: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllUsers();
    }

    const response = await api.get("/user/transfer-list");
    console.log("resposne in here", response);
    return response.data;
  },

  getAllUsers: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllUsers();
    }

    const response = await api.get("/user/admin/get-all-users");
    return response.data;
  },

  getUserById: async (userId: string) => {
    if (APP_STATE === "mock") {
      return mockData.getUserById(userId);
    }

    const response = await api.get(`/user/admin/get-single-user/${userId}`);
    return response.data;
  },

  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    currentBalance?: number;
    availableBalance?: number;
  }) => {
    if (APP_STATE === "mock") {
      return mockData.createUser(userData);
    }

    const response = await api.post("/user/admin/create-user", userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    if (APP_STATE === "mock") {
      return mockData.updateUser(userId, userData);
    }

    const response = await api.put(
      `/user/admin/update-user/${userId}`,
      userData
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    if (APP_STATE === "mock") {
      return mockData.deleteUser(userId);
    }

    const response = await api.delete(`/user/admin/delete-user/${userId}`);
    return response.data;
  },

  updateProfile: async (userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    if (APP_STATE === "mock") {
      return mockData.updateProfile(userData);
    }

    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  updateUserInfo: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    if (APP_STATE === "mock") {
      return mockData.updateProfile(userData);
    }

    const response = await api.put("/auth/update-info", userData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    if (APP_STATE === "mock") {
      return mockData.updateProfile({});
    }

    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  changePin: async (pinData: { currentPin: string; newPin: string }) => {
    if (APP_STATE === "mock") {
      return mockData.updateProfile({});
    }

    const response = await api.put("/auth/change-pin", pinData);
    return response.data;
  },
};
