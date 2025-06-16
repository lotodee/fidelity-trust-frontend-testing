"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { usersAPI } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Informer } from "@/components/ui/informer";
import { useSelectedIdsStore } from "@/lib/store/selected-ids";

export function EditUserForm() {
  const { selectedUserId, setSelectedUserId } = useSelectedIdsStore();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning" | "security";
    title: string;
    message: string;
  } | null>(null);
  const router = useRouter();

  const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(acc, flattenObject(obj[key], prefixedKey));
      } else {
        acc[prefixedKey] = obj[key];
      }

      return acc;
    }, {});
  };

  const unflattenObject = (obj: Record<string, any>): any => {
    const result: any = {};

    for (const key in obj) {
      const keys = key.split(".");
      let current = result;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          current[k] = obj[key];
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      }
    }

    return result;
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchUser();
    }
  }, [selectedUserId]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      console.log("[EditUserForm] Fetching user with ID:", selectedUserId);
      const response = await usersAPI.getUserById(selectedUserId!);
      const userData = response?.data;
      console.log("[EditUserForm] Received user data:", userData);
      setUser(userData);

      // Dynamically flatten the entire user object
      const flattenedData = flattenObject(userData);
      console.log("[EditUserForm] Flattened user data:", flattenedData);
      setFormData(flattenedData);
    } catch (error) {
      console.error("[EditUserForm] Error fetching user:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch user details. Please try again.",
      });
      router.push("/admin/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[EditUserForm] Form submission started");
    console.log("[EditUserForm] Current form data:", formData);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      console.log("[EditUserForm] Validation failed - missing required fields");
      setNotification({
        type: "error",
        title: "Missing information",
        message: "Please fill all required fields.",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Reconstruct the nested object structure
      const reconstructedData = unflattenObject(formData);
      console.log(
        "[EditUserForm] Reconstructed data for update:",
        reconstructedData
      );

      console.log(
        "[EditUserForm] Sending update request for user:",
        selectedUserId
      );
      const response = await usersAPI.updateUser(
        selectedUserId!,
        reconstructedData
      );
      console.log("[EditUserForm] Update response:", response);

      setNotification({
        type: "success",
        title: "Success",
        message: "User information has been updated successfully.",
      });

      setSelectedUserId(null);
      router.push("/admin/users");
    } catch (error) {
      console.error("[EditUserForm] Error updating user:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to update user. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    if (!user) return null;

    console.log("[EditUserForm] Rendering form fields for user:", user);

    const fields = Object.entries(formData).map(([key, value]) => {
      // Skip certain fields that shouldn't be editable
      if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
        console.log("[EditUserForm] Skipping non-editable field:", key);
        return null;
      }

      // Handle different field types
      if (key === "role") {
        console.log("[EditUserForm] Rendering role field with value:", value);
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-base">
              Role
            </Label>
            <Select
              value={value as string}
              onValueChange={(newValue) => {
                console.log(
                  "[EditUserForm] Role changed from",
                  value,
                  "to",
                  newValue
                );
                setFormData({ ...formData, [key]: newValue });
              }}
            >
              <SelectTrigger id={key}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (key === "currentBalance" || key === "availableBalance") {
        console.log(
          "[EditUserForm] Rendering balance field:",
          key,
          "with value:",
          value
        );
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-base">
              {key
                .split(".")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id={key}
                type="number"
                min="0"
                step="0.01"
                className="pl-8"
                value={value as string}
                onChange={(e) => {
                  console.log(
                    "[EditUserForm] Balance changed from",
                    value,
                    "to",
                    e.target.value
                  );
                  setFormData({ ...formData, [key]: e.target.value });
                }}
              />
            </div>
          </div>
        );
      }

      if (key.includes("isEmailVerified") || key.includes("kycVerified")) {
        console.log(
          "[EditUserForm] Rendering verification field:",
          key,
          "with value:",
          value
        );
        return (
          <div key={key} className="flex items-center space-x-2">
            <Switch
              id={key}
              checked={value as boolean}
              onCheckedChange={(checked) => {
                console.log(
                  "[EditUserForm] Verification status changed from",
                  value,
                  "to",
                  checked
                );
                setFormData({ ...formData, [key]: checked });
              }}
            />
            <Label htmlFor={key} className="text-base">
              {key
                .split(".")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Label>
          </div>
        );
      }

      // Default text input for other fields
      console.log(
        "[EditUserForm] Rendering text field:",
        key,
        "with value:",
        value
      );
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-base">
            {key
              .split(".")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Label>
          <Input
            id={key}
            value={value as string}
            onChange={(e) => {
              console.log(
                "[EditUserForm] Field changed from",
                value,
                "to",
                e.target.value
              );
              setFormData({ ...formData, [key]: e.target.value });
            }}
          />
        </div>
      );
    });

    return fields;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {notification && (
        <Informer
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormFields()}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
