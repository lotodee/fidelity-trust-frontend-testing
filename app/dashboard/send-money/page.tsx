"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTransferStore } from "@/lib/store/transfer";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Search,
  User,
  Building,
  Mail,
  CreditCard,
  LucideIcon,
  CheckCircle,
  History,
} from "lucide-react";
import {
  transactionsAPI,
  TransactionType,
  TransactionStatus,
} from "@/lib/api/transactions";
import { Informer } from "@/components/ui/informer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { usersAPI } from "@/lib/api/users";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface TransferFormData {
  recipientName?: string;
  recipientAccount?: string;
  memberId?: string;
  memberAccountNumber?: string;
  amount: string;
  description?: string;
  recipientId?: string;
  routingNumber?: string;
  bankName?: string;
  bankAddress?: string;
}

type TransferType =
  | "zelle"
  | "wire-transfer"
  | "billpay"
  | "mailcheck"
  | "member";

interface TransferOption {
  id: TransferType;
  name: string;
  description: string;
  icon: string | LucideIcon;
  disabled: boolean;
  comingSoon?: boolean;
}

const transferOptions: TransferOption[] = [
  {
    id: "zelle",
    name: "Zelle",
    description: "Send money instantly with email or phone",
    icon: "/placeholder.svg?height=40&width=40",
    disabled: true,
    comingSoon: true,
  },
  {
    id: "wire-transfer",
    name: "Wire-transfer Transfer",
    description: "Secure bank-to-bank transfers",
    icon: Building,
    disabled: false,
  },
  {
    id: "billpay",
    name: "Bill Pay",
    description: "Pay bills and utilities",
    icon: CreditCard,
    disabled: true,
    comingSoon: true,
  },
  {
    id: "mailcheck",
    name: "Mail Check",
    description: "Send physical checks by mail",
    icon: Mail,
    disabled: false,
  },
  {
    id: "member",
    name: "Member to Member",
    description: "Transfer to other FidelityTrust members",
    icon: User,
    disabled: false,
  },
];

interface PendingTransaction {
  id: string;
  recipient: string;
  type: string;
  amount: string;
  date: string;
  status: string;
}

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
}

