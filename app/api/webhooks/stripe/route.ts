import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session | Stripe.BillingPortal.Session;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created
      if (session.mode === "subscription") {
        const subscriptionId = session.subscription as string;
        
        // Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Get customer details
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        
        // Get user email from Stripe customer
        const userEmail = typeof customer === 'object' ? customer.email : null;
        
        if (!userEmail) {
          return new NextResponse("Customer email not found", { status: 400 });
        }
        
        // Get user from Supabase
        const { data: userData, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", userEmail)
          .single();
        
        if (userError || !userData) {
          return new NextResponse("User not found", { status: 404 });
        }
        
        // Determine the plan based on the price ID
        const priceId = subscription.items.data[0].price.id;
        const productId = subscription.items.data[0].price.product as string;
        const product = await stripe.products.retrieve(productId);
        
        // Get the plan name from the product metadata or name
        const planName = product.metadata.plan || 
                         product.name?.toLowerCase().includes("basic") ? "basic" :
                         product.name?.toLowerCase().includes("pro") ? "pro" : "basic";
        
        // Update or create subscription record in Supabase
        const { error: subscriptionError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: userData.id,
            status: subscription.status,
            plan: planName,
            price_id: priceId,
            quantity: subscription.items.data[0].quantity || 1,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            created_at: new Date().toISOString(),
            ended_at: subscription.ended_at 
              ? new Date(subscription.ended_at * 1000).toISOString() 
              : null,
            trial_start: subscription.trial_start 
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            trial_end: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          });
        
        if (subscriptionError) {
          console.error("Error saving subscription:", subscriptionError);
          return new NextResponse("Error saving subscription", { status: 500 });
        }
      }
      break;
      
    case "invoice.payment_succeeded":
      // Handle successful recurring payments
      // Update subscription status and period end date
      break;
      
    case "customer.subscription.updated":
      // Handle subscription updates (upgrades, downgrades, cancellations)
      break;
      
    case "customer.subscription.deleted":
      // Handle subscription cancellations or expirations
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}