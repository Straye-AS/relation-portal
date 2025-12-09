"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, Rocket } from "lucide-react";

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
    {
      href: "https://neosaas.nodocs.io",
      label: "Docs",
      active: false,
    },
  ];

  return (
    <header
      className={cn(
        "max-w-8xl fixed left-1/2 top-0 z-50 w-[calc(100%-2.5rem)] -translate-x-1/2 transform rounded-full transition-all duration-300",
        isScrolled
          ? "mt-5 border border-[1.5px] border-border bg-white/70 py-4 backdrop-blur-md dark:bg-black/70"
          : "mt-5 border border-[1.5px] border-border bg-white/70 py-4 backdrop-blur-md dark:bg-black/70"
      )}
    >
      <div className="grid grid-cols-2 items-center px-6 md:grid-cols-3">
        {/* Sol taraf - Logo */}
        <div className="flex items-center gap-2 justify-self-start">
          <Rocket className="h-6 w-6 text-primary" />
          <Link href="/" className="text-lg">
            ACME Inc.
          </Link>
        </div>

        {/* Orta - Navigation Menu */}
        <nav className="hidden items-center gap-8 justify-self-center md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Sağ taraf - Buttons */}
        <div className="justify-self-end">
          <div className="hidden items-center gap-4 md:flex">
            <Link href="https://buy.stripe.com/00w28sgaE73OfzD4RRcAo0A">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                Buy Boilerplate
              </Button>
            </Link>
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

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 flex h-full flex-col gap-6">
                  <nav className="flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-primary",
                          route.active
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4">
                    {user ? (
                      <Button
                        asChild
                        variant="default"
                        className="w-full rounded-full"
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link
                            href="/sign-in"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign in
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="default"
                          className="w-full rounded-full"
                        >
                          <Link
                            href="/sign-up"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
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
