import { NextResponse } from "next/server";
import { sendEmail, CONTACT_EMAIL } from "@/lib/email";
import { validateEmail } from "@/lib/email-validator";
import { isBot } from "@/lib/honeypot";
import {
  contactAdminTemplate,
  contactConfirmTemplate,
} from "@/lib/email-templates";
import type {
  ContactPayload,
  LeadScore,
} from "@/lib/email-templates/contact-types";

// --- Rate limiting (in-memory, per-IP, resets on deploy) ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// --- Lead scoring (domain logic, stays here) ---
function scorelead(data: {
  budget?: string;
  need?: string;
  context?: string;
  message?: string;
  plan?: string;
}): LeadScore {
  let score = 0;
  const budget = data.budget || "";
  const need = data.need || "";
  const context = data.context || "";
  const message = data.message || "";

  // Budget signals (0-40 pts)
  if (
    budget.includes("10 000") ||
    budget.includes("10,000") ||
    budget.includes("Sur mesure") ||
    budget.includes("Custom")
  )
    score += 40;
  else if (budget.includes("7 000") || budget.includes("7,000")) score += 30;
  else if (budget.includes("3 000") || budget.includes("3,000")) score += 20;

  // Need signals (0-25 pts)
  if (need.includes("complet") || need.includes("complete")) score += 25;
  else if (need.includes("Automatisation") || need.includes("Automation"))
    score += 20;
  else if (need.includes("Dashboard") || need.includes("données")) score += 20;
  else if (need.includes("Site") || need.includes("site")) score += 15;
  else if (need.includes("Maintenance")) score += 10;

  // Context signals (0-15 pts)
  if (context.length > 3) score += 10;
  if (context.length > 15) score += 5;

  // Message quality (0-10 pts)
  if (message.length > 100) score += 5;
  if (message.length > 250) score += 5;

  // Plan pre-selected from /go (0-10 pts)
  if (data.plan === "partenaire") score += 10;
  else if (data.plan === "accelerateur") score += 8;
  else if (data.plan === "autonome") score += 5;

  if (score >= 55)
    return {
      score,
      label: "CHAUD",
      color: "#22c55e",
      action: "Rappeler dans les 2h. Lead prioritaire.",
    };
  if (score >= 30)
    return {
      score,
      label: "TIEDE",
      color: "#f59e0b",
      action: "Répondre sous 24h. Qualifier par email.",
    };
  return {
    score,
    label: "FROID",
    color: "#ef4444",
    action: "Répondre sous 48h. Évaluer si pertinent.",
  };
}

// --- Payload validation ---
function validatePayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.length > 2 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.need === "string" &&
    b.need.length > 0 &&
    (b.lang === "fr" || b.lang === "en")
  );
}

const ALLOWED_ORIGINS = [
  "https://www.aissabelkoussa.fr",
  "https://aissabelkoussa.fr",
  "https://aissabelkoussa.me",
  "https://www.aissabelkoussa.me",
];

export async function POST(request: Request) {
  // Origin check (CSRF)
  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Parse
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — silent accept
  if (
    body &&
    typeof body === "object" &&
    isBot(body as Record<string, unknown>)
  ) {
    return NextResponse.json({ success: true });
  }

  // Validate shape
  if (!validatePayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Strict email validation (disposable / MX check)
  const emailCheck = validateEmail(body.email);
  if (!emailCheck.valid) {
    return NextResponse.json(
      { error: "Invalid email", reason: emailCheck.reason },
      { status: 400 }
    );
  }

  // Score lead
  const lead = scorelead(body);

  // Formatted date for admin template
  const nowFr = new Date().toLocaleString(
    body.lang === "fr" ? "fr-FR" : "en-US",
    {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }
  );

  // Build templates
  const adminTpl = contactAdminTemplate({ ...body, lead, nowFr });
  const confirmTpl = contactConfirmTemplate({ ...body, lead });

  // Send in parallel
  const [adminResult, confirmResult] = await Promise.all([
    sendEmail({
      to: CONTACT_EMAIL,
      subject: adminTpl.subject,
      html: adminTpl.html,
      replyTo: body.email,
      tag: "contact-admin",
    }),
    sendEmail({
      to: body.email,
      subject: confirmTpl.subject,
      html: confirmTpl.html,
      tag: "contact-confirm",
    }),
  ]);

  if (!adminResult.ok) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
  if (!confirmResult.ok) {
    console.warn("[contact] confirmation email failed for:", body.email);
  }

  // Dual-send vers le backend FastAPI (fire-and-forget)
  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    fetch(`${backendUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": ip,
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        subject: body.need || "Contact",
        message: [
          body.message,
          body.context ? `\n\n--- Contexte ---\n${body.context}` : "",
          body.budget ? `\nBudget : ${body.budget}` : "",
          body.lang ? `\nLangue : ${body.lang}` : "",
        ].join(""),
      }),
    }).catch((err: Error) => {
      console.warn("[contact] backend dual-send failed:", err.message);
    });
  }

  return NextResponse.json({ success: true });
}
