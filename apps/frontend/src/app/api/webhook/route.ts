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
      const email = session.customer_details?.email;
      const customerName = session.customer_details?.name || "";
      const plan = session.metadata?.plan || "";
      const amount = session.amount_total || 0;

      // Trigger post-purchase email sequence via backend
      const backendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
      if (backendUrl && email) {
        fetch(`${backendUrl}/api/sequences/trigger`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: customerName,
            sequence_type: "post_purchase",
            trigger_data: { plan, amount, session_id: session.id },
          }),
        }).catch(() => {});

        // Log funnel event
        fetch(`${backendUrl}/api/tracker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: `/checkout/purchase/${plan}`, referrer: "stripe-webhook" }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
