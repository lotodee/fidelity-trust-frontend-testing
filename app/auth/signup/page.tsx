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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authAPI } from "@/lib/api";
import { authUtils } from "@/lib/store";
import { useAuthStore } from "@/lib/store/auth";
import { Informer } from "@/components/ui/informer";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const router = useRouter();

   const { register, isAuthenticated, error } = useAuthStore();

  //  useEffect(() => {
    
  //    if (isAuthenticated) {
  //      router.push("/dashboard");
  //    }
  //  }, [isAuthenticated, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setInformerMessage({
        message:
          "Passwords don't match. Please make sure your passwords match.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Split full name into first and last name
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      // Use the auth API from lib
      // const response = await register(firstName, lastName, email, password);

      // console.log("the register response is", response);

      setInformerMessage({
        message: "Account created successfully! Welcome to FidelityTrust!",
        type: "success",
      });

      // Wait for the success message to be shown before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      setInformerMessage({
        message: "Signup failed. Please check your information and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-navy-700 border-white/10"
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-navy-700 border-white/10"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-navy-900 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-400 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
