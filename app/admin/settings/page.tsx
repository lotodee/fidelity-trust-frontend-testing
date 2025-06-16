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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { Informer } from "@/components/ui/informer";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [informerMessage, setInformerMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { toast } = useToast();
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await authAPI.getAdminProfile();
        setAdminId(response.data._id);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setInformerMessage({
          message: "Failed to load admin profile. Please try again.",
          type: "error",
        });
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminId) {
      setInformerMessage({
        message: "Admin profile not loaded. Please try again.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setInformerMessage({
        message:
          "Passwords don't match. Please make sure your new passwords match.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.changeAdminPassword(adminId, {
        currentPassword,
        newPassword,
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setInformerMessage({
        message:
          "Password changed successfully! You will be logged out to apply the changes.",
        type: "success",
      });

      // Logout after 2 seconds
      setTimeout(() => {
        logout(true); // true indicates admin logout
        router.push("/auth/entry");
      }, 2000);
    } catch (error: any) {
      console.error("Error changing password:", error);
      setInformerMessage({
        message:
          error.response?.data?.message ||
          "Failed to change password. Please check your current password and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      {informerMessage && (
        <Informer
          message={informerMessage.message}
          type={informerMessage.type}
          onClose={() => setInformerMessage(null)}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">SMS Authentication</div>
                      <div className="text-sm text-gray-500">
                        Receive a code via SMS to verify your identity.
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-gray-500">
                        Use an authenticator app to generate verification codes.
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive admin notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>New User Alerts</div>
                      <div className="text-sm text-gray-500">
                        Receive emails when new users register.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Transaction Alerts</div>
                      <div className="text-sm text-gray-500">
                        Receive emails for large transactions.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Security Alerts</div>
                      <div className="text-sm text-gray-500">
                        Receive emails for security-related events.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">System Notifications</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div>Dashboard Notifications</div>
                      <div className="text-sm text-gray-500">
                        Show notifications in the admin dashboard.
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
