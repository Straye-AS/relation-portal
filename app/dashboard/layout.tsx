"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browserClient";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { LogOut, Menu, PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Get page title from pathname
  const getPageTitle = () => {
    const path = (pathname ?? "").split('/').pop();
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
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
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar 
          user={user} 
          subscriptionData={subscriptionData} 
          onSignOut={handleSignOut} 
        />
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Mobile Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 lg:hidden border-b">
            <SidebarTrigger className="-ml-1" />
            <ThemeToggle />
            <div className="flex-1" />
            <NavUser
              user={{
                name: user.user_metadata?.full_name || user.email,
                email: user.email,
                avatar: user.user_metadata?.avatar_url
              }}
              subscriptionData={subscriptionData}
              onSignOut={handleSignOut}
            />
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4">
            <div className="w-full min-h-full rounded-xl border bg-card text-card-foreground shadow-sm p-6 dark:bg-black">
              <div className="flex items-center justify-between mb-6">
                <div className="hidden lg:flex items-center gap-2 border-b w-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="h-4 w-px bg-gray-200" />
                  <h1 className="text-sm">{getPageTitle()}</h1>
                  <Link href="https://buy.stripe.com/00w28sgaE73OfzD4RRcAo0A">
          <Button variant="default" size="sm" className="rounded-full bg-red-500 hover:bg-red-600 text-white">Buy Boilerplate</Button>
          </Link>
                </div>
                
              </div>
              <div>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 