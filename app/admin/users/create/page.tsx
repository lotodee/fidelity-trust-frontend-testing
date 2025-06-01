"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  Shield,
  CreditCard,
  Lock,
  Mail,
  User,
  Key,
} from "lucide-react";
import { Informer } from "@/components/ui/informer";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    pin: "",
    confirmPin: "",
    role: "customer",
    balance: "0",
    availableBalance: "0",
    currentBalance: "0",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "pin",
      "confirmPin",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      setInformerMessage({
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    // Validate PIN
    if (formData.pin !== formData.confirmPin) {
      setInformerMessage({
        message: "PINs do not match",
        type: "error",
      });
      return;
    }

    if (formData.pin.length !== 4 || !/^\d+$/.test(formData.pin)) {
      setInformerMessage({
        message: "PIN must be 4 digits",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        pin: formData.pin,
        role: formData.role,
        ...(formData.role === "user" && {
          balance: Number.parseFloat(formData.balance),
          availableBalance: Number.parseFloat(formData.availableBalance),
          currentBalance: Number.parseFloat(formData.currentBalance),
        }),
      };

      await usersAPI.createUser(userData);

      setInformerMessage({
        message: "User created successfully! Redirecting...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      setInformerMessage({
        message: "Failed to create user. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {informerMessage && (
          <Informer
            message={informerMessage.message}
            type={informerMessage.type}
            onClose={() => setInformerMessage(null)}
          />
        )}

        <Button
          variant="ghost"
          className="mb-8 hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-800 text-slate-100 shadow-2xl">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-semibold tracking-tight text-white">
                  Create New User
                </CardTitle>
                <CardDescription className="text-slate-400 text-base mt-1">
                  Add a new user to the system with their details and
                  permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-200 border-b border-slate-800 pb-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-lg">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-slate-300 flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-blue-400" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                      className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-slate-300 flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-blue-400" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                      className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-300 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-blue-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-200 border-b border-slate-800 pb-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-lg">Security Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-slate-300 flex items-center gap-2"
                    >
                      <Key className="h-4 w-4 text-blue-400" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                      className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="pin"
                        className="text-slate-300 flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-blue-400" />
                        4-Digit PIN
                      </Label>
                      <Input
                        id="pin"
                        type="password"
                        maxLength={4}
                        value={formData.pin}
                        onChange={(e) =>
                          handleInputChange(
                            "pin",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        required
                        className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-center text-2xl tracking-widest text-white placeholder:text-slate-500"
                        placeholder="••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPin"
                        className="text-slate-300 flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-blue-400" />
                        Confirm PIN
                      </Label>
                      <Input
                        id="confirmPin"
                        type="password"
                        maxLength={4}
                        value={formData.confirmPin}
                        onChange={(e) =>
                          handleInputChange(
                            "confirmPin",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        required
                        className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-center text-2xl tracking-widest text-white placeholder:text-slate-500"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role and Balance Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-200 border-b border-slate-800 pb-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-lg">Role & Balance</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-slate-300 flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4 text-blue-400" />
                      User Role
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger
                        id="role"
                        className="h-11 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white"
                      >
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem
                          value="customer"
                          className="text-white hover:bg-slate-800"
                        >
                          Customer
                        </SelectItem>
                        <SelectItem
                          value="admin"
                          className="text-white hover:bg-slate-800"
                        >
                          Administrator
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role === "customer" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="balance"
                          className="text-slate-300 flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4 text-blue-400" />
                          Initial Balance
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            $
                          </span>
                          <Input
                            id="balance"
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-11 pl-8 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                            value={formData.balance}
                            onChange={(e) =>
                              handleInputChange("balance", e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="availableBalance"
                          className="text-slate-300 flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4 text-blue-400" />
                          Available Balance
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            $
                          </span>
                          <Input
                            id="availableBalance"
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-11 pl-8 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                            value={formData.availableBalance}
                            onChange={(e) =>
                              handleInputChange(
                                "availableBalance",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="currentBalance"
                          className="text-slate-300 flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4 text-blue-400" />
                          Current Balance
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            $
                          </span>
                          <Input
                            id="currentBalance"
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-11 pl-8 bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/20 transition-colors text-base text-white placeholder:text-slate-500"
                            value={formData.currentBalance}
                            onChange={(e) =>
                              handleInputChange(
                                "currentBalance",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30 hover:-translate-y-0.5 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating User...
                    </div>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
