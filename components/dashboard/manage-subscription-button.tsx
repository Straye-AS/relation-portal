"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Subscription {
  id: string;
  stripe_customer_id: string | null;
  status: string;
  plan: string;
}

interface ManageSubscriptionButtonProps {
  subscription: Subscription | null;
}

export function ManageSubscriptionButton({ subscription }: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePortalAccess = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/create-portal-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Error accessing billing portal');
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handlePortalAccess}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Manage Subscription in Stripe"}
    </Button>
  );
} 