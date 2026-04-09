import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  STRIPE_PRODUCTS,
  STRIPE_MAINTENANCE_SUBSCRIPTION,
  STRIPE_TRIPWIRE,
  type StripePlan,
} from "@/lib/stripe-products";
import { Logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email } = body as { plan: string; email?: string };

    if (!plan) {
      Logger.error("Plan manquant dans la requete");
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
    Logger.info(`Tentative de checkout pour: ${plan}`, { 
      isAudit, 
      productFound: !!product, 
      keyLength: key.length 
    });

    if (key.length < 10) {
      Logger.error("STRIPE_SECRET_KEY est manquant ou trop court dans cet environnement.");
    }

    if (!product) {
      Logger.error(`Produit introuvable pour le plan: ${plan}`);
      return NextResponse.json({ error: `Produit invalide: ${plan}` }, { status: 400 });
    }

    // Sanitize origin: remove trailing slash for Stripe consistency
    const rawOrigin = request.headers.get("origin") || "https://www.aissabelkoussa.fr";
    const origin = rawOrigin.endsWith("/") ? rawOrigin.slice(0, -1) : rawOrigin;

    const sessionParams: any = {
      mode: product.mode,
      line_items: [{ price: product.priceId, quantity: 1 }],
      success_url: `${origin}/checkout/upsell?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/services`,
      locale: "fr",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: { plan },
    };

    // Ensure email is a valid non-empty string
    if (email && typeof email === 'string' && email.trim().length > 0) {
      sessionParams.customer_email = email.trim();
    }

    // Diagnostic log for Phase 4 (sanitized)
    Logger.info("Creation de la session Stripe avec les parametres (simplifies):", {
      ...sessionParams,
      success_url: sessionParams.success_url.replace(/plan=([^&]+)/, "plan=***"),
    });

    const session = await stripe.checkout.sessions.create(sessionParams);

    Logger.info(`Session Stripe creee avec succes: ${session.id}`);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    Logger.error("Stripe checkout error", {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      statusCode: error.statusCode,
    });
    return NextResponse.json(
      { error: `Erreur Stripe: ${error.message || "Erreur inconnue"}` },
      { status: 500 },
    );
  }
}
