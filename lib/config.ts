// App configuration
export const APP_STATE = process.env.NEXT_PUBLIC_APP_STATE || "real"
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Color configuration
export const COLORS = {
  primary: "hsl(220, 70%, 50%)", // Deep blue
  primaryDark: "hsl(220, 70%, 40%)",
  primaryLight: "hsl(220, 70%, 60%)",
  secondary: "hsl(260, 60%, 50%)", // Purple accent
}
