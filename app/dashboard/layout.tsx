"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      setUser(session.user);

      // Get subscription data
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (!error) {
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }

      setLoading(false);
    }

    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear any existing session state
      setUser(null);
      setSubscriptionData(null);
      
      // For development: Clear all storage
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Clearing storage...');
        localStorage.clear();
        sessionStorage.clear();
        // Clear all cookies
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Ensures local session is cleared
      });
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Even if there's an error, try to redirect
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Clear any cached data and force redirect
      window.location.href = '/';
      
    } catch (error) {
      console.error('SignOut catch error:', error);
      // Force redirect even if there's an error
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        user={user} 
        subscriptionData={subscriptionData} 
        onSignOut={handleSignOut} 
      />
      <main className="flex flex-col w-full">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 lg:hidden border-b">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h2 className="font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        {/* Desktop Header with Trigger */}
        <header className="hidden lg:flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        
        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
} 