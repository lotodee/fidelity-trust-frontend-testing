export enum TransactionType {
  FUND_WALLET = "fundWallet",
  WITHDRAW = "withdraw",
  SEND_MONEY = "sendMoney",
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionAction {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export const transactionsAPI = {
  getAllTransactions: async () => {
    const response = await fetch("/transaction/admin/get-all-transactions");
    return response.json();
  },
  getTransactionById: async (id: string) => {
    const response = await fetch(`/api/transactions/${id}`);
    return response.json();
  },
  createTransaction: async (data: any) => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  updateTransaction: async (id: string, data: any) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export const usersAPI = {
  getAllUsers: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },
  getUserById: async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
};
