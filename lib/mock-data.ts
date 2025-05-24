import { v4 as uuidv4 } from "uuid"
import type { User, UpdateUserData } from "./api/users"
import type { Transaction, CreateTransactionData, UpdateTransactionData } from "./api/transactions"
import type { Card, CreateCardData, UpdateCardData } from "./api/cards"
import type { ChatMessage } from "./api/chat"

// Mock users
const users: User[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
    role: "customer",
    balance: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    balance: 10000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock transactions
const transactions: Transaction[] = [
  {
    _id: "1",
    userId: "1",
    type: "deposit",
    amount: 1000,
    status: "completed",
    description: "Initial deposit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: "1",
    type: "withdrawal",
    amount: 500,
    status: "completed",
    description: "ATM withdrawal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    userId: "1",
    type: "transfer",
    amount: 200,
    status: "completed",
    description: "Transfer to friend",
    recipientId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock cards
const cards: Card[] = [
  {
    _id: "1",
    userId: "1",
    cardNumber: "4111 1111 1111 1111",
    cardType: "visa",
    expiryDate: "12/25",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: "1",
    cardNumber: "5555 5555 5555 4444",
    cardType: "mastercard",
    expiryDate: "10/24",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock chat messages
const chatMessages: ChatMessage[] = [
  {
    _id: "1",
    userId: "1",
    message: "Hello, I need help with my account",
    sender: "user",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    userId: "1",
    message: "Hi there! How can I assist you today?",
    sender: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    userId: "1",
    message: "I can't see my recent transaction",
    sender: "user",
    createdAt: new Date().toISOString(),
  },
]

// Mock data functions
export const mockData = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const user = users.find((u) => u.email === credentials.email)

    if (!user || credentials.password !== "password") {
      throw new Error("Invalid credentials")
    }

    return {
      token: "mock-token-" + user._id,
      user: { ...user },
    }
  },

  adminLogin: async (credentials: { email: string; password: string }) => {
    const admin = users.find((u) => u.email === credentials.email && u.role === "admin")

    if (!admin || credentials.password !== "password") {
      throw new Error("Invalid admin credentials")
    }

    return {
      token: "mock-admin-token-" + admin._id,
      admin: { ...admin },
    }
  },

  register: async (userData: any) => {
    const newUser: User = {
      _id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: "customer",
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)

    return {
      token: "mock-token-" + newUser._id,
      user: { ...newUser },
    }
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    if (data.currentPassword !== "password") {
      throw new Error("Current password is incorrect")
    }

    return { message: "Password changed successfully" }
  },

  forgotPassword: async (email: string) => {
    const user = users.find((u) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    return { message: "Password reset email sent" }
  },

  resetPassword: async (data: { token: string; password: string }) => {
    return { message: "Password reset successfully" }
  },

  verifyEmail: async (token: string) => {
    return { message: "Email verified successfully" }
  },

  // Users
  getCurrentUser: async () => {
    return { user: users[0] }
  },

  getAllUsers: async () => {
    return { users }
  },

  getUserById: async (userId: string) => {
    const user = users.find((u) => u._id === userId)

    if (!user) {
      throw new Error("User not found")
    }

    return { user }
  },

  createUser: async (userData: any) => {
    const newUser: User = {
      _id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role || "customer",
      balance: userData.balance || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)

    return { user: newUser }
  },

  updateUser: async (userId: string, userData: UpdateUserData) => {
    const userIndex = users.findIndex((u) => u._id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser

    return { user: updatedUser }
  },

  deleteUser: async (userId: string) => {
    const userIndex = users.findIndex((u) => u._id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users.splice(userIndex, 1)

    return { message: "User deleted successfully" }
  },

  updateProfile: async (userData: any) => {
    const updatedUser = {
      ...users[0],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    users[0] = updatedUser

    return { user: updatedUser }
  },

  // Transactions
  getUserTransactions: async () => {
    return { transactions: transactions.filter((t) => t.userId === "1") }
  },

  getAllTransactions: async () => {
    return { transactions }
  },

  getTransactionById: async (transactionId: string) => {
    const transaction = transactions.find((t) => t._id === transactionId)

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    return { transaction }
  },

  createTransaction: async (transactionData: CreateTransactionData) => {
    const newTransaction: Transaction = {
      _id: uuidv4(),
      userId: transactionData.userId,
      type: transactionData.type,
      amount: transactionData.amount,
      status: transactionData.status || "pending",
      description: transactionData.description,
      recipientId: transactionData.recipientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    transactions.push(newTransaction)

    // Update user balance if transaction is completed
    if (newTransaction.status === "completed") {
      const userIndex = users.findIndex((u) => u._id === newTransaction.userId)

      if (userIndex !== -1) {
        if (newTransaction.type === "deposit") {
          users[userIndex].balance += newTransaction.amount
        } else if (newTransaction.type === "withdrawal" || newTransaction.type === "transfer") {
          users[userIndex].balance -= newTransaction.amount
        }
      }

      // Update recipient balance for transfers
      if (newTransaction.type === "transfer" && newTransaction.recipientId) {
        const recipientIndex = users.findIndex((u) => u._id === newTransaction.recipientId)

        if (recipientIndex !== -1) {
          users[recipientIndex].balance += newTransaction.amount
        }
      }
    }

    return { transaction: newTransaction }
  },

  updateTransaction: async (transactionId: string, transactionData: UpdateTransactionData) => {
    const transactionIndex = transactions.findIndex((t) => t._id === transactionId)

    if (transactionIndex === -1) {
      throw new Error("Transaction not found")
    }

    const oldTransaction = transactions[transactionIndex]
    const updatedTransaction = {
      ...oldTransaction,
      ...transactionData,
      updatedAt: new Date().toISOString(),
    }

    transactions[transactionIndex] = updatedTransaction

    // Handle status change from pending to completed
    if (oldTransaction.status !== "completed" && updatedTransaction.status === "completed") {
      const userIndex = users.findIndex((u) => u._id === updatedTransaction.userId)

      if (userIndex !== -1) {
        if (updatedTransaction.type === "deposit") {
          users[userIndex].balance += updatedTransaction.amount
        } else if (updatedTransaction.type === "withdrawal" || updatedTransaction.type === "transfer") {
          users[userIndex].balance -= updatedTransaction.amount
        }
      }

      // Update recipient balance for transfers
      if (updatedTransaction.type === "transfer" && updatedTransaction.recipientId) {
        const recipientIndex = users.findIndex((u) => u._id === updatedTransaction.recipientId)

        if (recipientIndex !== -1) {
          users[recipientIndex].balance += updatedTransaction.amount
        }
      }
    }

    return { transaction: updatedTransaction }
  },

  fundWallet: async (amount: number) => {
    const newTransaction: Transaction = {
      _id: uuidv4(),
      userId: "1",
      type: "deposit",
      amount,
      status: "completed",
      description: "Wallet funding",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    transactions.push(newTransaction)

    // Update user balance
    users[0].balance += amount

    return {
      transaction: newTransaction,
      balance: users[0].balance,
    }
  },

  withdraw: async (amount: number) => {
    if (users[0].balance < amount) {
      throw new Error("Insufficient balance")
    }

    const newTransaction: Transaction = {
      _id: uuidv4(),
      userId: "1",
      type: "withdrawal",
      amount,
      status: "completed",
      description: "Withdrawal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    transactions.push(newTransaction)

    // Update user balance
    users[0].balance -= amount

    return {
      transaction: newTransaction,
      balance: users[0].balance,
    }
  },

  transfer: async (data: { recipientId: string; amount: number }) => {
    if (users[0].balance < data.amount) {
      throw new Error("Insufficient balance")
    }

    const newTransaction: Transaction = {
      _id: uuidv4(),
      userId: "1",
      type: "transfer",
      amount: data.amount,
      status: "completed",
      description: "Transfer",
      recipientId: data.recipientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    transactions.push(newTransaction)

    // Update sender balance
    users[0].balance -= data.amount

    // Update recipient balance
    const recipientIndex = users.findIndex((u) => u._id === data.recipientId)
    if (recipientIndex !== -1) {
      users[recipientIndex].balance += data.amount
    }

    return {
      transaction: newTransaction,
      balance: users[0].balance,
    }
  },

  // Cards
  getUserCards: async () => {
    return { cards: cards.filter((c) => c.userId === "1") }
  },

  getAllCards: async () => {
    return { cards }
  },

  getCardById: async (cardId: string) => {
    const card = cards.find((c) => c._id === cardId)

    if (!card) {
      throw new Error("Card not found")
    }

    return { card }
  },

  createCard: async (cardData: CreateCardData) => {
    const newCard: Card = {
      _id: uuidv4(),
      userId: cardData.userId,
      cardNumber: generateCardNumber(),
      cardType: cardData.cardType,
      expiryDate: generateExpiryDate(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    cards.push(newCard)

    return { card: newCard }
  },

  updateCard: async (cardId: string, cardData: UpdateCardData) => {
    const cardIndex = cards.findIndex((c) => c._id === cardId)

    if (cardIndex === -1) {
      throw new Error("Card not found")
    }

    const updatedCard = {
      ...cards[cardIndex],
      ...cardData,
      updatedAt: new Date().toISOString(),
    }

    cards[cardIndex] = updatedCard

    return { card: updatedCard }
  },

  deleteCard: async (cardId: string) => {
    const cardIndex = cards.findIndex((c) => c._id === cardId)

    if (cardIndex === -1) {
      throw new Error("Card not found")
    }

    cards.splice(cardIndex, 1)

    return { message: "Card deleted successfully" }
  },

  requestCard: async (cardType: string) => {
    const newCard: Card = {
      _id: uuidv4(),
      userId: "1",
      cardNumber: generateCardNumber(),
      cardType,
      expiryDate: generateExpiryDate(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    cards.push(newCard)

    return { card: newCard }
  },

  activateCard: async (cardId: string) => {
    const cardIndex = cards.findIndex((c) => c._id === cardId)

    if (cardIndex === -1) {
      throw new Error("Card not found")
    }

    cards[cardIndex].isActive = true
    cards[cardIndex].updatedAt = new Date().toISOString()

    return { card: cards[cardIndex] }
  },

  deactivateCard: async (cardId: string) => {
    const cardIndex = cards.findIndex((c) => c._id === cardId)

    if (cardIndex === -1) {
      throw new Error("Card not found")
    }

    cards[cardIndex].isActive = false
    cards[cardIndex].updatedAt = new Date().toISOString()

    return { card: cards[cardIndex] }
  },

  // Chat
  getUserMessages: async () => {
    return { messages: chatMessages.filter((m) => m.userId === "1") }
  },

  getAllMessages: async () => {
    return { messages: chatMessages }
  },

  getUserMessagesByUserId: async (userId: string) => {
    return { messages: chatMessages.filter((m) => m.userId === userId) }
  },

  sendMessage: async (message: string) => {
    const newMessage: ChatMessage = {
      _id: uuidv4(),
      userId: "1",
      message,
      sender: "user",
      createdAt: new Date().toISOString(),
    }

    chatMessages.push(newMessage)

    return { message: newMessage }
  },

  sendAdminMessage: async (userId: string, message: string) => {
    const newMessage: ChatMessage = {
      _id: uuidv4(),
      userId,
      message,
      sender: "admin",
      createdAt: new Date().toISOString(),
    }

    chatMessages.push(newMessage)

    return { message: newMessage }
  },
}

// Helper functions
function generateCardNumber(): string {
  const prefix = Math.random() > 0.5 ? "4" : "5" // Visa or Mastercard
  let cardNumber = prefix

  for (let i = 0; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10)
  }

  // Format the card number
  return cardNumber.replace(/(.{4})/g, "$1 ").trim()
}

function generateExpiryDate(): string {
  const currentYear = new Date().getFullYear()
  const month = Math.floor(Math.random() * 12) + 1
  const year = currentYear + Math.floor(Math.random() * 5) + 1

  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`
}
