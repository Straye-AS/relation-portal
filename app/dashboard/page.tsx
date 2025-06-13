"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browserClient";

// Make page dynamic
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
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
      }

      setLoading(false);
    }

    getUser();
  }, [supabase]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}!
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="font-semibold">Projects</h3>
          <p className="text-2xl">
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
          <p className="text-2xl">
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
          <p className="text-2xl">
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
          <p className="text-2xl capitalize">{currentPlan}</p>
          <p className="text-sm text-muted-foreground">
            {subscriptionData?.current_period_end 
              ? `Renews ${new Date(subscriptionData.current_period_end).toLocaleDateString()}`
              : planLimits.price
            }
          </p>
          {currentPlan === 'free' && (
            <div className="mt-2">
              <Link 
                href="/pricing"
                className="text-xs text-blue-600 hover:text-blue-500 font-medium"
              >
                Upgrade Plan →
              </Link>
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
          <Link 
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
          </Link>
          
          <Link 
            href="/dashboard/settings"
            className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-[#101010] transition-colors"
          >
            <div>
              <p className="font-medium">Account Settings</p>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
            <span className="text-blue-600">→</span>
          </Link>
          
          <Link 
            href="https://docs.neosaas.dev"
            target="_blank"
            className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 dark:hover:bg-[#101010] transition-colors"
          >
            <div>
              <p className="font-medium">Documentation</p>
              <p className="text-sm text-muted-foreground">Learn how to use</p>
            </div>
            <span className="text-blue-600">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}