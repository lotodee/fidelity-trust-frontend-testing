"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SplashScreen } from "@/components/splash-screen"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()
  const pathname = usePathname();

  // Check if user is logged in
  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }

    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return showSplash ? <SplashScreen /> : <LandingPage />
}
