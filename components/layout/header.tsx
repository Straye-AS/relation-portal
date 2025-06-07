"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Circle, Menu, Rocket, X } from "lucide-react";

interface Route {
  href: string;
  label: string;
  active: boolean;
}

export function Header({ user }: { user: any }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const routes: Route[] = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/pricing",
      label: "Pricing",
      active: pathname === "/pricing",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-8xl z-50 transition-all duration-300 rounded-full",
        isScrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-md border py-4 border-border border-[1.5px] mt-5"
          : "bg-white/70 dark:bg-black/70 backdrop-blur-md border py-4 border-border border-[1.5px] mt-5"
      )}
    >
      <div className="px-6 grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Sol taraf - Logo */}
        <div className="justify-self-start flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <Link href="/" className="text-lg">
            ACME Inc.
          </Link>
        </div>

        {/* Orta - Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 justify-self-center">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Sağ taraf - Buttons */}
        <div className="justify-self-end">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button asChild variant="default" className="rounded-full">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild variant="default" className="rounded-full">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 h-full mt-8">
                  <nav className="flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-primary",
                          route.active ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4">
                    {user ? (
                      <Button asChild variant="default" className="w-full rounded-full">
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                        <Button asChild variant="default" className="w-full rounded-full">
                          <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}