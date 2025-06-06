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

    // Determine plan limits based on current plan
    const currentPlan = subscriptionData?.plan || 'free';
    const storageLimit = currentPlan === 'free' ? 1 : currentPlan === 'basic' ? 10 : currentPlan === 'pro' ? 50 : 100;
    const projectsLimit = currentPlan === 'free' ? 2 : currentPlan === 'basic' ? 10 : currentPlan === 'pro' ? 50 : 100;
    const apiLimit = currentPlan === 'free' ? 10000 : currentPlan === 'basic' ? 50000 : currentPlan === 'pro' ? 500000 : 1000000;

    // Mock current usage (in a real app, this would come from your analytics)
    const currentUsage = {
      projects: currentPlan === 'free' ? 1 : 4,
      storage: currentPlan === 'free' ? 0.3 : 2.5,
      apiCalls: currentPlan === 'free' ? 2500 : 15000,
    };

    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}!
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
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
                  /{projectsLimit === 100 && currentPlan !== 'free' ? '∞' : projectsLimit}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Active projects</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min((currentUsage.projects / projectsLimit) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Storage</h3>
              <p className="text-2xl font-bold">
                {currentUsage.storage} GB
                <span className="text-sm font-normal text-muted-foreground">
                  /{storageLimit} GB
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Used storage</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min((currentUsage.storage / storageLimit) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">API Calls</h3>
              <p className="text-2xl font-bold">
                {currentUsage.apiCalls.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  /{apiLimit.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">This month</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min((currentUsage.apiCalls / apiLimit) * 100, 100)}%` 
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
                  : 'Current plan'
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

          {/* Quick Actions */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <a 
                href="/pricing"
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">Upgrade Plan</p>
                  <p className="text-sm text-muted-foreground">Get more features</p>
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