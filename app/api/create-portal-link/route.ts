import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get customer from database
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // If no customer ID exists, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Update the subscription record with the new customer ID
      await supabase
        .from('subscriptions')
        .update({ 
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    }

    // Verify customer exists in Stripe
    try {
      await stripe.customers.retrieve(customerId);
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        // Customer doesn't exist in Stripe, create a new one
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
          },
        });
        customerId = customer.id;

        // Update the subscription record with the new customer ID
        await supabase
          .from('subscriptions')
          .update({ 
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        throw error;
      }
    }

    // Create portal link
    const { url } = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Error creating portal link:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 