import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/logger";

async function stripeGet(path: string): Promise<any> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not defined");

  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      "Authorization": `Bearer ${key}`,
      "Stripe-Version": "2025-01-27.acacia",
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || "Stripe API error");
    (err as any).statusCode = res.status;
    throw err;
  }
  return data;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id manquant" },
      { status: 400 },
    );
  }

  try {
    const session = await stripeGet(`/checkout/sessions/${sessionId}`);

    if (session.payment_status === "paid") {
      return NextResponse.json({
        status: "paid",
        plan: session.metadata?.plan,
      });
    }

    return NextResponse.json(
      { error: "Paiement non confirme" },
      { status: 402 },
    );
  } catch (error: any) {
    Logger.error("Verify session error", { message: error.message });
    return NextResponse.json(
      { error: "Session introuvable" },
      { status: 404 },
    );
  }
}
