import { cookies } from "next/headers";
import { NextResponse } from "next/response";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user's subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError || !subscription?.stripe_customer_id) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    // Create a Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${request.headers.get("origin")}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}