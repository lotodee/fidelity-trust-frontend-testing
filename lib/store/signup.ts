import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface IdentityInfo {
  ssn: string
  driverLicense: string
  password: string
  confirmPassword: string
}

interface PinInfo {
  pin: string
  confirmPin: string
}

interface SignupState {
  currentStep: number
  personalInfo: PersonalInfo
  identityInfo: IdentityInfo
  pinInfo: PinInfo
  isLoading: boolean
  kycStatus: "pending" | "verified" | "failed"

  // Actions
  setCurrentStep: (step: number) => void
  setPersonalInfo: (info: Partial<PersonalInfo>) => void
  setIdentityInfo: (info: Partial<IdentityInfo>) => void
  setPinInfo: (info: Partial<PinInfo>) => void
  setLoading: (loading: boolean) => void
  setKycStatus: (status: "pending" | "verified" | "failed") => void
  resetForm: () => void
  nextStep: () => void
  prevStep: () => void
}

const initialPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
}

const initialIdentityInfo: IdentityInfo = {
  ssn: "",
  driverLicense: "",
  password: "",
  confirmPassword: "",
}

const initialPinInfo: PinInfo = {
  pin: "",
  confirmPin: "",
}

export const useSignupStore = create<SignupState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      personalInfo: initialPersonalInfo,
      identityInfo: initialIdentityInfo,
      pinInfo: initialPinInfo,
      isLoading: false,
      kycStatus: "pending",

      setCurrentStep: (step) => set({ currentStep: step }),

      setPersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),

      setIdentityInfo: (info) =>
        set((state) => ({
          identityInfo: { ...state.identityInfo, ...info },
        })),

      setPinInfo: (info) =>
        set((state) => ({
          pinInfo: { ...state.pinInfo, ...info },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setKycStatus: (status) => set({ kycStatus: status }),

      resetForm: () =>
        set({
          currentStep: 1,
          personalInfo: initialPersonalInfo,
          identityInfo: initialIdentityInfo,
          pinInfo: initialPinInfo,
          isLoading: false,
          kycStatus: "pending",
        }),

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 })
        }
      },
    }),
    {
      name: "signup-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        personalInfo: state.personalInfo,
        identityInfo: state.identityInfo,
        pinInfo: state.pinInfo,
        kycStatus: state.kycStatus,
      }),
    },
  ),
)
