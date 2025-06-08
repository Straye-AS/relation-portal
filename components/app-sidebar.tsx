"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  LogOut, 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  User, 
  FileText,
  HelpCircle,
  UserCircle,
  Crown
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppSidebarProps {
  user: any;
  subscriptionData: any;
  onSignOut: () => void;
}

// Navigation items
const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/pricing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Documentation", icon: FileText },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export function AppSidebar({ user, subscriptionData, onSignOut }: AppSidebarProps) {
  const pathname = usePathname();
  const currentPlan = subscriptionData?.plan || 'free';

  // Get user display name and avatar
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email;
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div>
            <h2 className="text-lg font-semibold">ACME Inc.</h2>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="px-2">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            currentPlan === 'free' 
              ? 'bg-gray-50 text-gray-700 ring-gray-600/20'
              : currentPlan === 'basic'
              ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
              : currentPlan === 'plus'
              ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
              : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
          }`}>
            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
          </span>
          {subscriptionData?.status && (
            <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              subscriptionData.status === 'active' 
                ? 'bg-green-50 text-green-700 ring-green-600/20'
                : 'bg-gray-50 text-gray-700 ring-gray-600/20'
            }`}>
              {subscriptionData.status}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={href}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <Menubar className="border-0 bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex items-center gap-3 flex-1">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-sidebar-accent-foreground">
                      {getInitials(userName)}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{userName}</span>
                    <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                  </div>
                </div>
              </MenubarTrigger>
              
              <MenubarContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-sidebar-accent-foreground">
                        {getInitials(userName)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userName}</span>
                      <span className="text-xs text-muted-foreground">{userEmail}</span>
                    </div>
                  </div>
                </div>
                
                <MenubarSeparator />
                
                <MenubarItem className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm">Current Plan</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {currentPlan} {subscriptionData?.status && `(${subscriptionData.status})`}
                    </span>
                  </div>
                </MenubarItem>
                
                <MenubarSeparator />
                
                <MenubarItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </MenubarItem>
                
                <MenubarItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </MenubarItem>
                
                <MenubarItem asChild>
                  <Link href="/pricing" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </MenubarItem>
                
                <MenubarSeparator />
                
                <MenubarItem 
                  onClick={onSignOut}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 