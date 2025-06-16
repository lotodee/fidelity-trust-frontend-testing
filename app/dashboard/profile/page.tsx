"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Informer } from "@/components/ui/informer";
import {
  Bell,
  Shield,
  User,
  Lock,
  HelpCircle,
  Mail,
  Phone,
  Key,
  MessageSquare,
  Wallet,
  Copy,
} from "lucide-react";
import { usersAPI } from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/auth";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance: number;
  availableBalance: number;
  currentBalance: number;
  accountNumber: string;
  isEmailVerified: boolean;
  kycVerified: boolean;
  balanceVisibility: {
    available: boolean;
    current: boolean;
  };
  personalInfo?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    ssn?: string;
    driverLicense?: string;
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  // Profile State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user, updateUserBalances } = useAuthStore();
  const [informer, setInformer] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
  } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await usersAPI.getCurrentUser();
      if (res.success && res.data) {
        const userData: UserData = res.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setAccountNumber(userData.accountNumber);

        setPhone(userData.personalInfo?.phone || "");
        setAddress(userData.personalInfo?.address || "");
        setCity(userData.personalInfo?.city || "");
        setState(userData.personalInfo?.state || "");
        setZipCode(userData.personalInfo?.zipCode || "");
      }
    } catch (error) {
      setInformer({
        title: "Error",
        message: "Failed to fetch user data. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    updateUserBalances();
  }, []);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState({
    transactions: true,
    security: true,
    marketing: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    transactions: true,
    security: true,
  });

  // 2FA State
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    sms: false,
    authenticator: false,
  });

  // PIN State
  const [oldPin, setOldPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // UI State
  // const [activeTab, setActiveTab] = useState("profile");

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await usersAPI.updateUserInfo({
        firstName,
        lastName,
        email,
      });
      await updateUserBalances();

      setInformer({
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        type: "success",
      });
    } catch (error) {
      setInformer({
        title: "Update Failed",
        message: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setInformer({
        title: "Password Mismatch",
        message: "New password and confirm password do not match.",
        type: "error",
      });
      return;
    }

    setIsPasswordLoading(true);

    try {
      await usersAPI.changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setInformer({
        title: "Password Updated",
        message: "Your password has been changed successfully.",
        type: "success",
      });
    } catch (error) {
      setInformer({
        title: "Update Failed",
        message: "Failed to change password. Please try again.",
        type: "error",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle Notification Settings
  const handleNotificationChange = (
    type: "email" | "push",
    setting: string
  ) => {
    setInformer({
      title: "Admin Contact Required",
      message:
        "An admin will contact you with the necessary steps to update your notification preferences.",
      type: "info",
    });
  };

  // Handle 2FA Settings
  const handleTwoFactorChange = (method: "sms" | "authenticator") => {
    setInformer({
      title: "Admin Contact Required",
      message:
        "An admin will contact you with the necessary steps to set up two-factor authentication.",
      type: "info",
    });
  };

  // Handle Support Actions
  const handleSupportAction = (action: string) => {
    setInformer({
      title: "Admin Contact Required",
      message: "An admin will contact you shortly to assist with your request.",
      type: "info",
    });
  };

  // Handle PIN input
  const handlePinInput = (
    index: number,
    value: string,
    type: "old" | "new" | "confirm"
  ) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    switch (type) {
      case "old":
        const newOldPin = [...oldPin];
        newOldPin[index] = value;
        setOldPin(newOldPin);
        if (value && index < 3) {
          const nextInput = document.getElementById(`old-pin-${index + 1}`);
          nextInput?.focus();
        }
        break;
      case "new":
        const newPinArray = [...newPin];
        newPinArray[index] = value;
        setNewPin(newPinArray);
        if (value && index < 3) {
          const nextInput = document.getElementById(`new-pin-${index + 1}`);
          nextInput?.focus();
        }
        break;
      case "confirm":
        const newConfirmPin = [...confirmPin];
        newConfirmPin[index] = value;
        setConfirmPin(newConfirmPin);
        if (value && index < 3) {
          const nextInput = document.getElementById(`confirm-pin-${index + 1}`);
          nextInput?.focus();
        }
        break;
    }
  };

  // Handle PIN keydown
  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "old" | "new" | "confirm"
  ) => {
    let currentPin: string[];
    switch (type) {
      case "old":
        currentPin = oldPin;
        break;
      case "new":
        currentPin = newPin;
        break;
      case "confirm":
        currentPin = confirmPin;
        break;
    }

    if (e.key === "Backspace" && !currentPin[index]) {
      if (index > 0) {
        const prevInput = document.getElementById(`${type}-pin-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  // Handle PIN change submission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      oldPin.join("").length !== 4 ||
      newPin.join("").length !== 4 ||
      confirmPin.join("").length !== 4
    ) {
      setInformer({
        title: "Invalid PIN",
        message: "Please enter complete 4-digit PINs for all fields.",
        type: "error",
      });
      return;
    }

    if (newPin.join("") !== confirmPin.join("")) {
      setInformer({
        title: "PIN Mismatch",
        message: "New PIN and confirm PIN do not match.",
        type: "error",
      });
      return;
    }

    setIsPinLoading(true);

    try {
      await usersAPI.changePin({
        currentPin: oldPin.join(""),
        newPin: newPin.join(""),
      });

      setOldPin(["", "", "", ""]);
      setNewPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);

      setInformer({
        title: "PIN Updated",
        message: "Your PIN has been changed successfully.",
        type: "success",
      });
    } catch (error) {
      setInformer({
        title: "Update Failed",
        message: "Failed to change PIN. Please try again.",
        type: "error",
      });
    } finally {
      setIsPinLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <DashboardLayout>
      {informer && (
        <Informer
          message={informer.message}
          type={informer.type}
          title={informer.title}
          onClose={() => setInformer(null)}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Manage your account preferences and settings
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-2 sm:p-4">
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 p-1 bg-gray-100/50 rounded-lg">
                  <TabsTrigger
                    value="profile"
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm rounded-md transition-colors"
                  >
                    <User className="h-4 w-4 mr-2 sm:mr-2.5 inline-block" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm rounded-md transition-colors"
                  >
                    <Lock className="h-4 w-4 mr-2 sm:mr-2.5 inline-block" />
                    <span className="hidden sm:inline">Security</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm rounded-md transition-colors"
                  >
                    <Bell className="h-4 w-4 mr-2 sm:mr-2.5 inline-block" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="support"
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-navy-900 data-[state=active]:shadow-sm rounded-md transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 mr-2 sm:mr-2.5 inline-block" />
                    <span className="hidden sm:inline">Support</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        {firstName} {lastName}
                      </h3>
                      <p className="text-sm text-white/70">{email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-xs sm:text-sm">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-white/70" />
                      <span className="text-white/70 truncate">{email}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-white/70" />
                      <span className="text-white/70 truncate">{phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm bg-white/10 p-2 rounded">
                      <div className="flex items-center">
                        <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-white/70" />
                        <span className="text-white/70">Account Number:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white/90">
                          {accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(accountNumber)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                        </button>
                      </div>
                    </div>
                    {copySuccess && (
                      <div className="text-xs text-emerald-400 text-center">
                        Account number copied!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsContent value="profile">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="border-b pb-6">
                      <CardTitle className="text-xl">
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form
                        onSubmit={handleUpdateProfile}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-sm font-medium"
                            >
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-sm font-medium"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="phone"
                              className="text-sm font-medium"
                            >
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="h-10"
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="address"
                              className="text-sm font-medium"
                            >
                              Address
                            </Label>
                            <Input
                              id="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="h-10"
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="text-sm font-medium"
                            >
                              City
                            </Label>
                            <Input
                              id="city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="h-10"
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="state"
                              className="text-sm font-medium"
                            >
                              State
                            </Label>
                            <Input
                              id="state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="h-10"
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="zipCode"
                              className="text-sm font-medium"
                            >
                              ZIP Code
                            </Label>
                            <Input
                              id="zipCode"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              className="h-10"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Note: To update your contact information, please
                          contact our support team.
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-emerald-500 hover:bg-emerald-600 h-10"
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <div className="space-y-6">
                    <Card className="border-none shadow-lg">
                      <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">
                          Change Password
                        </CardTitle>
                        <CardDescription>
                          Update your password to keep your account secure.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form
                          onSubmit={handleChangePassword}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="currentPassword"
                              className="text-sm font-medium"
                            >
                              Current Password
                            </Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              required
                              className="h-10"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="newPassword"
                                className="text-sm font-medium"
                              >
                                New Password
                              </Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="h-10"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium"
                              >
                                Confirm New Password
                              </Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                required
                                className="h-10"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 h-10"
                          >
                            {isPasswordLoading
                              ? "Updating..."
                              : "Update Password"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                      <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">Change PIN</CardTitle>
                        <CardDescription>
                          Update your 4-digit PIN for secure transactions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form onSubmit={handlePinSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-sm font-medium">
                              Current PIN
                            </Label>
                            <div className="flex gap-2">
                              {oldPin.map((digit, index) => (
                                <Input
                                  key={index}
                                  id={`old-pin-${index}`}
                                  type="password"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) =>
                                    handlePinInput(index, e.target.value, "old")
                                  }
                                  onKeyDown={(e) =>
                                    handlePinKeyDown(index, e, "old")
                                  }
                                  className="h-12 w-12 text-center text-lg font-semibold"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-medium">
                              New PIN
                            </Label>
                            <div className="flex gap-2">
                              {newPin.map((digit, index) => (
                                <Input
                                  key={index}
                                  id={`new-pin-${index}`}
                                  type="password"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) =>
                                    handlePinInput(index, e.target.value, "new")
                                  }
                                  onKeyDown={(e) =>
                                    handlePinKeyDown(index, e, "new")
                                  }
                                  className="h-12 w-12 text-center text-lg font-semibold"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-sm font-medium">
                              Confirm New PIN
                            </Label>
                            <div className="flex gap-2">
                              {confirmPin.map((digit, index) => (
                                <Input
                                  key={index}
                                  id={`confirm-pin-${index}`}
                                  type="password"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) =>
                                    handlePinInput(
                                      index,
                                      e.target.value,
                                      "confirm"
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    handlePinKeyDown(index, e, "confirm")
                                  }
                                  className="h-12 w-12 text-center text-lg font-semibold"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              ))}
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={isPinLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 h-10"
                          >
                            {isPinLoading ? "Updating..." : "Update PIN"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                      <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">
                          Two-Factor Authentication
                        </CardTitle>
                        <CardDescription>
                          Add an extra layer of security to your account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                SMS Authentication
                              </div>
                              <div className="text-sm text-gray-500">
                                Receive a code via SMS to verify your identity.
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={twoFactorAuth.sms}
                            onCheckedChange={() => handleTwoFactorChange("sms")}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Key className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                Authenticator App
                              </div>
                              <div className="text-sm text-gray-500">
                                Use an authenticator app to generate
                                verification codes.
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={twoFactorAuth.authenticator}
                            onCheckedChange={() =>
                              handleTwoFactorChange("authenticator")
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="border-b pb-6">
                      <CardTitle className="text-xl">
                        Notification Settings
                      </CardTitle>
                      <CardDescription>
                        Manage how you receive notifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email Notifications</h3>
                            <p className="text-sm text-gray-500">
                              Manage your email preferences
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 pl-14">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">
                                Transaction Alerts
                              </div>
                              <div className="text-sm text-gray-500">
                                Receive emails for all transactions.
                              </div>
                            </div>
                            <Switch
                              checked={emailNotifications.transactions}
                              onCheckedChange={() =>
                                handleNotificationChange(
                                  "email",
                                  "transactions"
                                )
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">Security Alerts</div>
                              <div className="text-sm text-gray-500">
                                Receive emails for security-related events.
                              </div>
                            </div>
                            <Switch
                              checked={emailNotifications.security}
                              onCheckedChange={() =>
                                handleNotificationChange("email", "security")
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">
                                Marketing Updates
                              </div>
                              <div className="text-sm text-gray-500">
                                Receive emails about new features and offers.
                              </div>
                            </div>
                            <Switch
                              checked={emailNotifications.marketing}
                              onCheckedChange={() =>
                                handleNotificationChange("email", "marketing")
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Push Notifications</h3>
                            <p className="text-sm text-gray-500">
                              Manage your push notification preferences
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 pl-14">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">
                                Transaction Alerts
                              </div>
                              <div className="text-sm text-gray-500">
                                Receive push notifications for all transactions.
                              </div>
                            </div>
                            <Switch
                              checked={pushNotifications.transactions}
                              onCheckedChange={() =>
                                handleNotificationChange("push", "transactions")
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">Security Alerts</div>
                              <div className="text-sm text-gray-500">
                                Receive push notifications for security-related
                                events.
                              </div>
                            </div>
                            <Switch
                              checked={pushNotifications.security}
                              onCheckedChange={() =>
                                handleNotificationChange("push", "security")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                      <Button
                        className="bg-emerald-500 hover:bg-emerald-600 h-10"
                        onClick={() => {
                          setInformer({
                            title: "Settings Saved",
                            message:
                              "Your notification preferences have been updated.",
                            type: "success",
                          });
                        }}
                      >
                        Save Preferences
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="support">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <MessageSquare className="h-12 w-12 text-white/80 mb-4" />
                          <h3 className="font-medium text-lg mb-2">
                            Live Chat
                          </h3>
                          <p className="text-white/70 mb-6">
                            Chat with our support team in real-time for
                            immediate assistance.
                          </p>
                          <a href="/dashboard/chat" className="w-full">
                            <Button className="w-full bg-white text-emerald-600 hover:bg-white/90 h-10">
                              Start Chat
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <Shield className="h-12 w-12 text-white/80 mb-4" />
                          <h3 className="font-medium text-lg mb-2">
                            Help Center
                          </h3>
                          <p className="text-white/70 mb-6">
                            Browse our knowledge base for answers to common
                            questions.
                          </p>
                          <a href="/dashboard/help" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full border-white/20 text-white hover:bg-white/10 h-10"
                            >
                              Visit Help Center
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-none shadow-lg">
                      <CardHeader className="border-b pb-6">
                        <CardTitle className="text-xl">
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Mail className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Email</div>
                              <a
                                href="mailto:Mail@fidelitytrust.org"
                                className="font-medium hover:text-emerald-600 transition-colors"
                              >
                                Mail@fidelitytrust.org
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Bell className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Hours</div>
                              <div className="font-medium">24/7 Support</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
