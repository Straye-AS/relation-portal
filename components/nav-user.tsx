"use client"

import Image from "next/image"
import Link from "next/link"
import { LogOut, Settings2, User, Crown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  subscriptionData: any
  onSignOut: () => void
}

export function NavUser({ user, subscriptionData, onSignOut }: NavUserProps) {
  const currentPlan = subscriptionData?.plan || 'free'

  return (
    <div className="p-2">
      <Menubar className="border-0 bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-8 w-8 bg-muted">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          </MenubarTrigger>
          
          <MenubarContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-muted">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
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
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </MenubarItem>
            
            <MenubarItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Settings</span>
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
  )
}
