import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios"
import { authUtils } from "@/lib/store"

// Determine if we should use mock data or real API
const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Extend axios config type to include retry count
interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number
}

// Function to perform warm-up request
const performWarmupRequest = async () => {
  try {
    const response = await axios.get(`${API_URL}`)
 
    await new Promise((res) => setTimeout(res, Math.floor(Math.random() * 201) + 200)) // Random delay between 200-400ms
  } catch (error) {
    console.warn("Warm-up request failed:", error)
    // Continue with the main request even if warm-up fails
  }
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests and perform warm-up
api.interceptors.request.use(async (config: RetryConfig) => {
  // Add retry count to config if not present
  if (config.retryCount === undefined) {
    config.retryCount = 0
  }

  // Perform warm-up request before each API call
  // await performWarmupRequest()

  const isAdminRoute = config.url?.includes("/admin") // Check if the URL is an admin route
  const token = isAdminRoute ? authUtils.getToken("adminToken") : authUtils.getToken("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }


  return config
})

// Handle response errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig

    // If we haven't set up retry count, set it to 0
    if (config.retryCount === undefined) {
      config.retryCount = 0
    }

    // If we still have retries left and it's a retryable error
    if (config.retryCount < 3 && isRetryableError(error)) {
      config.retryCount += 1

      // Implement exponential backoff
      const backoffDelay = Math.min(1000 * 2 ** config.retryCount, 10000)
      await new Promise((resolve) => setTimeout(resolve, backoffDelay))

      console.log(`Retrying request (attempt ${config.retryCount}/3)...`)
      return api(config)
    }

    // If it's a 401 error, handle authentication
    if (error.response && error.response.status === 401) {
      // authUtils.removeToken("token")
      // authUtils.removeToken("adminToken")
      // Use window only on client side
      // if (typeof window !== "undefined") {
      //   window.location.href = "/"
      // }
    }

    // If we're out of retries or it's not a retryable error, reject the promise
    return Promise.reject(error)
  },
)

// Helper function to determine if an error is retryable
function isRetryableError(error: AxiosError) {
  // Don't retry if we received a response but it's a client error (4xx)
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return false
  }

  // Retry on network errors, 500s, or if there's no response
  return !error.response || error.response.status >= 500
}

export default api
