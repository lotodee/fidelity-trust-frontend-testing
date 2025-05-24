"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { authAPI } from "@/lib/api"
import { authUtils } from "@/lib/store"
import { useAuthStore } from "@/lib/store/auth"
import { Informer } from "@/components/ui/informer";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
    const [informerMessage, setInformerMessage] = useState<{
      message: string;
      type: "success" | "error" | "info";
    } | null>(null);

   const { login, isAuthenticated, error } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use the auth API from lib
    // await login(email, password )

      // Store token in session storage using the utility
      // authUtils.storeToken("auth-token", token)
      // sessionStorage.setItem("user-role", user.role)
      // sessionStorage.setItem("user-name", user.firstName)

 
           setInformerMessage({
             message: "Login successful, Welcome back to FidelityTrust!",
             type: "success",
           });

      setTimeout(() => {
        router.push("/dashboard")
},3000)

    } catch (error) {
  
           setInformerMessage({
             message:
               "Error logging in. Please check your credentials and try again.",
             type: "error",
           });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-green-500 flex flex-col items-center justify-center p-4">
      {informerMessage && (
        <Informer
          message={informerMessage.message}
          type={informerMessage.type}
          onClose={() => setInformerMessage(null)}
        />
      )}
      <Link
        href="/"
        className="absolute top-4 left-4 text-white flex items-center hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md bg-navy-800 border-white/10 text-white">
        <CardHeader className="space-y-1">
          <div className="flex justify-center items-center mb-6 gap-2">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center"></div>
            <span className="font-bold text-lg">
              <span className="text-green-500">Fidelity</span>
              <span className="text-white">Trust</span>
            </span>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-navy-700 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-navy-900 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-emerald-400 hover:underline"
            >
              Sign up
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500">
            <Link href="/auth/admin-login" className="hover:text-emerald-400">
              Admin Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
