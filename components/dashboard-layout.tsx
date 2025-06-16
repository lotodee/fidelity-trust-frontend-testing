"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  CreditCard,
  BarChart3,
  Coins,
  User,
  LogOut,
  Bell,
  Menu,
  TrendingUp,
  MessageSquare,
  Shield,
  Settings,
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
} from "@/components/ui/sidebar";
import { ChatButton } from "@/components/chat-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/lib/store/auth";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { useNotificationStore } from "@/lib/store/notifications";
import { WelcomeModal } from "@/components/welcome-modal";
import { AnimatePresence } from "framer-motion";
import { NotificationHandler } from "@/components/notification-handler";

function LoadingLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="w-64 border-r border-gray-200 bg-gradient-to-b from-emerald-800 to-emerald-900 p-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-48 mb-8" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useNotificationStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const socketInitialized = useRef(false);

  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { isAuthenticated, initialized, initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated, initialized]);

  // Handle socket connection
  useEffect(() => {
    if (isAuthenticated && !socketInitialized.current) {
      console.log("[DashboardLayout] Initializing socket connection...");
      initializeSocket();
      socketInitialized.current = true;
    }

    return () => {
      if (socketInitialized.current) {
        console.log("[DashboardLayout] Cleaning up socket connection...");
        disconnectSocket();
        socketInitialized.current = false;
      }
    };
  }, [isAuthenticated, initializeSocket, disconnectSocket]);

  // Check for signup flow
  useEffect(() => {
    if (typeof window !== "undefined") {
      const showSignupFlow = sessionStorage.getItem("showSignupFlow");
      if (showSignupFlow === "true") {
        setShowWelcomeModal(true);
        // Clear the flag after showing the modal
        sessionStorage.setItem("showSignupFlow", "false");
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navigationItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/dashboard/transactions", icon: BarChart3 },
    { name: "Stocks", href: "/dashboard/stocks", icon: TrendingUp },
    { name: "Cards", href: "/dashboard/cards", icon: CreditCard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  if (!initialized) {
    return <LoadingLayout />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-800 to-emerald-900 px-4 py-3 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md">
              <span className="font-bold text-sm">
                <span className="text-emerald-300">Fidelity</span>
                <span className="text-white">Trust</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                {user?.firstName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-white text-sm">
                {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto w-full px-4 py-4">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-200 w-full">
          <div className="grid grid-cols-5 h-16">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`flex flex-col items-center justify-center rounded-none h-full space-y-1 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? "bg-emerald-100" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 transition-all duration-200 ${
                        isActive ? "scale-110" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Welcome Modal for Mobile */}
        <AnimatePresence>
          {showWelcomeModal && (
            <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop / Tablet layout
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <NotificationHandler />
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200 flex-shrink-0 bg-gradient-to-b from-emerald-800 to-emerald-900">
          <SidebarHeader className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="font-bold text-xl">
                  <span className="text-emerald-300">Fidelity</span>
                  <span className="text-white">Trust</span>
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <button
                        onClick={() => router.push(item.href)}
                        className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl transition-all duration-200
                          ${
                            isActive
                              ? "bg-white/20 text-white font-medium"
                              : "text-emerald-100 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-white/20" : "bg-white/10"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 transition-all duration-200 ${
                              isActive ? "scale-110" : ""
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            <div className="px-3 mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <MessageSquare className="h-10 w-10 text-emerald-200 mb-3" />
                    <h3 className="font-medium text-white mb-2">
                      Live Support
                    </h3>
                    <p className="text-emerald-100 text-sm mb-4">
                      Get instant help from our support team
                    </p>
                    <a href="/dashboard/chat" className="w-full">
                      <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-9 text-sm">
                        Start Chat
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 w-full text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl"
                >
                  <div className="p-2 rounded-lg bg-white/10">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Desktop Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-emerald-600">
                {pathname === "/dashboard" && "Dashboard"}
                {pathname === "/dashboard/accounts" && "Accounts"}
                {pathname === "/dashboard/transactions" && "Transactions"}
                {pathname === "/dashboard/stocks" && "Stocks"}
                {pathname === "/dashboard/cards" && "Cards"}
                {pathname === "/dashboard/security" && "Security"}
                {pathname === "/dashboard/profile" && "Profile"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  {user?.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">
                  {user?.firstName}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="w-full bg-gray-50 px-6 py-6">{children}</div>
          </div>
        </div>

        {/* Welcome Modal for Desktop */}
        <AnimatePresence>
          {showWelcomeModal && (
            <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
