import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Make page dynamic
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/sign-in");
    }

    // Get user subscription data
    let subscriptionData = null;
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (!error) {
        subscriptionData = data;
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
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
            price: '$9.90/month'
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
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}!
            </p>
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
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
            
            <div className="rounded-lg border bg-card p-6">
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
            
            <div className="rounded-lg border bg-card p-6">
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
            
            <div className="rounded-lg border bg-card p-6">
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
          <div className="rounded-lg border bg-card p-6">
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
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <a 
                href="/pricing"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">Account Settings</p>
                  <p className="text-sm text-muted-foreground">Manage your account</p>
                </div>
                <span className="text-blue-600">→</span>
              </a>
              
              <a 
                href="/docs"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
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
    );

  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/sign-in");
  }
}