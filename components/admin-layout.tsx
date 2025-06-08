"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  DollarSign,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  UserCircle,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authUtils } from "@/lib/store";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { truncate } from "lodash";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { useNotificationStore } from "@/lib/store/notifications";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, logout } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useNotificationStore();

  console.log("the curren tuser is", user);

  useEffect(() => {
    const adminToken = sessionStorage.getItem("adminToken");
    const userRole = sessionStorage.getItem("user-role");

    if (!adminToken || userRole !== "admin") {
      router.push("/auth/login");
      return;
    }

    // If we have both, ensure we're on admin dashboard if at root
    if (pathname === "/admin") {
      router.push("/admin/dashboard");
    }
  }, [pathname, router]);

  useEffect(() => {
    if (user) {
      initializeSocket();
      return () => {
        disconnectSocket();
      };
    }
  }, [user, initializeSocket, disconnectSocket]);

  const handleLogout = () => {
    // authUtils.removeToken("auth-token");
    // authUtils.removeToken("adminToken");
    // sessionStorage.removeItem("user-role");
    // sessionStorage.removeItem("user-name");
    logout(true);

    //user the infomer here to tell them they are beein logged out

    router.push("/auth/admin-login");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: UserCircle },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-red-600 to-red-800 px-4 py-3 flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
              <span className="font-bold text-white">A</span>
            </div>
            <div className="text-white">
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto w-full px-4 py-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-200 w-full px-2 py-2">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${isActive ? "bg-red-100" : ""}`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isActive ? "text-red-600" : ""}`}
                    />
                  </div>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="p-4 bg-gradient-to-r from-red-600 to-red-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                <span className="font-bold text-white">A</span>
              </div>
              <div>
                <span className="font-bold text-lg text-white">
                  Admin Panel
                </span>
                <p className="text-white/70 text-sm">Control Center</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="space-y-1 p-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(item.href)}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600"
                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 ml-auto text-red-600" />
                        )}
                      </motion.button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-gray-100">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Desktop Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center w-full">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold text-red-600">
                {pathname === "/admin/dashboard" && "Admin Dashboard"}
                {pathname === "/admin/users" && "User Management"}
                {pathname === "/admin/transactions" && "Transaction Management"}
                {pathname === "/admin/settings" && "Settings"}
                {pathname === "/admin/chat" && "Chat Support"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{userName}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto w-full px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
