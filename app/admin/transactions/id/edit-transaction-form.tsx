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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionsAPI, TransactionStatus } from "@/lib/api/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Informer } from "@/components/ui/informer";
import { useSelectedIdsStore } from "@/lib/store/selected-ids";

export function EditTransactionForm() {
  const { selectedTransactionId, setSelectedTransactionId } =
    useSelectedIdsStore();
  const [transaction, setTransaction] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({
    status: TransactionStatus.PENDING,
    amount: "",
    description: "",
  });
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
    if (selectedTransactionId) {
      fetchTransaction();
    }
  }, [selectedTransactionId]);

  const fetchTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await transactionsAPI.getTransactionById(
        selectedTransactionId!
      );

      console.log("the single user transaction",response.data)
      const transactionData = response.data;
      setTransaction(transactionData);

      // Dynamically flatten the entire transaction object
      const flattenedData = flattenObject(transactionData);
      setFormData(flattenedData);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch transaction details. Please try again.",
      });
      router.push("/admin/transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Reconstruct the nested object structure
      const reconstructedData = unflattenObject(formData);

      await transactionsAPI.updateTransaction(selectedTransactionId!, {
        status: reconstructedData.status,
        amount: Number(reconstructedData.amount),
        description: reconstructedData.description || "",
        data: reconstructedData.data || {},
      });

      setNotification({
        type: "success",
        title: "Success",
        message: "Transaction has been updated successfully.",
      });

      setSelectedTransactionId(null);
      router.push("/admin/transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "Failed to update transaction. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    if (!transaction) return null;

    const fields = Object.entries(formData).map(([key, value]) => {
      // Skip certain fields that shouldn't be editable
      if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) {
        return null;
      }

      // Handle different field types
      if (key === "status") {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-base">
              Status
            </Label>
            <Select
              value={value as TransactionStatus}
              onValueChange={(newValue: TransactionStatus) =>
                setFormData({ ...formData, [key]: newValue })
              }
            >
              <SelectTrigger id={key}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TransactionStatus.PENDING}>
                  Pending
                </SelectItem>
                <SelectItem value={TransactionStatus.SUCCESS}>
                  Success
                </SelectItem>
                <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      if (key === "amount") {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-base">
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id={key}
                type="number"
                min="0.01"
                step="0.01"
                className="pl-8"
                value={value as string}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            </div>
          </div>
        );
      }

      if (key === "description") {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-base">
              Description
            </Label>
            <Textarea
              id={key}
              value={value as string}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              rows={3}
            />
          </div>
        );
      }

      // Default text input for other fields
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
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
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
    <div className="max-w-2xl mx-auto">
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
          <CardTitle>Edit Transaction</CardTitle>
          <CardDescription>
            Update transaction details for {transaction?.userId?.firstName}{" "}
            {transaction?.userId?.lastName}
          </CardDescription>
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
