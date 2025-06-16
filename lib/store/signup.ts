import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface IdentityInfo {
  ssn: string;
  driverLicense: string;
  password: string;
  confirmPassword: string;
}

interface PinInfo {
  pin: string;
  confirmPin: string;
}

interface PasswordStrength {
  score: number;
  message: string;
}

interface SignupState {
  currentStep: number;
  personalInfo: PersonalInfo;
  identityInfo: IdentityInfo;
  pinInfo: PinInfo;
  isLoading: boolean;
  kycStatus: boolean;
  lastUpdated: number | null;
  passwordStrength: PasswordStrength;

  // Actions
  setCurrentStep: (step: number) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setIdentityInfo: (info: Partial<IdentityInfo>) => void;
  setPinInfo: (info: Partial<PinInfo>) => void;
  setLoading: (loading: boolean) => void;
  setKycStatus: (status: boolean) => void;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  clearSignupData: () => void;
  validatePassword: (password: string) => void;
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
};

const initialIdentityInfo: IdentityInfo = {
  ssn: "",
  driverLicense: "",
  password: "",
  confirmPassword: "",
};

const initialPinInfo: PinInfo = {
  pin: "",
  confirmPin: "",
};

const initialPasswordStrength: PasswordStrength = {
  score: 0,
  message: "",
};

// 10 minutes in milliseconds
const SIGNUP_TIMEOUT = 10 * 60 * 1000;

export const useSignupStore = create<SignupState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      personalInfo: initialPersonalInfo,
      identityInfo: initialIdentityInfo,
      pinInfo: initialPinInfo,
      isLoading: false,
      kycStatus: false,
      lastUpdated: Date.now(),
      passwordStrength: initialPasswordStrength,

      setCurrentStep: (step) =>
        set({ currentStep: step, lastUpdated: Date.now() }),

      setPersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
          lastUpdated: Date.now(),
        })),

      setIdentityInfo: (info) =>
        set((state) => {
          const newState = {
            identityInfo: { ...state.identityInfo, ...info },
            lastUpdated: Date.now(),
          };

          // If password is being updated, validate it
          if (info.password) {
            get().validatePassword(info.password);
          }

          return newState;
        }),

      setPinInfo: (info) =>
        set((state) => ({
          pinInfo: { ...state.pinInfo, ...info },
          lastUpdated: Date.now(),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setKycStatus: (status) => set({ kycStatus: status }),

      validatePassword: (password: string) => {
        const minLength = 7;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let score = 0;
        let message = "";

        if (password.length >= minLength) score += 1;
        if (hasUpperCase) score += 1;
        if (hasLowerCase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChar) score += 1;

        if (score === 0) message = "Password is too weak";
        else if (score <= 2) message = "Password is weak";
        else if (score <= 3) message = "Password is moderate";
        else if (score <= 4) message = "Password is strong";
        else message = "Password is very strong";

        set({ passwordStrength: { score, message } });
      },

      resetForm: () =>
        set({
          currentStep: 1,
          personalInfo: initialPersonalInfo,
          identityInfo: initialIdentityInfo,
          pinInfo: initialPinInfo,
          isLoading: false,
          kycStatus: false,
          lastUpdated: Date.now(),
          passwordStrength: initialPasswordStrength,
        }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: currentStep + 1, lastUpdated: Date.now() });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1, lastUpdated: Date.now() });
        }
      },

      clearSignupData: () => {
        set({
          currentStep: 1,
          personalInfo: initialPersonalInfo,
          identityInfo: initialIdentityInfo,
          pinInfo: initialPinInfo,
          isLoading: false,
          kycStatus: false,
          lastUpdated: null,
          passwordStrength: initialPasswordStrength,
        });
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
        lastUpdated: state.lastUpdated,
        passwordStrength: state.passwordStrength,
      }),
    }
  )
);

// Check for timeout on store initialization
const checkTimeout = () => {
  const state = useSignupStore.getState();
  if (state.lastUpdated && Date.now() - state.lastUpdated > SIGNUP_TIMEOUT) {
    state.clearSignupData();
  }
};

// Check timeout every minute
setInterval(checkTimeout, 60 * 1000);

// Initial check
checkTimeout();
