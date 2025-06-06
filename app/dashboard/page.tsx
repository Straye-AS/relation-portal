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

    return (
      <div className="container mx-auto py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}!
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Projects</h3>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Active projects</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Storage</h3>
              <p className="text-2xl font-bold">0.5 GB</p>
              <p className="text-sm text-muted-foreground">Used storage</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">API Calls</h3>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Plan</h3>
              <p className="text-2xl font-bold">Free</p>
              <p className="text-sm text-muted-foreground">Current plan</p>
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