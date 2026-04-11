import { NextResponse } from "next/server";
import { sendEmail, CONTACT_EMAIL } from "@/lib/email";
import { validateEmail } from "@/lib/email-validator";
import { isBot } from "@/lib/honeypot";
import { buildUnsubscribeUrl } from "@/lib/newsletter-token";
import {
  newsletterAdminTemplate,
  newsletterWelcomeTemplate,
} from "@/lib/email-templates";

const SITE_URL = "https://www.aissabelkoussa.fr";

// In-memory rate limit (5 req / 15min / IP). Replaced by Upstash in a later plan.
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

function safeUnsubscribeUrl(email: string): string | null {
  try {
    return buildUnsubscribeUrl(SITE_URL, email);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: silently accept bot submissions to avoid tipping them off.
  if (isBot(body)) {
    return NextResponse.json({ success: true });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = typeof body.source === "string" ? body.source : "footer";

  const validation = validateEmail(email);
  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid email", reason: validation.reason },
      { status: 400 }
    );
  }

  const nowFr = new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  // 1. Admin notification
  const adminTpl = newsletterAdminTemplate({ email, source, nowFr });
  const adminResult = await sendEmail({
    to: CONTACT_EMAIL,
    subject: adminTpl.subject,
    html: adminTpl.html,
    replyTo: email,
    tag: "newsletter-admin",
  });

  if (!adminResult.ok) {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }

  // 2. Welcome to subscriber (non-blocking)
  const unsubUrl = safeUnsubscribeUrl(email);
  const welcomeTpl = newsletterWelcomeTemplate({
    email,
    unsubscribeUrl: unsubUrl,
  });
  sendEmail({
    to: email,
    subject: welcomeTpl.subject,
    html: welcomeTpl.html,
    unsubscribeUrl: unsubUrl ?? undefined,
    tag: "newsletter-welcome",
  }).catch((err) => {
    console.warn("[newsletter] welcome email failed:", err);
  });

  return NextResponse.json({ success: true });
}
