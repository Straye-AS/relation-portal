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
  LogOut, 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  User, 
  FileText,
  HelpCircle
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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div>
            <h2 className="text-lg font-semibold">Menu</h2>
            <p className="text-sm text-muted-foreground">{user?.user_metadata?.full_name || user?.email}</p>
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
          <Button 
            onClick={onSignOut}
            variant="outline" 
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 