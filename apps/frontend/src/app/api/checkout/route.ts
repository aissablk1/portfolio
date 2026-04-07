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
      return NextResponse.json({ error: "Plan manquant" }, { status: 400 });
    }

    // Gestion des plans speciaux
    const isMaintenance = plan === "pro-maintenance";
    const isAudit = plan === "audit";
    const product = isAudit
      ? STRIPE_TRIPWIRE
      : isMaintenance
        ? STRIPE_MAINTENANCE_SUBSCRIPTION
        : STRIPE_PRODUCTS[plan as StripePlan];

    if (!product) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const origin =
      request.headers.get("origin") || "https://www.aissabelkoussa.fr";

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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la session." },
      { status: 500 },
    );
  }
}
