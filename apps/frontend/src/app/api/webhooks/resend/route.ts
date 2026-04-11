import { NextResponse } from "next/server";
import crypto from "node:crypto";

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

type ResendEventType =
  | "email.sent"
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.bounced"
  | "email.complained"
  | "email.opened"
  | "email.clicked";

interface ResendEvent {
  type: ResendEventType;
  created_at: string;
  data: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    bounce?: { type?: string; subType?: string; message?: string };
    complaint?: { complaintFeedbackType?: string };
    tags?: Array<{ name: string; value: string }>;
  };
}

/**
 * Svix webhook signature verification.
 * Resend uses Svix for webhook delivery; signatures are in format "v1,<base64>".
 * Doc: https://docs.svix.com/receiving/verifying-payloads/how-manual
 */
function verifySignature(
  payload: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string
): boolean {
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false;

  // Svix secrets are prefixed with "whsec_" — strip it, then base64-decode.
  const secretBytes = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64"
  );

  const toSign = `${svixId}.${svixTimestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secretBytes)
    .update(toSign)
    .digest("base64");

  // The header may contain multiple signatures separated by spaces, each prefixed "v1,"
  const sigs = svixSignature.split(" ");
  for (const sig of sigs) {
    const [version, value] = sig.split(",");
    if (version !== "v1" || !value) continue;
    try {
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(value, "utf8");
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
    } catch {
      continue;
    }
  }

  return false;
}

export async function POST(request: Request) {
  // Fail-closed if no secret configured
  if (!WEBHOOK_SECRET) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET not set — rejecting");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id") || "";
  const svixTimestamp = request.headers.get("svix-timestamp") || "";
  const svixSignature = request.headers.get("svix-signature") || "";

  const rawBody = await request.text();

  if (!verifySignature(rawBody, svixId, svixTimestamp, svixSignature, WEBHOOK_SECRET)) {
    console.warn("[resend-webhook] invalid signature", {
      svixId,
      svixTimestamp,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Timestamp freshness check (5 min tolerance)
  const ts = parseInt(svixTimestamp, 10);
  if (Number.isFinite(ts)) {
    const ageSec = Math.abs(Date.now() / 1000 - ts);
    if (ageSec > 300) {
      console.warn("[resend-webhook] stale timestamp", { ageSec });
      return NextResponse.json({ error: "Stale" }, { status: 401 });
    }
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle events — for now, structured logging only.
  // Future: persist to a suppression_list table, trigger Sentry for complaints, etc.
  switch (event.type) {
    case "email.bounced": {
      const bounceType = event.data.bounce?.type ?? "unknown";
      console.error("[resend-webhook] BOUNCE", {
        email_id: event.data.email_id,
        to: event.data.to,
        subject: event.data.subject,
        bounce_type: bounceType,
        bounce_sub: event.data.bounce?.subType,
        message: event.data.bounce?.message,
        tags: event.data.tags,
        created_at: event.created_at,
      });
      // TODO(deferred): add to suppression list in DB
      break;
    }
    case "email.complained": {
      console.error("[resend-webhook] COMPLAINT", {
        email_id: event.data.email_id,
        to: event.data.to,
        subject: event.data.subject,
        feedback_type: event.data.complaint?.complaintFeedbackType,
        tags: event.data.tags,
        created_at: event.created_at,
      });
      // TODO(deferred): immediate suppression + Sentry alert
      break;
    }
    case "email.delivery_delayed": {
      console.warn("[resend-webhook] DELAYED", {
        email_id: event.data.email_id,
        to: event.data.to,
      });
      break;
    }
    case "email.delivered":
    case "email.sent":
    case "email.opened":
    case "email.clicked":
      // Non-critical — skip logging to avoid noise. Could aggregate later.
      break;
    default:
      console.log("[resend-webhook] unknown event", { type: event.type });
  }

  return NextResponse.json({ received: true });
}
