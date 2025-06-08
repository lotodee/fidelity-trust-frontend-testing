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
import {
  Bell,
  Check,
  Search,
  Trash2,
  AlertCircle,
  DollarSign,
  Settings,
  User,
} from "lucide-react";
import { useNotificationStore } from "@/lib/store/notifications";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminNotifications() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "unread" | "transaction" | "system" | "user"
  >("all");
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "transaction" && notification.type === "transaction") ||
      (filter === "system" && notification.type === "system") ||
      (filter === "user" && notification.type === "user");

    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <DollarSign className="h-5 w-5" />;
      case "system":
        return <Settings className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    if (
      notification.type === "transaction" &&
      notification.data?.transactionId
    ) {
      router.push(`/admin/transactions?txn=${notification.data.transactionId}`);
    } else if (notification.type === "user" && notification.data?.userId) {
      router.push(`/admin/users?user=${notification.data.userId}`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and view system notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>
                  Unread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("transaction")}>
                  Transactions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("user")}>
                  User Activity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-red-600 hover:text-red-700"
              onClick={() => deleteAllNotifications()}
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "p-6 hover:bg-gray-50 transition-colors cursor-pointer",
                        !notification.read && "bg-red-50/50"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            notification.type === "transaction"
                              ? "bg-red-100 text-red-600"
                              : notification.type === "user"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <Badge
                                  variant="secondary"
                                  className="bg-red-100 text-red-700"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-sm text-gray-500">
                              {format(
                                new Date(notification.createdAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {notification.type.charAt(0).toUpperCase() +
                                notification.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No notifications found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "You're all caught up!"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
