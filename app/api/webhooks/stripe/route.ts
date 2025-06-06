import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Price ID to plan mapping from stripe-config.ts
const PRICE_TO_PLAN: Record<string, string> = {
  'price_1RPPbbJoSiKWb2MdXbffcx7E': 'basic',   // Basic - $9.90
  'price_1RQbkYJoSiKWb2MdEF3JsP1z': 'plus',    // Plus - $29
  'price_1RQblqJoSiKWb2MdyUKmYj9O': 'elite',   // Elite - $49
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          // Refresh subscription data when payment succeeds
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await handleSubscriptionChange(sub);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const supabase = createClient();
  
  if (session.mode === 'subscription' && session.subscription) {
    // Handle subscription checkout
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await handleSubscriptionChange(subscription);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const supabase = createClient();
  const customerId = subscription.customer as string;
  
  try {
    // Get user_id from stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .single();

    if (customerError || !customerData) {
      console.error('Error finding user for customer:', customerError);
      return;
    }

    const userId = customerData.user_id;
    const priceId = subscription.items.data[0]?.price.id;
    const planName = PRICE_TO_PLAN[priceId] || 'free';

    // Update stripe_subscriptions table
    const { error: stripeSubError } = await supabase
      .from('stripe_subscriptions')
      .upsert({
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: priceId,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, {
        onConflict: 'customer_id',
      });

    // Update main subscriptions table
    const { error: mainSubError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        plan: planName,
        status: subscription.status === 'active' ? 'active' : 'inactive',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, {
        onConflict: 'user_id',
      });

    if (stripeSubError) {
      console.error('Error updating stripe_subscriptions:', stripeSubError);
    }

    if (mainSubError) {
      console.error('Error updating main subscriptions:', mainSubError);
    } else {
      console.log(`✅ Successfully updated subscription for user ${userId}: plan=${planName}, status=${subscription.status}`);
    }

  } catch (error) {
    console.error('Error in handleSubscriptionChange:', error);
  }
} 