import api from "./axios"
import { mockData } from "@/lib/mock-data"

const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real"

export interface Card {
  _id: string
  userId: string
  cardNumber: string
  cardType: string
  expiryDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCardData {
  userId: string
  cardType: string
}

export interface UpdateCardData {
  isActive?: boolean
}

export const cardsAPI = {
  getUserCards: async () => {
    if (APP_STATE === "mock") {
      return mockData.getUserCards()
    }

    const response = await api.get("/cards")
    return response.data
  },

  getAllCards: async () => {
    if (APP_STATE === "mock") {
      return mockData.getAllCards()
    }

    const response = await api.get("/admin/cards")
    return response.data
  },

  getCardById: async (cardId: string) => {
    if (APP_STATE === "mock") {
      return mockData.getCardById(cardId)
    }

    const response = await api.get(`/cards/${cardId}`)
    return response.data
  },

  createCard: async (cardData: CreateCardData) => {
    if (APP_STATE === "mock") {
      return mockData.createCard(cardData)
    }

    const response = await api.post("/admin/cards", cardData)
    return response.data
  },

  updateCard: async (cardId: string, cardData: UpdateCardData) => {
    if (APP_STATE === "mock") {
      return mockData.updateCard(cardId, cardData)
    }

    const response = await api.put(`/admin/cards/${cardId}`, cardData)
    return response.data
  },

  deleteCard: async (cardId: string) => {
    if (APP_STATE === "mock") {
      return mockData.deleteCard(cardId)
    }

    const response = await api.delete(`/admin/cards/${cardId}`)
    return response.data
  },

  requestCard: async (cardType: string) => {
    if (APP_STATE === "mock") {
      return mockData.requestCard(cardType)
    }

    const response = await api.post("/cards/request", { cardType })
    return response.data
  },

  activateCard: async (cardId: string) => {
    if (APP_STATE === "mock") {
      return mockData.activateCard(cardId)
    }

    const response = await api.put(`/cards/${cardId}/activate`)
    return response.data
  },

  deactivateCard: async (cardId: string) => {
    if (APP_STATE === "mock") {
      return mockData.deactivateCard(cardId)
    }

    const response = await api.put(`/cards/${cardId}/deactivate`)
    return response.data
  },
}
