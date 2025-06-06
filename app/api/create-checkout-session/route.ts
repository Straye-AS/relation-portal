import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const { priceId, mode, success_url, cancel_url } = await request.json();

    if (!priceId || !mode || !success_url || !cancel_url) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Call the Stripe checkout edge function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url,
        cancel_url,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}