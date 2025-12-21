"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { AuthModeToggle } from "@/components/auth/auth-mode-toggle";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  isLocalAuthEnabled,
  getAuthModePreference,
} from "@/lib/auth/localAuthConfig";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AppLayout({
  children,
  disableScroll = false,
}: {
  children: React.ReactNode;
  disableScroll?: boolean;
}) {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Ensure user data is loaded and company store is updated
  useCurrentUser();

  // Load notifications in background
  useNotifications();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isLocalMode =
      isLocalAuthEnabled() &&
      (typeof window === "undefined" || getAuthModePreference() === "local");

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-8 shadow-lg">
          <div className="space-y-4 text-center">
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
            {isLocalMode
              ? "Logg inn som testutvikler"
              : "Logg inn med Microsoft"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Kun for ansatte i Straye Gruppen AS
          </p>

          {/* Auth mode toggle - only visible in development */}
          <AuthModeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main
          className={cn(
            "flex-1 bg-background",
            disableScroll ? "overflow-hidden" : "overflow-y-auto"
          )}
        >
          <ErrorBoundary>
            {disableScroll ? (
              children
            ) : (
              <div className="mx-auto w-full max-w-[1920px] px-4 py-3 md:px-8">
                {children}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
