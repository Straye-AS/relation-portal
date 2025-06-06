import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          await handleSubscription(session, supabase);
        } else {
          await handleOneTimePayment(session, supabase);
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription.customer as string, supabase);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await syncSubscription(invoice.customer as string, supabase);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleSubscription(session: Stripe.Checkout.Session, supabase: any) {
  const customerId = session.customer as string;
  
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
  
  // Get the subscription details
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
  });

  if (subscriptions.data.length > 0) {
    const subscription = subscriptions.data[0];
      
    // Update stripe_subscriptions table
    const { error: stripeSubError } = await supabase
      .from('stripe_subscriptions')
      .upsert({
        customer_id: customerId,
        user_id: userId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0].price.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, {
        onConflict: 'customer_id',
      });

    if (stripeSubError) {
      console.error('Error updating stripe_subscriptions:', stripeSubError);
    }

    // Update user subscription
    await updateUserSubscription(customerId, subscription, supabase);
  }
}

async function handleOneTimePayment(session: Stripe.Checkout.Session, supabase: any) {
  const customerId = session.customer as string;
  
  // Insert order record
  const { error } = await supabase
    .from('stripe_orders')
    .insert({
      checkout_session_id: session.id,
      payment_intent_id: session.payment_intent,
      customer_id: customerId,
      amount_subtotal: session.amount_subtotal,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      status: 'completed',
    });

  if (error) {
    console.error('Error inserting stripe_orders:', error);
  }
}

async function syncSubscription(customerId: string, supabase: any) {
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

    // Get latest subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      
      // Update stripe_subscriptions table
      const { error: stripeError } = await supabase
        .from('stripe_subscriptions')
        .upsert({
          customer_id: customerId,
          user_id: userId,
          subscription_id: subscription.id,
          price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
        }, { onConflict: 'customer_id' });

      if (stripeError) {
        console.error('Error updating stripe_subscriptions:', stripeError);
      }

      // Update user subscription
      await updateUserSubscription(customerId, subscription, supabase);
    }
  } catch (error) {
    console.error('Error syncing subscription:', error);
  }
}

async function updateUserSubscription(customerId: string, subscription: Stripe.Subscription, supabase: any) {
  // Get user_id from stripe_customers
  const { data: customer } = await supabase
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .single();

  if (customer) {
    // Determine plan based on price
    let plan = 'free';
    const priceId = subscription.items.data[0].price.id;
    
    // Map price IDs to plans - CORRECTED MAPPING
    const priceToPlana = {
      'price_1RPPbbJoSiKWb2MdXbffcx7E': 'basic',  // Basic - $9.90
      'price_1RQbkYJoSiKWb2MdEF3JsP1z': 'plus',   // Plus - $29
      'price_1RQblqJoSiKWb2MdyUKmYj9O': 'elite',  // Elite - $49
    };

    plan = priceToPlana[priceId as keyof typeof priceToPlana] || 'free';

    // Update user subscription
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: customer.user_id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        plan: plan,
        status: subscription.status === 'active' ? 'active' : 'inactive',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating user subscription:', error);
    } else {
      console.log(`✅ Updated subscription for user ${customer.user_id} to ${plan} (status: ${subscription.status})`);
    }
  }
} 