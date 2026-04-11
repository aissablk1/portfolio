import { NextResponse } from "next/server";
import { sendEmail, CONTACT_EMAIL } from "@/lib/email";
import { validateEmail } from "@/lib/email-validator";
import { isBot } from "@/lib/honeypot";
import { buildUnsubscribeUrl } from "@/lib/newsletter-token";
import { welcomeEmail } from "@/lib/lead-emails";
import {
  computeInitialScore,
  getSegment,
  getRecommendedPlan,
} from "@/lib/lead-scoring";
import type { Sector, CompanySize } from "@/lib/lead-scoring";

const SITE_URL = "https://www.aissabelkoussa.fr";
const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://portfolio-api-72tq.onrender.com";

/* ── Rate limiting ─────────────────────────────────────────────────── */

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

/* ── Telegram notification ─────────────────────────────────────────── */

function notifyTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  }).catch(() => {});
}

function safeUnsubscribeUrl(email: string): string | undefined {
  try {
    return buildUnsubscribeUrl(SITE_URL, email);
  } catch {
    return undefined;
  }
}

function buildAdminHtml(d: {
  name: string; email: string; sector: string; companySize: string;
  score: number; segment: string; recommendedPlan: string; nowFr: string;
}): string {
  const color = d.score >= 51 ? "#16a34a" : d.score >= 26 ? "#f59e0b" : "#ef4444";
  const row = (k: string, v: string, bold = false) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">${k}</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;${bold ? "font-weight:600;" : ""}">${v}</td></tr>`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:40px 24px;background:#0a0a0a;font-family:system-ui,sans-serif;"><div style="max-width:500px;margin:0 auto;"><div style="background:${color}15;border:2px solid ${color};border-radius:12px;padding:16px 20px;margin-bottom:24px;"><span style="font-size:14px;font-weight:700;color:${color};">${d.segment} — Score ${d.score}/100</span></div><table style="width:100%;border-collapse:collapse;">${row("Prénom", d.name, true)}${row("Email", d.email)}${row("Secteur", d.sector)}${row("Taille", d.companySize)}${row("Plan", d.recommendedPlan, true)}${row("Date", d.nowFr)}</table><div style="margin-top:24px;"><a href="mailto:${d.email}?subject=Suite%20à%20votre%20téléchargement" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Répondre →</a></div></div></body></html>`;
}

/* ── Route handler ─────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isBot(body)) return NextResponse.json({ success: true });

  const str = (k: string, fallback = "") =>
    typeof body[k] === "string" ? (body[k] as string) : fallback;
  const email = str("email");
  const name = str("name");
  const sector = str("sector");
  const companySize = str("companySize");
  const source = str("source", "guide-ia");

  if (!email || !name || !sector || !companySize) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  if (!validateEmail(email).valid) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  const score = computeInitialScore(sector as Sector, companySize as CompanySize);
  const segment = getSegment(score);
  const recommendedPlan = getRecommendedPlan(companySize as CompanySize);
  const leadId = crypto.randomUUID();
  const emailId = crypto.randomUUID();

  // Persistance backend MongoDB (fire-and-forget)
  fetch(`${BACKEND_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: leadId,
      email: normalizedEmail,
      name: trimmedName,
      sector,
      company_size: companySize,
      score,
      segment,
      source,
      recommended_plan: recommendedPlan,
      status: "new",
      events: [{
        type: "captured",
        data: { sector, company_size: companySize, initial_score: score },
        created_at: new Date().toISOString(),
      }],
    }),
  }).catch((err) => console.warn("Backend lead persist failed:", err.message));

  // Email bienvenue (via sendEmail)
  const welcome = welcomeEmail(trimmedName, leadId, emailId);
  sendEmail({
    to: normalizedEmail,
    subject: welcome.subject,
    html: welcome.html,
    replyTo: CONTACT_EMAIL,
    unsubscribeUrl: safeUnsubscribeUrl(normalizedEmail),
    tag: "lead-welcome",
  }).catch((err) => console.warn("Welcome email failed:", err));

  // Telegram si score élevé
  if (score >= 30) {
    const emoji = score >= 51 ? "🔥" : "📥";
    notifyTelegram(
      `${emoji} <b>Lead ${segment}</b> — ${trimmedName} (${sector}, ${companySize})\nScore: ${score}/100 — Plan: ${recommendedPlan}\n${normalizedEmail}\nSource: ${source}`
    );
  }

  // Notification admin (via sendEmail)
  const nowFr = new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
  sendEmail({
    to: CONTACT_EMAIL,
    subject: `Lead ${segment} — ${trimmedName} (${sector}) — Score ${score}/100`,
    html: buildAdminHtml({
      name: trimmedName, email: normalizedEmail, sector, companySize,
      score, segment, recommendedPlan, nowFr,
    }),
    replyTo: normalizedEmail,
    tag: "lead-admin-notif",
  }).catch(() => {});

  return NextResponse.json({ success: true, leadId, score, segment, recommendedPlan });
}
