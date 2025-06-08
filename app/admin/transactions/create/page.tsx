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
import {
  transactionsAPI,
  TransactionType,
  TransactionAction,
} from "@/lib/api/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { useAdminTransactionStore } from "@/lib/store/admin-transactions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CreateTransaction() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as TransactionType;
  const {
    selectedUser,
    dynamicFields,
    addDynamicField,
    updateDynamicField,
    removeDynamicField,
    clearDynamicFields,
  } = useAdminTransactionStore();
  const [formData, setFormData] = useState<any>({
    amount: "",
    status: "pending",
  });
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!selectedUser) {
      router.push("/admin/transactions");
    }
    return () => {
      clearDynamicFields();
    };
  }, [selectedUser, router, clearDynamicFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || !formData.amount) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }

    setIsCreating(true);
    try {
      const transactionData = {
        userId: selectedUser._id,
        type,
        subtype: type,
        action:
          type === "credit"
            ? TransactionAction.CREDIT
            : TransactionAction.DEBIT,
        amount: Number.parseFloat(formData.amount),
        status: formData.status,
        data: getTransactionData(),
      };

      await transactionsAPI.createTransaction(transactionData);

      toast({
        title: "Transaction created",
        description: "The transaction has been created successfully.",
      });

      router.push("/admin/transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getTransactionData = () => {
    switch (type) {
      case "fundWallet":
        return {
          bitcoinAddress: formData.bitcoinAddress,
          btcAmount: (Number.parseFloat(formData.amount) / 40000).toFixed(6),
        };
      case "withdraw":
        return {
          bitcoinAddress: formData.bitcoinAddress,
          btcAmount: (Number.parseFloat(formData.amount) / 40000).toFixed(6),
        };
      case "sendMoney":
        return {
          recipientId: formData.recipientId,
          recipientName: formData.recipientName,
          recipientAccount: formData.recipientAccount,
          routingNumber: formData.routingNumber,
          bankName: formData.bankName,
          bankAddress: formData.bankAddress,
        };
      case "credit":
      case "debit":
        return {
          description: formData.description || "",
          ...dynamicFields.reduce((acc, field) => {
            acc[field.key] = field.value;
            return acc;
          }, {} as Record<string, string>),
        };
      default:
        return {};
    }
  };

  const handleAddField = () => {
    if (newField.key && newField.value) {
      addDynamicField(newField.key, newField.value);
      setNewField({ key: "", value: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddField();
    }
  };

  const renderTransactionForm = () => {
    switch (type) {
      case "fundWallet":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bitcoinAddress">Bitcoin Address</Label>
              <Input
                id="bitcoinAddress"
                value={formData.bitcoinAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bitcoinAddress: e.target.value })
                }
                placeholder="Enter Bitcoin address"
                required
              />
            </div>
          </div>
        );
      case "withdraw":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bitcoinAddress">Bitcoin Address</Label>
              <Input
                id="bitcoinAddress"
                value={formData.bitcoinAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bitcoinAddress: e.target.value })
                }
                placeholder="Enter Bitcoin address"
                required
              />
            </div>
          </div>
        );
      case "sendMoney":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="Enter recipient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Account Number</Label>
              <Input
                id="recipientAccount"
                value={formData.recipientAccount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, recipientAccount: e.target.value })
                }
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, routingNumber: e.target.value })
                }
                placeholder="Enter routing number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                placeholder="Enter bank name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAddress">Bank Address</Label>
              <Textarea
                id="bankAddress"
                value={formData.bankAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bankAddress: e.target.value })
                }
                placeholder="Enter bank address"
                rows={3}
              />
            </div>
          </div>
        );
      case "credit":
      case "debit":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="fieldKey">Field Name</Label>
                  <Input
                    id="fieldKey"
                    value={newField.key}
                    onChange={(e) =>
                      setNewField({ ...newField, key: e.target.value })
                    }
                    placeholder="e.g., Bank Name"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="fieldValue">Value</Label>
                  <Input
                    id="fieldValue"
                    value={newField.value}
                    onChange={(e) =>
                      setNewField({ ...newField, value: e.target.value })
                    }
                    placeholder="e.g., Bank of America"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddField}
                  className="mb-[2px]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {dynamicFields.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Transaction Details</h3>
                <div className="space-y-2">
                  {dynamicFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={field.key}
                          onChange={(e) =>
                            updateDynamicField(
                              index,
                              e.target.value,
                              field.value
                            )
                          }
                          placeholder="Field name"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={field.value}
                          onChange={(e) =>
                            updateDynamicField(index, field.key, e.target.value)
                          }
                          placeholder="Value"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDynamicField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Transaction Preview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ${formData.amount || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">
                    {formData.status}
                  </span>
                </div>
                {formData.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">{formData.description}</span>
                  </div>
                )}
                {dynamicFields.map((field, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{field.key}:</span>
                    <span className="font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!selectedUser) {
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
            <CardTitle>Create Transaction</CardTitle>
            <CardDescription>
              Create a new transaction for {selectedUser.firstName}{" "}
              {selectedUser.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="pl-8"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter transaction description"
                  rows={3}
                />
              </div>

              {renderTransactionForm()}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Transaction"
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
