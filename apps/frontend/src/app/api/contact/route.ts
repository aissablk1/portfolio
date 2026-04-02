import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "contact@aissabelkoussa.fr";
const FROM_EMAIL = `Aïssa Belkoussa <contact@aissabelkoussa.fr>`;

// --- Rate limiting (in-memory, per-IP, resets on deploy) ---
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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

// --- Lead scoring ---
type LeadScore = { score: number; label: "CHAUD" | "TIEDE" | "FROID"; color: string; action: string };

function scorelead(data: { budget: string; need: string; context: string; message: string; plan?: string }): LeadScore {
  let score = 0;

  // Budget signals (0-40 pts)
  if (data.budget.includes("10 000") || data.budget.includes("10,000") || data.budget.includes("Sur mesure") || data.budget.includes("Custom")) score += 40;
  else if (data.budget.includes("7 000") || data.budget.includes("7,000")) score += 30;
  else if (data.budget.includes("3 000") || data.budget.includes("3,000")) score += 20;

  // Need signals (0-25 pts)
  if (data.need.includes("complet") || data.need.includes("complete")) score += 25;
  else if (data.need.includes("Automatisation") || data.need.includes("Automation")) score += 20;
  else if (data.need.includes("Dashboard") || data.need.includes("données")) score += 20;
  else if (data.need.includes("Site") || data.need.includes("site")) score += 15;
  else if (data.need.includes("Maintenance")) score += 10;

  // Context signals (0-15 pts)
  if (data.context.length > 3) score += 10;
  if (data.context.length > 15) score += 5;

  // Message quality (0-10 pts)
  if (data.message.length > 100) score += 5;
  if (data.message.length > 250) score += 5;

  // Plan pre-selected from /go (0-10 pts)
  if (data.plan === "partenaire") score += 10;
  else if (data.plan === "accelerateur") score += 8;
  else if (data.plan === "autonome") score += 5;

  if (score >= 55) return { score, label: "CHAUD", color: "#22c55e", action: "Rappeler dans les 2h. Lead prioritaire." };
  if (score >= 30) return { score, label: "TIEDE", color: "#f59e0b", action: "Répondre sous 24h. Qualifier par email." };
  return { score, label: "FROID", color: "#ef4444", action: "Répondre sous 48h. Évaluer si pertinent." };
}

// --- Types ---
interface ContactPayload {
  name: string;
  email: string;
  context: string;
  need: string;
  message: string;
  budget: string;
  lang: "fr" | "en";
  plan?: string;
  _honey?: string; // honeypot
}

function validatePayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.length > 2 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.context === "string" &&
    typeof b.need === "string" &&
    typeof b.message === "string" &&
    b.message.length > 5 &&
    typeof b.budget === "string" &&
    (b.lang === "fr" || b.lang === "en")
  );
}

// --- Bilingual labels ---
const labels = {
  fr: {
    // Admin email
    subject: "Nouvelle demande de projet",
    via: "via aissabelkoussa.fr",
    name: "Nom",
    email: "Email",
    company: "Entreprise / Projet",
    need: "Besoin",
    budget: "Budget",
    message: "Message",
    notProvided: "Non renseigné",
    submittedAt: "Soumis le",
    language: "Langue du visiteur",
    replyNow: "Répondre maintenant",
    footer: "Aïssa Belkoussa &bull; Architecte de systèmes",
    // Confirmation email
    confirmSubject: "Bien reçu — je reviens vers vous rapidement",
    confirmGreeting: "Bonjour",
    confirmBody:
      "Merci pour votre message. J'ai bien reçu votre demande et je l'analyse attentivement.",
    confirmPromise: "Je reviens vers vous sous 48h maximum.",
    confirmDetail: "Voici un récapitulatif de votre demande :",
    confirmClosing: "À très bientôt,",
    confirmSignature: "Aïssa Belkoussa",
    confirmRole: "Architecte de systèmes & Développeur",
    confirmSite: "www.aissabelkoussa.fr",
  },
  en: {
    subject: "New project request",
    via: "via aissabelkoussa.fr",
    name: "Name",
    email: "Email",
    company: "Company / Project",
    need: "Need",
    budget: "Budget",
    message: "Message",
    notProvided: "Not provided",
    submittedAt: "Submitted on",
    language: "Visitor language",
    replyNow: "Reply now",
    footer: "Aïssa Belkoussa &bull; Systems Architect",
    confirmSubject: "Received — I'll get back to you shortly",
    confirmGreeting: "Hi",
    confirmBody:
      "Thank you for reaching out. I've received your request and I'm reviewing it carefully.",
    confirmPromise: "I'll get back to you within 48 hours.",
    confirmDetail: "Here's a summary of your request:",
    confirmClosing: "Talk soon,",
    confirmSignature: "Aïssa Belkoussa",
    confirmRole: "Systems Architect & Developer",
    confirmSite: "www.aissabelkoussa.fr",
  },
};

