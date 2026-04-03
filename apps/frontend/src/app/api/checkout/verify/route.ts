import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id manquant" },
      { status: 400 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

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
  } catch {
    return NextResponse.json(
      { error: "Session introuvable" },
      { status: 404 },
    );
  }
}
