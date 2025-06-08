"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft, ShieldAlert } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { authUtils } from "@/lib/store";
import { Informer } from "@/components/ui/informer";
import { useAuthStore } from "@/lib/store/auth";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { adminLogin } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the auth API from lib
      const response = await adminLogin(
        username,
        password,
      );

      console.log("the response in login",response?.data)

      // The response has a nested data structure
      if (response?.data?.token && response?.data?.firstName) {
        // Store token in session storage using the utility
        authUtils.storeToken("adminToken", response?.data?.token);
        sessionStorage.setItem("user-role", "admin");
        sessionStorage.setItem(
          "user-name",
          response?.data?.data?.firstName || "Admin"
        );

        setInformerMessage({
          message: "Admin login successful! Redirecting to dashboard...",
          type: "success",
        });

        // Delay the redirect to show the success message
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setInformerMessage({
        message:
          error?.message ||
          "Login failed. Please check your credentials and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      {informerMessage && (
        <Informer
          message={informerMessage.message}
          type={informerMessage.type}
          onClose={() => setInformerMessage(null)}
        />
      )}

      <Link
        href="/"
        className="absolute top-6 left-6 text-white/80 flex items-center hover:text-white transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-semibold">
            Admin Access
          </CardTitle>
          <CardDescription className="text-white/60 text-center">
            Secure access for administrators only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80">
                Username
              </Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-white/80">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
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
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg shadow-red-500/20 transition-all duration-300 hover:shadow-red-500/30 hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-white/60">
            <Link
              href="/auth/login"
              className="text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              Back to User Login
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Security Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-sm">
        <ShieldAlert className="h-4 w-4" />
        <span>Restricted Access Area</span>
      </div>
    </div>
  );
}
