"use client";

import { Button } from "@/components/ui/button";

export function StripePortalButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.location.href = 'https://billing.stripe.com/p/login/test_4gM5kF5Z39hCeOkdiU5EY00'}
    >
      Manage Subscription
    </Button>
  );
} 