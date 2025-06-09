"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browserClient";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingSection } from "@/components/pricing/pricing-section";
import { SUBSCRIPTION_PLANS, SubscriptionPlan, PRICES } from "@/lib/utils";
import { toast } from "sonner";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const canceled = searchParams.get("canceled");
  const success = searchParams.get("success");

  useEffect(() => {
    if (success) {
      toast.success("Subscription updated successfully!");
    }
    if (canceled) {
      toast.info("Subscription update canceled.");
    }
  }, [success, canceled]);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        // Get user's subscription
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (!error && data) {
          setSubscription(data);
        }
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [supabase]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    if (plan === SUBSCRIPTION_PLANS.FREE) {
      return;
    }

    try {
      // Determine price ID (in a real app, these would come from your Stripe dashboard)
      const isYearly = true; // Default to yearly for this example
      const priceId = isYearly 
        ? `price_${plan}_yearly` // These would be actual Stripe price IDs
        : `price_${plan}_monthly`;
      
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          plan,
          isYearly,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-grow pt-24">
        <PricingSection 
          currentPlan={subscription?.plan || SUBSCRIPTION_PLANS.FREE}
          onSelectPlan={handleSelectPlan}
        />
      </main>
      <Footer />
    </div>
  );
}