// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { usePathname, useRouter } from "next/navigation"
// import { Home, Users, Settings, LogOut, Menu, Bell, DollarSign } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/components/ui/use-toast"
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
// import { useIsMobile } from "@/hooks/use-mobile"
// import { authUtils } from "@/lib/store"

// export function AdminLayout({ children }: { children: React.ReactNode }) {
//   const [userName, setUserName] = useState("")
//   const pathname = usePathname()
//   const router = useRouter()
//   const { toast } = useToast()
//   const isMobile = useIsMobile()

//   // useEffect(() => {
//   //   // Check if admin is logged in
//   //   const token = authUtils.getToken("adminToken")
//   //   const name = sessionStorage.getItem("user-name")

//   //   if (!token) {
//   //     router.push("/auth/admin-login")
//   //     return
//   //   }

//   //   if (name) {
//   //     setUserName(name)
//   //   }
//   // }, [router])

//   const handleLogout = () => {
//     authUtils.removeToken("auth-token")
//     authUtils.removeToken("adminToken")
//     sessionStorage.removeItem("user-role")
//     sessionStorage.removeItem("user-name")

//     toast({
//       title: "Logged out successfully",
//       description: "You have been logged out of your account.",
//     })

//     router.push("/auth/admin-login")
//   }

//   const navigationItems = [
//     { name: "Dashboard", href: "/admin/dashboard", icon: Home },
//     { name: "Users", href: "/admin/users", icon: Users },
//     { name: "Transactions", href: "/admin/transactions", icon: DollarSign },
//     { name: "Settings", href: "/admin/settings", icon: Settings },
//   ]

//   if (isMobile) {
//     return (
//       <div className="flex flex-col min-h-screen bg-gray-50">
//         {/* Mobile Header */}
//         <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
//               <span className="font-bold text-white">A</span>
//             </div>
//             <div className="bg-navy-900 px-3 py-1.5 rounded-md">
//               <span className="font-bold text-lg">
//                 <span className="text-red-500">Admin</span>
//                 <span className="text-white">Panel</span>
//               </span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto">{children}</main>

//         {/* Mobile Bottom Navigation */}
//         <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-200">
//           <div className="grid grid-cols-4 h-16">
//             {navigationItems.map((item) => (
//               <Button
//                 key={item.name}
//                 variant="ghost"
//                 className={`flex flex-col items-center justify-center rounded-none h-full space-y-1 ${
//                   pathname === item.href ? "text-red-600" : "text-gray-500"
//                 }`}
//                 onClick={() => router.push(item.href)}
//               >
//                 <item.icon className="h-5 w-5" />
//                 <span className="text-xs">{item.name}</span>
//               </Button>
//             ))}
//           </div>
//         </nav>
//       </div>
//     )
//   }

//   return (
//     <SidebarProvider>
//       <div className="flex h-screen bg-gray-50">
//         <Sidebar className="border-r border-gray-200">
//           <SidebarHeader className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <div className="bg-navy-900 px-3 py-1.5 rounded-md">
//                 <span className="font-bold text-lg">
//                   <span className="text-red-500">Admin</span>
//                   <span className="text-white">Panel</span>
//                 </span>
//               </div>
//             </div>
//           </SidebarHeader>
//           <SidebarContent>
//             <SidebarMenu>
//               {navigationItems.map((item) => (
//                 <SidebarMenuItem key={item.name}>
//                   <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
//                     <button onClick={() => router.push(item.href)}>
//                       <item.icon className="h-5 w-5" />
//                       <span>{item.name}</span>
//                     </button>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarContent>
//           <SidebarFooter className="p-4">
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton onClick={handleLogout}>
//                   <LogOut className="h-5 w-5" />
//                   <span>Logout</span>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarFooter>
//         </Sidebar>

//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Desktop Header */}
//           <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
//             <div className="flex items-center">
//               <SidebarTrigger className="mr-4" />
//               <h1 className="text-xl font-semibold text-gray-800">
//                 {pathname === "/admin/dashboard" && "Admin Dashboard"}
//                 {pathname === "/admin/users" && "User Management"}
//                 {pathname === "/admin/transactions" && "Transaction Management"}
//                 {pathname === "/admin/settings" && "Settings"}
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="icon" className="relative">
//                 <Bell className="h-5 w-5" />
//                 <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
//               </Button>
//               <div className="flex items-center space-x-2">
//                 <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//                   {userName.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="font-medium">{userName}</span>
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main className="flex-1 overflow-auto p-6 w-full">{children}</main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }



"use client";

import type React from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  DollarSign,
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

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    authUtils.removeToken("auth-token");
    authUtils.removeToken("adminToken");
    sessionStorage.removeItem("user-role");
    sessionStorage.removeItem("user-name");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });

    router.push("/auth/admin-login");
  };

  const navigationItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: DollarSign },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-gray-50">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <div className="bg-navy-900 px-3 py-1.5 rounded-md">
              <span className="font-bold text-lg">
                <span className="text-red-500">Admin</span>
                <span className="text-white">Panel</span>
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
        <main className="flex-1 overflow-auto w-full px-4 py-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-200 w-full">
          <div className="grid grid-cols-4 h-16">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`flex flex-col items-center justify-center rounded-none h-full space-y-1 ${
                  pathname === item.href ? "text-red-600" : "text-gray-500"
                }`}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Button>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div>
              <div className="bg-navy-900 px-3 py-1.5 rounded-md">
                <span className="font-bold text-lg">
                  <span className="text-red-500">Admin</span>
                  <span className="text-white">Panel</span>
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <button onClick={() => router.push(item.href)}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
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
              <h1 className="text-xl font-semibold text-gray-800">
                {pathname === "/admin/dashboard" && "Admin Dashboard"}
                {pathname === "/admin/users" && "User Management"}
                {pathname === "/admin/transactions" && "Transaction Management"}
                {pathname === "/admin/settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
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
