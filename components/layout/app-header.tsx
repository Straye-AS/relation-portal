"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, Search } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useUIStore } from "@/store/useUIStore";
import { Badge } from "@/components/ui/badge";
import { CompanySelector } from "@/components/dashboard/company-selector";
import { GlobalSearch } from "@/components/search/global-search";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export function AppHeader() {
  const { user, logout } = useAuth();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useKeyboardShortcut("k", () => setSearchOpen(true), {
    ctrl: true,
    meta: true,
  });

  const userInitials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/straye-logo-blue.png"
              alt="Straye"
              width={32}
              height={32}
              className="dark:hidden"
              priority
            />
            <Image
              src="/straye-logo-white.png"
              alt="Straye"
              width={32}
              height={32}
              className="hidden dark:block"
              priority
            />
            <span className="hidden font-logo text-xl font-bold uppercase tracking-wider text-foreground sm:inline">
              Relation
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="outline"
            className="hidden gap-2 text-muted-foreground sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Søk...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:inline">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <CompanySelector />

          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Innstillinger</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logg ut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Global Search */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
