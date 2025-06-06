import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { UserSettings } from "@/components/dashboard/user-settings";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { UsageStats } from "@/components/dashboard/usage-stats";

// Make page dynamic
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  
  let user: any = null;
  let userData: any = null;
  let preferencesData: any = null;
  let subscriptionData: any = null;

  try {
    // Get the current user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      redirect("/sign-in");
    }

    user = authUser;

    // Get user profile with error handling
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (!error) {
        userData = data;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    // Get user preferences with error handling
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (!error) {
        preferencesData = data;
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }

    // Get user subscription with error handling
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

  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/sign-in");
  }

  async function createPortalSession() {
    "use server";
    
    if (!subscriptionData?.stripe_customer_id) {
      console.error("No subscription found");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create-portal-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies().toString(),
        },
      });

      const data = await response.json();
      
      if (data.url) {
        redirect(data.url);
      } else {
        console.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
    }
  }

  return (
    <DashboardShell user={userData}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-6">
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your account, subscription, and settings
          </p>
        </div>
        
        <div className="md:col-span-4">
          <UsageStats plan={subscriptionData?.plan || "free"} />
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <SubscriptionInfo 
            subscription={{
              id: subscriptionData?.id || "",
              plan: subscriptionData?.plan || "free",
              status: subscriptionData?.status || "inactive",
              current_period_end: subscriptionData?.current_period_end || "",
              cancel_at_period_end: subscriptionData?.cancel_at_period_end || false,
            }}
            createPortalSession={createPortalSession}
          />
          
          <UserSettings
            user={userData || { id: user?.id || "", email: user?.email || "", full_name: null }}
            preferences={preferencesData || { notifications_enabled: true, theme: "light" }}
          />
        </div>
      </div>
    </DashboardShell>
  );
}