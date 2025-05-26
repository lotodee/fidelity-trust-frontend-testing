"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { LandingPage } from "@/components/landing-page"
import InstallPrompt from "@/components/install-prompt"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const token = sessionStorage.getItem("auth-token")
    if (token) {
      router.push("/dashboard")
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return showSplash ? <SplashScreen /> :
  <>
      <InstallPrompt />
      <LandingPage />
    </>
  
}
