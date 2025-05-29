"use client";

import type React from "react";
import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
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
} from "lucide-react";

export default function Profile() {
  // Profile State
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");

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

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Handle Profile Update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Profile Update:", {
      fullName,
      email,
      phone,
    });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1500);
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Password Change:", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    }, 1500);
  };

  // Handle Notification Settings
  const handleNotificationChange = (
    type: "email" | "push",
    setting: string
  ) => {
    if (type === "email") {
      setEmailNotifications((prev) => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev],
      }));
      console.log("Email Notification Settings:", {
        ...emailNotifications,
        [setting]:
          !emailNotifications[setting as keyof typeof emailNotifications],
      });
    } else {
      setPushNotifications((prev) => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev],
      }));
      console.log("Push Notification Settings:", {
        ...pushNotifications,
        [setting]:
          !pushNotifications[setting as keyof typeof pushNotifications],
      });
    }
  };

  // Handle 2FA Settings
  const handleTwoFactorChange = (method: "sms" | "authenticator") => {
    setTwoFactorAuth((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
    console.log("2FA Settings:", {
      ...twoFactorAuth,
      [method]: !twoFactorAuth[method],
    });
  };

  // Handle Support Actions
  const handleSupportAction = (action: string) => {
    console.log("Support Action:", action);
    toast({
      title: "Support Request",
      description: `Your ${action} request has been initiated.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-navy-800 to-navy-950 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20">
                      <User className="h-8 w-8 text-white/80" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{fullName}</h3>
                      <p className="text-white/70">{email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-white/70" />
                      <span className="text-white/70">{email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-white/70" />
                      <span className="text-white/70">{phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="max-h-max">
                <CardContent className="p-6">
                  <Tabs
                    defaultValue="profile"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-1 gap-2  p-2">
                      <TabsTrigger
                        value="profile"
                        className="justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className="justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger
                        value="notifications"
                        className="justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger
                        value="support"
                        className="justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Support
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
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
                              htmlFor="fullName"
                              className="text-sm font-medium"
                            >
                              Full Name
                            </Label>
                            <Input
                              id="fullName"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
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
                            />
                          </div>
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
                            disabled={isLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 h-10"
                          >
                            {isLoading ? "Updating..." : "Update Password"}
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
                          console.log("Notification Settings Saved:", {
                            email: emailNotifications,
                            push: pushNotifications,
                          });
                          toast({
                            title: "Settings Saved",
                            description:
                              "Your notification preferences have been updated.",
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
                              <div className="font-medium">
                                support@FidelityTrust.com
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium">
                                +1 (800) 123-4567
                              </div>
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