// --- Escape ---
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Admin notification email ---
function buildAdminEmail(data: ContactPayload): string {
  const t = labels[data.lang] || labels.fr;
  const lead = scorelead(data);
  const now = new Date().toLocaleString(data.lang === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
  const langBadge = data.lang === "fr" ? "Francais" : "English";

  return `<!DOCTYPE html>
<html lang="${data.lang}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Lead Score Banner -->
    <div style="background:${lead.color}15;border:2px solid ${lead.color};border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <div style="background:${lead.color};color:#fff;font-size:12px;font-weight:800;padding:6px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:0.1em;">
        ${lead.label} (${lead.score}/100)
      </div>
      <span style="color:${lead.color};font-size:13px;font-weight:600;">
        ${lead.action}
      </span>
    </div>

    <div style="border-bottom:2px solid #222;padding-bottom:24px;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:20px;margin:0;letter-spacing:0.1em;text-transform:uppercase;">
        ${t.subject}
      </h1>
      <p style="color:#666;font-size:12px;margin:8px 0 0;text-transform:uppercase;letter-spacing:0.15em;">
        ${t.via} &bull; ${now}
      </p>
    </div>

    <!-- Reply button -->
    <div style="margin-bottom:32px;">
      <a href="mailto:${esc(data.email)}?subject=Re: ${esc(data.need)}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">
        ${t.replyNow} &rarr;
      </a>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:50%;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.name}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;font-weight:600;">${esc(data.name)}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:50%;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.email}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <a href="mailto:${esc(data.email)}" style="color:#6366f1;text-decoration:none;">${esc(data.email)}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.company}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">${esc(data.context) || t.notProvided}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.language}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:2px 10px;font-size:11px;">${langBadge}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.need}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:4px 14px;font-size:13px;">
              ${esc(data.need)}
            </span>
          </p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.budget}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;font-weight:600;">${esc(data.budget)}</p>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:16px 0;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.message}</span>
          <div style="color:#ccc;font-size:15px;margin:10px 0 0;line-height:1.7;background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:20px;">
            ${esc(data.message).replace(/\n/g, "<br>")}
          </div>
        </td>
      </tr>
    </table>

    <div style="margin-top:40px;padding-top:24px;border-top:2px solid #222;text-align:center;">
      <p style="color:#444;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0;">
        ${t.footer}
      </p>
    </div>
  </div>
</body>
</html>`;
}

// --- Confirmation email to prospect ---
function buildConfirmationEmail(data: ContactPayload): string {
  const t = labels[data.lang] || labels.fr;

  return `<!DOCTYPE html>
<html lang="${data.lang}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="margin-bottom:32px;">
      <h1 style="color:#111;font-size:18px;margin:0;font-weight:700;">
        ${t.confirmGreeting} ${esc(data.name.split(" ")[0])},
      </h1>
    </div>

    <div style="color:#333;font-size:15px;line-height:1.8;margin-bottom:24px;">
      <p style="margin:0 0 16px;">${t.confirmBody}</p>
      <p style="margin:0 0 24px;font-weight:600;">${t.confirmPromise}</p>
    </div>

    <div style="background:#f0f0f0;border-radius:12px;padding:24px;margin-bottom:32px;">
      <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 16px;">${t.confirmDetail}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;width:100px;">${t.need}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${esc(data.need)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">${t.budget}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${esc(data.budget)}</td>
        </tr>
        ${data.context ? `<tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">${t.company}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;">${esc(data.context)}</td>
        </tr>` : ""}
      </table>
    </div>

    <div style="margin-bottom:32px;">
      <p style="color:#333;font-size:15px;margin:0 0 4px;">${t.confirmClosing}</p>
      <p style="color:#111;font-size:15px;font-weight:700;margin:0;">${t.confirmSignature}</p>
      <p style="color:#888;font-size:13px;margin:4px 0 0;">${t.confirmRole}</p>
    </div>

    <div style="border-top:1px solid #e5e5e5;padding-top:20px;text-align:center;">
      <a href="https://www.aissabelkoussa.fr" style="color:#6366f1;font-size:12px;text-decoration:none;font-weight:600;">${t.confirmSite}</a>
      <span style="color:#ccc;margin:0 8px;">&bull;</span>
      <a href="https://www.linkedin.com/in/aissabelkoussa" style="color:#6366f1;font-size:12px;text-decoration:none;">LinkedIn</a>
      <span style="color:#ccc;margin:0 8px;">&bull;</span>
      <a href="https://github.com/aissablk1" style="color:#6366f1;font-size:12px;text-decoration:none;">GitHub</a>
    </div>
  </div>
</body>
</html>`;
}

// --- Send email helper ---
async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, ...payload }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
    return false;
  }
  return true;
}

// --- Route handler ---
export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot check — if the hidden field is filled, it's a bot
  if (
    body &&
    typeof body === "object" &&
    "_honey" in body &&
    (body as Record<string, unknown>)._honey
  ) {
    // Silently accept to not tip off bots
    return NextResponse.json({ success: true });
  }

  // Validate
  if (!validatePayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const t = labels[body.lang] || labels.fr;
  const lead = scorelead(body);

  // Send both emails in parallel
  const [adminSent, confirmSent] = await Promise.all([
    // 1. Admin notification (with lead score in subject)
    sendEmail({
      to: CONTACT_EMAIL,
      subject: `[${lead.label}] ${t.subject} — ${body.need} — ${body.name}`,
      html: buildAdminEmail(body),
      reply_to: body.email,
    }),
    // 2. Confirmation to prospect
    sendEmail({
      to: body.email,
      subject: t.confirmSubject,
      html: buildConfirmationEmail(body),
    }),
  ]);

  if (!adminSent) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }

  // Log if confirmation failed but don't block the user
  if (!confirmSent) {
    console.warn("Confirmation email failed for:", body.email);
  }

  // Dual-send vers le backend FastAPI (fire-and-forget, ne bloque pas la réponse)
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
    }).catch((err) => {
      console.warn("Backend dual-send failed:", err.message);
    });
  }

  return NextResponse.json({ success: true });
}
