import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/logger";
import crypto from "crypto";

function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [k, v] = part.split("=");
    if (k === "t") acc.timestamp = v;
    if (k === "v1") acc.signatures.push(v);
    return acc;
  }, { timestamp: "", signatures: [] as string[] });

  if (!parts.timestamp || parts.signatures.length === 0) return false;

  const signedPayload = `${parts.timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return parts.signatures.some((sig) => crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  try {
    if (!verifyStripeSignature(body, signature, secret)) {
      Logger.error("Invalid Stripe webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email;
      const customerName = session.customer_details?.name || "";
      const plan = session.metadata?.plan || "";
      const amount = session.amount_total || 0;

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
        }).catch((err) => Logger.error("Post-purchase trigger failed", { message: err.message }));

        fetch(`${backendUrl}/api/tracker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: `/checkout/purchase/${plan}`, referrer: "stripe-webhook" }),
        }).catch((err) => Logger.error("Tracker event failed", { message: err.message }));
      }

      Logger.info(`Webhook: checkout completed for ${plan}`, { email: email?.replace(/(.{2}).*@/, "$1***@") });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    Logger.error("Webhook processing error", { message: error.message });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
