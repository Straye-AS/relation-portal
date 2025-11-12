"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect } from "react";

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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Straye Relation</h1>
            <p className="mt-2 text-muted-foreground">
              Intern CRM og tilbudshåndtering
            </p>
          </div>

          <Button onClick={login} className="w-full" size="lg">
            Logg inn med Microsoft
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Kun for ansatte i Straye Group
          </p>
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
          <div className="container mx-auto py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
