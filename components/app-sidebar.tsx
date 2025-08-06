"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Book, Brain, ChartBar, Command, CreditCard, Home, Settings, User, UploadCloud, Mail } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  user: any
  subscriptionData: any
  onSignOut: () => void
}

// Navigation items
const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartBar },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "https://neosaas.nodocs.io/", label: "Documentation", icon: Book },
  { href: "mailto:info@neosaas.dev", label: "Support", icon: Mail },
  { href: "/dashboard/ai", label: "AI", icon: Brain },
  { href: "/dashboard/upload", label: "Upload", icon: UploadCloud },
]

export function AppSidebar({ user, subscriptionData, onSignOut }: AppSidebarProps) {
  const pathname = usePathname()
  const currentPlan = subscriptionData?.plan || 'free'

  // Get user display name and avatar
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email
  const userAvatar = user?.raw_user_meta_data?.avatar_url || null
  
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="h-4 w-4 text-foreground" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ACME Inc</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="px-2 mt-2">
          
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
                : 'bg-red-200 text-red-700 ring-red-600/20'
            }`}>
              {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
            </span>
          )}
        </div>
        
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navigationItems} onNavigate={isMobile ? () => setOpenMobile(false) : undefined} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser 
          user={{ 
            name: userName, 
            email: userEmail, 
            avatar: userAvatar
          }} 
          subscriptionData={subscriptionData}
          onSignOut={onSignOut}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
