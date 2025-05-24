import CryptoJS from "crypto-js"

// Secret key for token encryption - in production, use an environment variable
const ENCRYPTION_KEY = "fidelity-trust-secret-key"

// Helper functions for token encryption/decryption
const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Helper functions for token storage
const storeToken = (key: string, token: string) => {
  if (typeof window !== "undefined") {
    const encryptedToken = encryptToken(token)
    sessionStorage.setItem(key, encryptedToken)
  }
}

const getToken = (key: string): string | null => {
  if (typeof window === "undefined") return null

  const encryptedToken = sessionStorage.getItem(key)
  if (!encryptedToken) return null

  try {
    return decryptToken(encryptedToken)
  } catch (error) {
    console.error("Error decrypting token:", error)
    // If decryption fails, remove the invalid token
    sessionStorage.removeItem(key)
    return null
  }
}

const removeToken = (key: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(key)
  }
}

// Export auth utilities
export const authUtils = {
  storeToken,
  getToken,
  removeToken,
}
