"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Make page dynamic
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
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

  // Determine plan limits based on current plan (Free, Basic, Plus, Elite)
  const currentPlan = subscriptionData?.plan || 'free';
  
  // Plan limits based on stripe-config.ts
  const getPlanLimits = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return {
          projects: 2,
          storage: 1, // 1GB
          apiCalls: 10000,
          price: '$99/month'
        };
      case 'plus':
        return {
          projects: 10,
          storage: 10, // 10GB
          apiCalls: 100000,
          price: '$29/month'
        };
      case 'elite':
        return {
          projects: -1, // Unlimited
          storage: 100, // 100GB
          apiCalls: 1000000,
          price: '$49/month'
        };
      default: // free
        return {
          projects: 1,
          storage: 0.5, // 500MB
          apiCalls: 1000,
          price: 'Free'
        };
    }
  };

  const planLimits = getPlanLimits(currentPlan);

  // Mock current usage (in a real app, this would come from your analytics)
  const getCurrentUsage = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return { projects: 1, storage: 0.3, apiCalls: 2500 };
      case 'plus':
        return { projects: 4, storage: 2.5, apiCalls: 25000 };
      case 'elite':
        return { projects: 15, storage: 35, apiCalls: 250000 };
      default: // free
        return { projects: 1, storage: 0.2, apiCalls: 450 };
    }
  };

  const currentUsage = getCurrentUsage(currentPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar - Sol taraf */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-950 border-r border-border z-50 overflow-y-auto">
        <div className="p-6">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Menu</h2>
                <p className="text-sm text-muted-foreground">{user.user_metadata.full_name}</p>
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
            <a href="/dashboard" className="flex items-center justify-between p-3 rounded-lg bg-primary/10 text-primary">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-3" />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/dashboard/analytics" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-3" />
                <span>Analytics</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-3" />
                <span>Billing</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/dashboard/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-3" />
                <span>Profile</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/dashboard/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-3" />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/docs" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-3" />
                <span>Documentation</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
            
            <a href="/support" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-3" />
                <span>Support</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>
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
            <p className="text-sm text-muted-foreground">{user.user_metadata.full_name}</p>
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
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.user_metadata.full_name}!
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">Projects</h3>
                <p className="text-2xl font-bold">
                  {currentUsage.projects}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{planLimits.projects === -1 ? '∞' : planLimits.projects}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">Active projects</p>
                {planLimits.projects !== -1 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((currentUsage.projects / planLimits.projects) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">Storage</h3>
                <p className="text-2xl font-bold">
                  {currentUsage.storage} GB
                  <span className="text-sm font-normal text-muted-foreground">
                    /{planLimits.storage} GB
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">Used storage</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((currentUsage.storage / planLimits.storage) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">API Calls</h3>
                <p className="text-2xl font-bold">
                  {currentUsage.apiCalls.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{planLimits.apiCalls.toLocaleString()}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">This month</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((currentUsage.apiCalls / planLimits.apiCalls) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">Subscription</h3>
                <p className="text-2xl font-bold capitalize">{currentPlan}</p>
                <p className="text-sm text-muted-foreground">
                  {subscriptionData?.current_period_end 
                    ? `Renews ${new Date(subscriptionData.current_period_end).toLocaleDateString()}`
                    : planLimits.price
                  }
                </p>
                {currentPlan === 'free' && (
                  <div className="mt-2">
                    <a 
                      href="/pricing"
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Upgrade Plan →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Plan Features */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-semibold mb-4">Current Plan Features</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">
                      {planLimits.projects === -1 ? 'Unlimited projects' : `Up to ${planLimits.projects} projects`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{planLimits.storage} GB storage</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">{planLimits.apiCalls.toLocaleString()} API calls/month</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">
                      {currentPlan === 'free' 
                        ? 'Community support' 
                        : currentPlan === 'basic'
                        ? 'Community support'
                        : currentPlan === 'plus'
                        ? 'Email support'
                        : 'Priority support'
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">
                      {currentPlan === 'elite' ? 'Advanced analytics' : 'Basic analytics'}
                    </span>
                  </div>
                  {currentPlan === 'elite' && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">SSO authentication</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <a 
                  href="/pricing"
                  className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-[#101010] transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan === 'free' ? 'Get more features' : 'View all plans'}
                    </p>
                  </div>
                  <span className="text-blue-600">→</span>
                </a>
                
                <a 
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-[#101010] transition-colors"
                >
                  <div>
                    <p className="font-medium">Account Settings</p>
                    <p className="text-sm text-muted-foreground">Manage your account</p>
                  </div>
                  <span className="text-blue-600">→</span>
                </a>
                
                <a 
                  href="/docs"
                  className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-[#101010] transition-colors"
                >
                  <div>
                    <p className="font-medium">Documentation</p>
                    <p className="text-sm text-muted-foreground">Learn how to use</p>
                  </div>
                  <span className="text-blue-600">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}