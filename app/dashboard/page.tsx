import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { UserSettings } from "@/components/dashboard/user-settings";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { UsageStats } from "@/components/dashboard/usage-stats";

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user profile
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
  }

  // Get user preferences
  const { data: preferencesData, error: preferencesError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (preferencesError) {
    console.error("Error fetching preferences:", preferencesError);
  }

  // Get user subscription
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (subscriptionError) {
    console.error("Error fetching subscription:", subscriptionError);
  }

  async function createPortalSession() {
    "use server";
    
    if (!subscriptionData?.stripe_customer_id) {
      return { error: "No subscription found" };
    }

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
    }

    return { error: "Failed to create portal session" };
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
            user={userData || { id: user.id, email: user.email || "", full_name: null }}
            preferences={preferencesData || { notifications_enabled: true, theme: "light" }}
          />
        </div>
      </div>
    </DashboardShell>
  );
}