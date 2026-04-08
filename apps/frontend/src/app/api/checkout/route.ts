import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  STRIPE_PRODUCTS,
  STRIPE_MAINTENANCE_SUBSCRIPTION,
  STRIPE_TRIPWIRE,
  type StripePlan,
} from "@/lib/stripe-products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email } = body as { plan: string; email?: string };

    if (!plan) {
      return NextResponse.json({ error: "Plan manquant." }, { status: 400 });
    }

    const isMaintenance = plan === "pro-maintenance";
    const isAudit = plan === "audit";
    const product = isAudit
      ? STRIPE_TRIPWIRE
      : isMaintenance
        ? STRIPE_MAINTENANCE_SUBSCRIPTION
        : STRIPE_PRODUCTS[plan as StripePlan];

    const key = process.env.STRIPE_SECRET_KEY || "";
    console.log(`[Checkout] Plan: ${plan}, isAudit: ${isAudit}, Product found: ${!!product}, Key length: ${key.length}`);

    if (key.length < 10) {
      console.error("[Checkout] CRITICAL: STRIPE_SECRET_KEY is empty or too short!");
    }

    if (!product) {
      return NextResponse.json({ error: `Produit invalide: ${plan}` }, { status: 400 });
    }

    const origin =
      request.headers.get("origin") || "https://www.aissabelkoussa.fr";

    console.log(`[Checkout] Creating session for ${product.name} (Price: ${product.priceId}) from origin: ${origin}`);

    const session = await stripe.checkout.sessions.create({
      mode: product.mode,
      payment_method_types: ["card"],
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${origin}/checkout/upsell?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/services`,
      locale: "fr",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: { plan },
      ...(email && { customer_email: email }),
    });

    console.log(`[Checkout] Session created: ${session.id}`);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error 상세:", {
      message: error.message,
      stack: error.stack,
      raw: error,
    });
    return NextResponse.json(
      { error: `Erreur Stripe: ${error.message || "Erreur inconnue"}` },
      { status: 500 },
    );
  }
}
