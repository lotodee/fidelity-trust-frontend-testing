import { create } from "zustand"

export type TransferType = "zelle" | "wire-transfer" | "billpay" | "mailcheck" | "member"

interface TransferFormData {
  recipientId?: string | undefined
  type: TransferType
  amount: string
  description: string
  // Zelle
  zelleEmail?: string
  zellePhone?: string
  // Wire Transfer
  recipientName?: string
  recipientAccount?: string
  routingNumber?: string
  bankName?: string
  bankAddress?: string
  // Bill Pay
  payeeName?: string
  accountNumber?: string
  // Mail Check
  recipientAddress?: string
  // Member to Member
  memberId?: string
  memberAccountNumber?: string
}

interface TransferState {
  isModalOpen: boolean
  selectedType: TransferType | null
  formData: TransferFormData
  isLoading: boolean
  searchResults: any[]

  // Actions
  openModal: (type: TransferType) => void
  closeModal: () => void
  setFormData: (data: Partial<TransferFormData>) => void
  setLoading: (loading: boolean) => void
  setSearchResults: (results: any[]) => void
  resetForm: () => void
}

const initialFormData: TransferFormData = {
  type: "wire-transfer",
  amount: "",
  description: "",
}

export const useTransferStore = create<TransferState>((set) => ({
  isModalOpen: false,
  selectedType: null,
  formData: initialFormData,
  isLoading: false,
  searchResults: [],

  openModal: (type) =>
    set({
      isModalOpen: true,
      selectedType: type,
      formData: { ...initialFormData, type },
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedType: null,
      formData: initialFormData,
    }),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setSearchResults: (results) => set({ searchResults: results }),

  resetForm: () => set({ formData: initialFormData }),
}))
