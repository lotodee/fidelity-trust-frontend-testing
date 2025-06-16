"use client";

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
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api/auth";
import { Informer } from "@/components/ui/informer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [email, setEmail] = useState("");
  const [ssnLastFour, setSsnLastFour] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.verifyUser({ email, ssnLastFour });
      if (response.success) {
        setUserId(response.data.userId);
        setStep("reset");
        setInformerMessage({
          message: "User verified successfully. Please set your new password.",
          type: "success",
        });
      }
    } catch (error: any) {
      setInformerMessage({
        message:
          error.response?.data?.message ||
          "Failed to verify user. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setInformerMessage({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 8) {
      setInformerMessage({
        message: "Password must be at least 8 characters long",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        userId,
        newPassword,
      });

      if (response.success) {
        setInformerMessage({
          message: "Password reset successfully. Redirecting to login...",
          type: "success",
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error: any) {
      setInformerMessage({
        message:
          error.response?.data?.message ||
          "Failed to reset password. Please try again.",
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
        href="/auth/login"
        className="absolute top-6 left-6 text-white/80 flex items-center hover:text-white transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Login
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
            {step === "verify" ? "Verify Your Identity" : "Reset Your Password"}
          </CardTitle>
          <CardDescription className="text-white/60 text-center">
            {step === "verify"
              ? "Enter your email and last 4 digits of SSN to verify your identity"
              : "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "verify" ? (
            <form onSubmit={handleVerifyUser} className="space-y-6">
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
                <Label htmlFor="ssn" className="text-white/80">
                  Last 4 Digits of SSN
                </Label>
                <Input
                  id="ssn"
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={ssnLastFour}
                  onChange={(e) =>
                    setSsnLastFour(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Identity"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white/80">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-white/60">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Sign in
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
