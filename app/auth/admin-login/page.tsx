"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, ArrowLeft, ShieldAlert } from "lucide-react"
import { authAPI } from "@/lib/api"
import { authUtils } from "@/lib/store"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use the auth API from lib
      const { token, admin } = await authAPI.adminLogin({
        email: username,
        password,
      })

      // Store token in session storage using the utility
      authUtils.storeToken("auth-token", token)
      authUtils.storeToken("adminToken", token)
      sessionStorage.setItem("user-role", "admin")
      sessionStorage.setItem("user-name", admin.firstName || "Admin")

      toast({
        title: "Admin login successful",
        description: "Welcome to the admin dashboard!",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-950 flex flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 text-white flex items-center hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md bg-navy-800 border-white/10 text-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-gray-400 text-center">Secure access for administrators only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-navy-700 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-navy-700 border-white/10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-gray-400">
            <Link href="/auth/login" className="text-emerald-400 hover:underline">
              Back to User Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
