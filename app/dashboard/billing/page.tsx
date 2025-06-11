import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ManageSubscriptionButton } from "@/components/dashboard/manage-subscription-button";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get user's subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Profile Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="font-medium">Plan</span>
                <span className="capitalize">{subscription?.plan || 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status</span>
                <span className="capitalize">{subscription?.status || 'inactive'}</span>
              </div>
              {subscription?.current_period_end && (
                <div className="flex justify-between">
                  <span className="font-medium">Next billing date</span>
                  <span>
                    {format(new Date(subscription.current_period_end), 'MMMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ManageSubscriptionButton subscription={subscription} />
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
     
    </div>
  );
} 