"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { STRIPE_PRODUCTS, StripeProduct } from "@/src/stripe-config";

interface PaymentButtonProps {
  product: keyof typeof STRIPE_PRODUCTS;
  variant?: "default" | "outline" | "secondary";
}

export function PaymentButton({ product, variant = "default" }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const productDetails = STRIPE_PRODUCTS[product];

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: productDetails.priceId,
          mode: productDetails.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      variant={variant}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Subscribe to ${productDetails.name}`
      )}
    </Button>
  );
}