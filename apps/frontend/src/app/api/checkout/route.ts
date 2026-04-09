import { NextRequest, NextResponse } from "next/server";
import {
  STRIPE_PRODUCTS,
  STRIPE_MAINTENANCE_SUBSCRIPTION,
  STRIPE_TRIPWIRE,
  type StripePlan,
} from "@/lib/stripe-products";
import { Logger } from "@/lib/logger";

/**
 * Create a Stripe Checkout Session via raw fetch (bypasses SDK bundling issues on Vercel).
 */
async function createCheckoutSession(params: Record<string, unknown>): Promise<{ id: string; url: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not defined");

  // Encode params as application/x-www-form-urlencoded (Stripe API format)
  const body = encodeStripeParams(params);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2025-01-27.acacia",
    },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error?.message || "Stripe API error");
    (err as any).type = data.error?.type;
    (err as any).code = data.error?.code;
    (err as any).param = data.error?.param;
    (err as any).statusCode = res.status;
    throw err;
  }

  return data;
}

/** Encode nested params to Stripe's form format: line_items[0][price]=xxx */
function encodeStripeParams(obj: Record<string, unknown>, prefix = ""): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === null || value === undefined) continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      parts.push(encodeStripeParams(value as Record<string, unknown>, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          parts.push(encodeStripeParams(item as Record<string, unknown>, `${fullKey}[${i}]`));
        } else {
          parts.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else {
      parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.filter(Boolean).join("&");
}

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

    if (!product) {
      Logger.error(`Produit introuvable pour le plan: ${plan}`);
      return NextResponse.json({ error: `Produit invalide: ${plan}` }, { status: 400 });
    }

    const rawOrigin = request.headers.get("origin") || "https://www.aissabelkoussa.fr";
    const origin = rawOrigin.endsWith("/") ? rawOrigin.slice(0, -1) : rawOrigin;

    const sessionParams: Record<string, unknown> = {
      mode: product.mode,
      "line_items[0][price]": product.priceId,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/checkout/upsell?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/services`,
      locale: "fr",
      allow_promotion_codes: "true",
      billing_address_collection: "required",
      "metadata[plan]": plan,
    };

    if (email && typeof email === "string" && email.trim().length > 0) {
      sessionParams.customer_email = email.trim();
    }

    Logger.info(`Checkout pour: ${plan}`, { product: product.name, origin });

    const session = await createCheckoutSession(sessionParams);

    Logger.info(`Session Stripe creee: ${session.id}`);

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
