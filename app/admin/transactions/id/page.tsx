"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionsAPI, TransactionStatus } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAdminTransactionStore } from "@/lib/store/admin-transactions";

export default function EditTransaction({
  params,
}: {
  params: { id: string };
}) {
  const [transaction, setTransaction] = useState<any>(null);
  const [formData, setFormData] = useState<{
    status: TransactionStatus;
    amount: string;
    description: string;
    type: string;
    subtype: string;
    action: string;
    // Transaction data fields
    bankAddress?: string;
    bankName?: string;
    recipientAccount?: string;
    recipientName?: string;
    routingNumber?: string;
    // User details fields
    accountNumber?: string;
    availableBalance?: string;
    currentBalance?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }>({
    status: TransactionStatus.PENDING,
    amount: "",
    description: "",
    type: "",
    subtype: "",
    action: "",
    bankAddress: "",
    bankName: "",
    recipientAccount: "",
    recipientName: "",
    routingNumber: "",
    accountNumber: "",
    availableBalance: "",
    currentBalance: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { selectedTransaction, setSelectedTransaction } =
    useAdminTransactionStore();

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const fetchTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await transactionsAPI.getTransactionById(params.id);
      const transactionData = response.data;
      setTransaction(transactionData);
      setSelectedTransaction(transactionData);

      // Flatten all fields from the transaction
      const flattenedData = {
        status: transactionData.status,
        amount: transactionData.amount.toString(),
        type: transactionData.type,
        subtype: transactionData.subtype,
        action: transactionData.action,
        // Flatten data fields
        ...(transactionData.data || {}),
        // Flatten user details
        ...(transactionData.userDetails || {}),
        // Flatten userId fields
        ...(transactionData.userId || {}),
      };

      setFormData(flattenedData);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transaction details. Please try again.",
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
      // Reconstruct the data structure exactly as it came
      const reconstructedData = {
        status: formData.status,
        amount: Number(formData.amount),
        description: formData.description || "",
        type: formData.type,
        subtype: formData.subtype,
        action: formData.action,
        data: {
          bankAddress: formData.bankAddress,
          bankName: formData.bankName,
          recipientAccount: formData.recipientAccount,
          recipientName: formData.recipientName,
          routingNumber: formData.routingNumber,
        },
        userDetails: {
          accountNumber: formData.accountNumber,
          availableBalance: Number(formData.availableBalance),
          currentBalance: Number(formData.currentBalance),
        },
        userId: {
          accountNumber: formData.accountNumber,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      };

      await transactionsAPI.updateTransaction(params.id, reconstructedData);

      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully.",
      });

      router.push("/admin/transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transaction. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    if (!transaction) return null;

    const fields = Object.entries(formData).map(([key, value]) => {
      // Skip certain fields that shouldn't be editable
      if (["_id", "__v", "createdAt", "updatedAt", "userId"].includes(key)) {
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
            {key.charAt(0).toUpperCase() + key.slice(1)}
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
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
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
    </AdminLayout>
  );
}
