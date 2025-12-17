"use client";

import { useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
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
  FileQuestion,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOffers } from "@/hooks/useOffers";

const navigation = [
  {
    name: "Dashbord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Forespørsler",
    href: "/requests",
    icon: FileQuestion,
  },
  {
    name: "Tilbud",
    href: "/offers",
    icon: FileText,
  },
  {
    name: "Prosjekter",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Kunder",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Varsler",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Aktivitetslogg",
    href: "/activities",
    icon: Calendar,
  },
  {
    name: "Innstillinger",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse, setSidebarCollapsed } =
    useUIStore();
  const { data: offersData } = useOffers({
    phase: "draft" as any,
  });
  const requestCount = offersData?.data?.length ?? 0;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarCollapsed, sidebarCollapsed]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? "4rem" : "16rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative hidden md:flex md:flex-shrink-0"
    >
      <div className="flex w-full flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            href="/"
            className="flex items-center space-x-3 overflow-hidden"
          >
            <div className="flex-shrink-0">
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
            </div>
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap font-logo text-xl font-bold uppercase tracking-wider text-sidebar-foreground">
                Relation
              </span>
            )}
          </Link>
        </div>
        <div className="flex flex-grow flex-col overflow-y-auto pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
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
                      "group relative flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      sidebarCollapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        !sidebarCollapsed && "mr-3",
                        isActive
                          ? "text-sidebar-primary-foreground"
                          : "text-sidebar-foreground"
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="flex flex-1 items-center justify-between">
                        {item.name}
                        {item.name === "Forespørsler" && requestCount > 0 && (
                          <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                            {requestCount > 5 ? "5+" : requestCount}
                          </span>
                        )}
                      </span>
                    )}
                    {/* Badge for collapsed state */}
                    {sidebarCollapsed &&
                      item.name === "Forespørsler" &&
                      requestCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                          !
                        </span>
                      )}
                  </Link>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>{navItem}</TooltipTrigger>
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
          <div className="mt-auto px-2">
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
                  <ChevronLeft className="mr-2 h-5 w-5" />
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
