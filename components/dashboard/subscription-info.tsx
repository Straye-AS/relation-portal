"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/utils";
import { ArrowRight, CheckCircle, CreditCard, Loader2 } from "lucide-react";

interface SubscriptionInfoProps {
  subscription: {
    id: string;
    plan: SubscriptionPlan;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
  createPortalSession: () => Promise<void>;
}

export function SubscriptionInfo({ subscription, createPortalSession }: SubscriptionInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      await createPortalSession();
    } catch (error) {
      console.error("Error creating portal session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription</span>
          <Badge variant={subscription.status === "active" ? "default" : "outline"}>
            {subscription.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>Manage your subscription and billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Current plan</div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium capitalize">{subscription.plan}</span>
            {subscription.cancel_at_period_end && (
              <Badge variant="outline" className="text-muted-foreground">
                Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>

        {subscription.plan === SUBSCRIPTION_PLANS.FREE && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Upgrade to get more features</h4>
                <p className="text-sm text-muted-foreground">
                  Unlock advanced features and higher usage limits with our paid plans.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {subscription.plan !== SUBSCRIPTION_PLANS.FREE ? (
          <Button variant="outline\" onClick={handleManageSubscription} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleUpgrade}>
            Upgrade Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}