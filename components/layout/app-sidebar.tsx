"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderKanban,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  {
    name: "Dashbord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tilbud",
    href: "/offers",
    icon: FileText,
  },
  {
    name: "Kunder",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Prosjekter",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Varsler",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Innstillinger",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? "4rem" : "16rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex md:flex-shrink-0 relative"
    >
      <div className="flex flex-col w-full border-r bg-sidebar-background">
        <div className="flex flex-col flex-grow pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1 mt-5">
            <TooltipProvider delayDuration={300}>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                const navItem = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      sidebarCollapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 h-5 w-5",
                        !sidebarCollapsed && "mr-3",
                        isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                    />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        {navItem}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return navItem;
              })}
            </TooltipProvider>
          </nav>

          {/* Toggle button at bottom */}
          <div className="px-2 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebarCollapse}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  <span className="text-xs">Skjul meny</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
