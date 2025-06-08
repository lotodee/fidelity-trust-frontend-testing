"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { authUtils } from "@/lib/store";
import { useAuthStore } from "@/lib/store/auth";
import { Informer } from "@/components/ui/informer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { login, isAuthenticated, error: err } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!email.trim()) {
      setInformerMessage({
        message: "Please enter your email address",
        type: "error",
      });
      return;
    }

    if (!password.trim()) {
      setInformerMessage({
        message: "Please enter your password",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      // First navigate to dashboard
      router.push("/dashboard");

      // Then show success message
      setInformerMessage({
        message: "Login successful, Welcome back to FidelityTrust!",
        type: "success",
      });
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === "ERR_NETWORK") {
        setInformerMessage({
          message:
            "Network error: Unable to connect to the server. Please check your internet connection.",
          type: "error",
        });
      } else if (error.response?.status === 401) {
        setInformerMessage({
          message: "Invalid email or password. Please try again.",
          type: "error",
        });
      } else {
        setInformerMessage({
          message:
            error.response?.data?.error ||
            "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl"></div>
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
          <div className="flex justify-center items-center mb-8 gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-emerald-400">Fidelity</span>
              <span className="text-white/90">Trust</span>
            </span>
          </div>
          <CardTitle className="text-2xl text-center font-semibold">
            Welcome back
          </CardTitle>
          <CardDescription className="text-white/60 text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-white/80">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
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
                  className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors pr-10"
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
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
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
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Security Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-sm">
        <Shield className="h-4 w-4" />
        <span>Bank-Grade Security</span>
      </div>
    </div>
  );
}
