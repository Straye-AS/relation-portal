"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { AuthModeToggle } from "@/components/auth/auth-mode-toggle";
import { isLocalAuthEnabled, getAuthModePreference } from "@/lib/auth/localAuthConfig";
import Image from "next/image";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Load notifications in background
  useNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isLocalMode = isLocalAuthEnabled() &&
      (typeof window === "undefined" || getAuthModePreference() === "local");

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/straye-logo-blue.png"
                alt="Straye Logo"
                width={32}
                height={32}
                className="dark:hidden"
                priority
              />
              <Image
                src="/straye-logo-white.png"
                alt="Straye Logo"
                width={32}
                height={32}
                className="hidden dark:block"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Straye Relation</h1>
              <p className="mt-2 text-muted-foreground">
                Intern CRM og tilbudshåndtering
              </p>
            </div>
          </div>

          <Button onClick={login} className="w-full" size="lg">
            {isLocalMode ? "Logg inn som testutvikler" : "Logg inn med Microsoft"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Kun for ansatte i Straye Gruppen AS
          </p>

          {/* Auth mode toggle - only visible in development */}
          <AuthModeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto py-3">{children}</div>
        </main>
      </div>
    </div>
  );
}
