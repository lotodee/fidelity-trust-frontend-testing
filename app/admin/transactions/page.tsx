"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersAPI } from "@/lib/api/users";
import { transactionsAPI } from "@/lib/api/transactions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Search,
  Edit,
  Loader2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminTransactionStore } from "@/lib/store/admin-transactions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSelectedIdsStore } from "@/lib/store/selected-ids";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminTransactionsStore } from "@/lib/store/admin-transactions";

export default function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [showTransactionType, setShowTransactionType] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setSelectedUser } = useAdminTransactionStore();
  const { setSelectedTransactionId } = useSelectedIdsStore();

  // Get transactions from store
  const {
    transactions,
    setTransactions,
    updateTransaction: updateTransactionInStore,
  } = useAdminTransactionsStore();
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response?.data);
      setFilteredUsers(response?.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, activeTab, transactions]);

  useEffect(() => {
    if (userSearchTerm) {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.accountNumber.includes(userSearchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [userSearchTerm, users]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await transactionsAPI.getAllTransactions();
      console.log("All Transactions Data:", response.data);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by incoming/outgoing
    filtered = filtered.filter((transaction) => {
      if (activeTab === "incoming") {
        return transaction.action === "credit" || transaction.type === "credit";
      } else {
        return transaction.action === "debit" || transaction.type === "debit";
      }
    });

    if (searchTerm) {
      filtered = filtered?.filter(
        (transaction) =>
          transaction.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.userId?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.userId?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.userId?.accountNumber?.includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setShowUserSelect(false);
    setShowTransactionType(true);
  };

  const handleTransactionTypeSelect = (type: string) => {
    router.push(`/admin/transactions/create?type=${type}`);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-5 w-5 text-emerald-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "transfer":
        return <Send className="h-5 w-5 text-blue-500" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handleEditTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    router.push("/admin/transactions/edit");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Transaction Management</h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => setShowUserSelect(true)}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Transaction
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Manage all transactions in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex space-x-2 border-b">
                <button
                  onClick={() => setActiveTab("incoming")}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "incoming"
                      ? "text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Incoming
                  {activeTab === "incoming" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("outgoing")}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "outgoing"
                      ? "text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Outgoing
                  {activeTab === "outgoing" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                      initial={false}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredTransactions?.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions?.map((transaction) => (
                            <motion.tr
                              key={transaction._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                handleEditTransaction(transaction._id)
                              }
                            >
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {transaction.userId?.firstName}{" "}
                                      {transaction.userId?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {transaction.userId?.accountNumber}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {transaction.action === "debit" ? (
                                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                                    ) : (
                                      <ArrowDownRight className="h-5 w-5 text-emerald-500" />
                                    )}
                                  </div>
                                  <span className="capitalize">
                                    {transaction.description ||
                                      transaction.type}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell
                                className={`font-medium ${
                                  transaction.action === "credit"
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.action === "credit" ? "+" : "-"}$
                                {transaction.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    transaction.status
                                  )}`}
                                >
                                  {transaction.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatDate(transaction.createdAt)}
                              </TableCell>
                              <TableCell className="max-w-[200px]">
                                <div className="text-sm text-gray-600">
                                  {transaction.description || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEditTransaction(transaction._id)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">
                        No transactions found
                      </h3>
                      <p className="mt-1">
                        {searchTerm
                          ? "Try adjusting your search"
                          : `No ${activeTab} transactions available`}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Selection Dialog */}
      <Dialog open={showUserSelect} onOpenChange={setShowUserSelect}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select User</DialogTitle>
            <DialogDescription>
              Search and select a user to create a transaction for
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email} • {user.accountNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Type Selection Dialog */}
      <Dialog open={showTransactionType} onOpenChange={setShowTransactionType}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Transaction Type</DialogTitle>
            <DialogDescription>
              Choose the type of transaction to create
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleTransactionTypeSelect("sendMoney")}
            >
              <Send className="h-8 w-8 text-blue-500" />
              <span>Send Money</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleTransactionTypeSelect("credit")}
            >
              <ArrowDownRight className="h-8 w-8 text-emerald-500" />
              <span>Credit</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleTransactionTypeSelect("debit")}
            >
              <ArrowUpRight className="h-8 w-8 text-red-500" />
              <span>Debit</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