export default function SendMoney() {
  const { toast } = useToast();
  const { user, updateUserBalances } = useAuthStore();
  const {
    isModalOpen,
    selectedType,
    formData,
    isLoading,
    openModal,
    closeModal,
    setFormData,
    setLoading,
  } = useTransferStore();

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPinVerified, setShowPinVerified] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([]);
  const [informer, setInformer] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    title?: string;
  } | null>(null);

  const fetchMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const res = await usersAPI.getAllMembersAccount();
      console.log(res.data);
      if (res.data) {
        setMembers(res.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setInformer({
        title: "Error",
        message: "Failed to fetch members. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    console.log("this is the current transac", currentTransaction);
  }, [currentTransaction]);

  useEffect(() => {
    console.log("this is the selectedtype", selectedType);
  }, [selectedType]);
  const handleTransferClick = (type: string) => {
    const option = transferOptions.find((opt) => opt.id === type);
    if (option?.disabled) {
      setInformer({
        title: "Coming Soon",
        message: `${option.name} will be available soon!`,
        type: "info",
      });
      return;
    }
    openModal(type as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPinDialog(true);
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      setInformer({
        title: "Invalid PIN",
        message: "Please enter a 4-digit PIN",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await usersAPI.verifyUserPin(pin);
      const isVerified = res.data.isValid;

      if (isVerified) {
        setShowPinDialog(false);
        setShowPinVerified(true);
        setPinError(false);
      } else {
        setPinError(true);
        setInformer({
          title: "Incorrect PIN",
          message: "The PIN you entered is incorrect.",
          type: "error",
        });
      }
    } catch (error) {
      setPinError(true);
      setInformer({
        title: "Error",
        message: "Failed to verify PIN. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPin(value);
    if (pinError) {
      setPinError(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedType) {
      setInformer({
        title: "Error",
        message: "No transfer type selected",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setShowPinVerified(false);

    try {
      const transactionData = getTransactionData(selectedType);
      const response = await transactionsAPI.sendMoney(transactionData);

      if (response.success) {
        if (selectedType === "member") {
          setCurrentTransaction(response.data.recipientTransaction);
        } else {
          setCurrentTransaction(response.data.senderTransaction);
        }

        setPendingTransactions((prev) => [response.data, ...prev]);
        setShowSuccess(true);
        await updateUserBalances();

        setTimeout(() => {
          setShowSuccess(false);
          setShowReceipt(true);
          closeModal();
          setPin("");
        }, 2000);

        setInformer({
          title: "Transfer Initiated",
          message: "Your transfer has been submitted for processing.",
          type: "success",
        });
      } else {
        // Handle error response
        const errorMessage =
          response.error?.message || "Failed to process transfer";
        const isInsufficientBalance = errorMessage
          .toLowerCase()
          .includes("insufficient");

        setInformer({
          title: isInsufficientBalance ? "Insufficient Balance" : "Error",
          message: isInsufficientBalance
            ? "You don't have enough available balance to complete this transfer."
            : errorMessage,
          type: "error",
        });
      }
    } catch (error: any) {
      // Handle API error response
      const errorMessage =
        error.response?.data?.error?.message || "Failed to process transfer";
      const isInsufficientBalance = errorMessage
        .toLowerCase()
        .includes("insufficient");

      setInformer({
        title: isInsufficientBalance ? "Insufficient Balance" : "Error",
        message: isInsufficientBalance
          ? "You don't have enough available balance to complete this transfer."
          : errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSearch = (searchTerm: string) => {
    if (!members) return;

    if (searchTerm.length > 1) {
      setIsSearching(true);
      const filteredMembers = members.filter((member) => {
        return (
          member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.accountNumber.includes(searchTerm)
        );
      });
      setSearchResults(filteredMembers);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const getTransactionData = (subtype: TransferType) => {
    const baseData = {
      amount: Number.parseFloat(formData.amount),
      subtype,
    };

    switch (subtype) {
      case "wire-transfer":
        return {
          ...baseData,
          data: {
            recipientName: formData.recipientName,
            recipientAccount: formData.recipientAccount,
            routingNumber: formData.routingNumber,
            bankName: formData.bankName,
            bankAddress: formData.bankAddress,
            description: formData.description,
          },
        };
      case "member":
        return {
          ...baseData,
          data: {
            recipientId: selectedMember?._id,
            recipientName: selectedMember
              ? `${selectedMember.firstName} ${selectedMember.lastName}`
              : "",
            recipientAccount: selectedMember?.accountNumber,
            description: formData.description,
          },
        };
      case "mailcheck":
        return {
          ...baseData,
          data: {
            recipientName: formData.recipientName,
            recipientAddress: formData.recipientAddress,
            description: formData.description,
          },
        };
      default:
        return {
          ...baseData,
          data: {
            description: formData.description,
          },
        };
    }
  };

  const renderTransferForm = () => {
    switch (selectedType) {
      case "wire-transfer":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName || ""}
                onChange={(e) => setFormData({ recipientName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Account Number *</Label>
              <Input
                id="recipientAccount"
                value={formData.recipientAccount || ""}
                onChange={(e) =>
                  setFormData({ recipientAccount: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={formData.routingNumber || ""}
                onChange={(e) => setFormData({ routingNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={formData.bankName || ""}
                onChange={(e) => setFormData({ bankName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAddress">Bank Address</Label>
              <Textarea
                id="bankAddress"
                value={formData.bankAddress || ""}
                onChange={(e) => setFormData({ bankAddress: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        );

      case "member":
        return (
          <div className="space-y-4">
            {!selectedMember ? (
              <div className="space-y-2">
                <Label htmlFor="memberSearch">Search Member *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="memberSearch"
                    placeholder="Search by name or account number"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleMemberSearch(e.target.value);
                    }}
                    className="pl-10"
                    required
                    disabled={isLoadingMembers}
                  />
                </div>
                {isLoadingMembers && (
                  <div className="flex items-center justify-center py-2">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      Loading members...
                    </span>
                  </div>
                )}
                {isSearching && (
                  <div className="flex items-center justify-center py-2">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      Searching...
                    </span>
                  </div>
                )}
                {!isSearching && searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {searchResults.map((member) => (
                      <div
                        key={member._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedMember(member);
                          setSearchTerm("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Account: {member.accountNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!isSearching &&
                  searchResults.length === 0 &&
                  searchTerm.length > 1 && (
                    <div className="text-sm text-gray-500 py-2">
                      No members found matching your search.
                    </div>
                  )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Selected Recipient</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(null);
                      setSearchTerm("");
                    }}
                  >
                    Change
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-gray-500">Name:</span>{" "}
                    {selectedMember.firstName} {selectedMember.lastName}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Account:</span>{" "}
                    {selectedMember.accountNumber}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case "mailcheck":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                value={formData.recipientName || ""}
                onChange={(e) => setFormData({ recipientName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Mailing Address *</Label>
              <Textarea
                id="recipientAddress"
                value={formData.recipientAddress || ""}
                onChange={(e) =>
                  setFormData({ recipientAddress: e.target.value })
                }
                placeholder="Enter complete mailing address"
                rows={3}
                required
              />
            </div>
          </div>
        );

      default:
        return null;
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
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Send Money</h1>
          <p className="text-gray-500">Choose your preferred transfer method</p>
        </motion.div>

        {/* Transfer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {transferOptions.map((option, index) => {
            const IconComponent =
              typeof option.icon === "string"
                ? () => (
                    <img
                      src={option.icon as string}
                      alt={option.name}
                      className="h-8 w-8"
                    />
                  )
                : option.icon;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-none ${
                    option.disabled ? "opacity-60" : "hover:scale-105"
                  }`}
                  onClick={() => handleTransferClick(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {option.name}
                          </h3>
                          {option.comingSoon && (
                            <Badge variant="secondary" className="text-xs">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Transfers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Transfers</CardTitle>
              <CardDescription>
                Track the status of your money transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {pendingTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingTransactions.map((tx, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-lg">
                            ${tx.amount}
                          </div>
                          <Badge
                            variant={
                              tx.status === "Pending" ? "secondary" : "default"
                            }
                            className={`px-3 py-1 rounded-full text-xs ${
                              tx.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : tx.status === "Success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          To: {tx.recipient} • {tx.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          Date: {new Date(tx.date).toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent transfers</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transfer Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedType &&
                  transferOptions.find((opt) => opt.id === selectedType)?.name}
              </DialogTitle>
              <DialogDescription>
                Enter the transfer details below
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderTransferForm()}

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">
                  Amount (USD) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn(
                      "pl-8 h-12 text-lg",
                      formData.amount &&
                        Number(formData.amount) >
                          (user?.availableBalance || 0) &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    value={formData.amount}
                    onChange={(e) => setFormData({ amount: e.target.value })}
                    required
                  />
                </div>
                {formData.amount &&
                  Number(formData.amount) > (user?.availableBalance || 0) && (
                    <p className="text-sm text-red-500 mt-1">
                      Insufficient funds. Your available balance is{" "}
                      {formatCurrency(user?.availableBalance || 0)}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="What's this transfer for?"
                  value={formData.description}
                  onChange={(e) => setFormData({ description: e.target.value })}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 h-12 text-lg"
                >
                  Continue
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* PIN Verification Dialog */}
        <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Verify Your PIN</DialogTitle>
              <DialogDescription>
                Enter your 4-digit PIN to authorize this transfer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-base">
                  Transaction PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={handlePinChange}
                  className={cn(
                    "text-center text-2xl tracking-widest h-12",
                    pinError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="••••"
                />
                {pinError && (
                  <p className="text-sm text-red-500 mt-1">
                    Incorrect PIN. Please try again.
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPinDialog(false);
                    setPinError(false);
                    setPin("");
                  }}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  disabled={isLoading || pin.length !== 4}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 h-12"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify PIN"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* PIN Verified Confirmation Dialog */}
        <Dialog open={showPinVerified} onOpenChange={setShowPinVerified}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                PIN Verified Successfully!
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Please confirm the transfer details below
              </p>

              <div className="w-full space-y-4 mb-6">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">
                        {selectedType &&
                          transferOptions.find((opt) => opt.id === selectedType)
                            ?.name}
                      </span>
                    </div>
                    {formData.recipientName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Recipient:</span>
                        <span className="font-medium">
                          {formData.recipientName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  onClick={() => setShowPinVerified(false)}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 h-12"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">
                Transfer Successful!
              </h3>
              <p className="text-gray-500 text-center">
                Your transfer has been initiated successfully.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Modal */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Transaction Receipt
              </DialogTitle>
              <DialogDescription>Your transfer details</DialogDescription>
            </DialogHeader>

            {currentTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-6 border rounded-xl space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {currentTransaction._id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">
                      ${currentTransaction.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span>{currentTransaction.subtype}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        currentTransaction.status === TransactionStatus.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : currentTransaction.status ===
                            TransactionStatus.SUCCESS
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {currentTransaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>
                      {new Date(currentTransaction.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Display all data fields */}
                  {currentTransaction.data &&
                    Object.entries(currentTransaction.data).map(
                      ([key, value]) => {
                        // Skip if value is null, undefined, or empty object
                        if (
                          !value ||
                          (typeof value === "object" &&
                            Object.keys(value).length === 0)
                        ) {
                          return null;
                        }

                        // If value is an object, display its properties
                        if (typeof value === "object" && value !== null) {
                          return Object.entries(value).map(
                            ([subKey, subValue]) => (
                              <div
                                key={`${key}-${subKey}`}
                                className="flex justify-between"
                              >
                                <span className="text-gray-500">
                                  {subKey.charAt(0).toUpperCase() +
                                    subKey.slice(1)}
                                  :
                                </span>
                                <span className="font-medium">
                                  {String(subValue)}
                                </span>
                              </div>
                            )
                          );
                        }

                        // Display simple key-value pairs
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500">
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        );
                      }
                    )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowReceipt(false)}>Close</Button>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
