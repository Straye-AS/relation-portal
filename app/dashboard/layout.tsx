"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  User, 
  FileText,
  HelpCircle,
  ChevronRight
} from "lucide-react";
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
  const pathname = usePathname();
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

  const currentPlan = subscriptionData?.plan || 'free';

  // Navigation items with active state check
  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/pricing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/docs", label: "Documentation", icon: FileText },
    { href: "/support", label: "Support", icon: HelpCircle },
  ];

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
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar - Sol taraf */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 border-r border-border z-50 overflow-y-auto">
        <div className="p-6">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Menu</h2>
                <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || user.email}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                currentPlan === 'free' 
                  ? 'bg-gray-50 text-gray-700 ring-gray-600/20'
                  : currentPlan === 'basic'
                  ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                  : currentPlan === 'plus'
                  ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                  : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
              }`}>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
              </span>
              {subscriptionData?.status && (
                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  subscriptionData.status === 'active' 
                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                    : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                }`}>
                  {subscriptionData.status}
                </span>
              )}
            </div>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link 
                  key={href}
                  href={href} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-3" />
                    <span className={isActive ? 'font-medium' : ''}>{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="pt-6 border-t">
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Sağ taraf */}
      <div className="lg:ml-80">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-950 border-b border-border p-4 flex items-center justify-between">
          <div>
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
        </div>
        
        <div className="px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 