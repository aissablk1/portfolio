import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Payment OK:", session.metadata?.plan, session.customer_details?.email, session.amount_total);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
