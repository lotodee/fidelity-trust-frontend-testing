"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
 const { register, isAuthenticated, error } = useAuthStore();

 useEffect(() => {
   if (!isAuthenticated) {
     router.push("/auth/login");
   }
 }, [isAuthenticated, router]);
  const handleLogout = () => {
logout()

    router.push("/");
  };

  const navigationItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/dashboard/transactions", icon: BarChart3 },
    { name: "Coins", href: "/dashboard/coins", icon: Coins },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center"></div>
            <div className="bg-navy-900 px-3 py-1.5 rounded-md">
              <span className="font-bold text-lg">
                <span className="text-green-500">Fidelity</span>
                <span className="text-white">Trust</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto w-full">{children}</main>

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

        {/* Chat Button */}
        <ChatButton />
      </div>
    );
  }

  // Desktop / Tablet layout: full width
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="border-r border-gray-200 flex-shrink-0">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <div className="bg-navy-900 px-3 py-1.5 rounded-md">
                <span className="font-bold text-lg">
                  <span className="text-green-500">Fidelity</span>
                  <span className="text-white">Trust</span>
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className="py-4"
                    >
                      <button
                        onClick={() => router.push(item.href)}
                        className={`flex items-center gap-4 px-4 my-2  py-6 w-full rounded-xl transition-all duration-200
                          ${
                            isActive
                              ? "bg-emerald-400 text-white  py-8 shadow-lg font-bold scale-105"
                              : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105 py-4"
                          }
                        `}
                      >
                        <div
                          className={`p-2.5 rounded-xl ${
                            isActive ? "bg-white/20 text-white" : "bg-emerald-400 text-white"
                          }`}
                        >
                          <item.icon
                            className={`transition-all duration-200 ${
                              isActive ? "h-7 w-7" : "h-6 w-6"
                            }`}
                          />
                        </div>
                        <span className="text-lg font-medium">{item.name}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-5 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <div className="p-2.5 rounded-xl bg-gray-100">
                    <LogOut className="h-6 w-6" />
                  </div>
                  <span className="text-lg font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Desktop Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-emerald-500">
                {pathname === "/dashboard" && "Dashboard"}
                {pathname === "/dashboard/accounts" && "Accounts"}
                {pathname === "/dashboard/transactions" && "Transactions"}
                {pathname === "/dashboard/coins" && "Coins"}
                {pathname === "/dashboard/profile" && "Profile"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{userName}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="w-full px-6 py-6 m-5 bg-white rounded-2xl shadow-sm">
              {children}
            </div>
          </div>
        </div>

        {/* Chat Button */}
        <ChatButton />
      </div>
    </SidebarProvider>
  );
}
