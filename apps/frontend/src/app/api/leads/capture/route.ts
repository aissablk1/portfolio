import { NextResponse } from "next/server";
import {
  computeInitialScore,
  getSegment,
  getRecommendedPlan,
} from "@/lib/lead-scoring";
import { welcomeEmail } from "@/lib/lead-emails";
import type { Sector, CompanySize } from "@/lib/lead-scoring";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
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

/* ── Route handler ─────────────────────────────────────────────────── */

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: {
    email?: string;
    name?: string;
    sector?: string;
    companySize?: string;
    source?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, sector, companySize, source } = body;

  if (!email || !name || !sector || !companySize) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  /* ── Scoring ──────────────────────────────────────────────────── */

  const score = computeInitialScore(sector as Sector, companySize as CompanySize);
  const segment = getSegment(score);
  const recommendedPlan = getRecommendedPlan(companySize as CompanySize);

  const leadId = crypto.randomUUID();
  const emailId = crypto.randomUUID();

  /* ── Persistance backend MongoDB (fire-and-forget) ────────────── */

  fetch(`${BACKEND_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: leadId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      sector,
      company_size: companySize,
      score,
      segment,
      source: source || "guide-ia",
      recommended_plan: recommendedPlan,
      status: "new",
      events: [
        {
          type: "captured",
          data: { sector, company_size: companySize, initial_score: score },
          created_at: new Date().toISOString(),
        },
      ],
    }),
  }).catch((err) => {
    console.warn("Backend lead persist failed:", err.message);
  });

  /* ── Email bienvenue via Resend ───────────────────────────────── */

  if (RESEND_API_KEY) {
    const emailPayload = welcomeEmail(name.trim(), leadId, emailId);

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...emailPayload,
        to: email.trim().toLowerCase(),
      }),
    }).catch((err) => {
      console.warn("Resend welcome email failed:", err.message);
    });
  }

  /* ── Notification Telegram si score élevé ──────────────────────── */

  if (score >= 30) {
    const emoji = score >= 51 ? "🔥" : "📥";
    notifyTelegram(
      `${emoji} <b>Lead ${segment}</b> — ${name} (${sector}, ${companySize})\nScore: ${score}/100 — Plan: ${recommendedPlan}\n${email}\nSource: ${source || "guide-ia"}`
    );
  }

  /* ── Notification admin Resend ─────────────────────────────────── */

  if (RESEND_API_KEY) {
    const now = new Date().toLocaleString("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    });

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>",
        to: "contact@aissabelkoussa.fr",
        subject: `Lead ${segment} — ${name} (${sector}) — Score ${score}/100`,
        html: `<!DOCTYPE html><html><body style="margin:0;padding:40px 24px;background:#0a0a0a;font-family:system-ui,sans-serif;">
<div style="max-width:500px;margin:0 auto;">
  <div style="background:${score >= 51 ? "#16a34a" : score >= 26 ? "#f59e0b" : "#ef4444"}15;border:2px solid ${score >= 51 ? "#16a34a" : score >= 26 ? "#f59e0b" : "#ef4444"};border-radius:12px;padding:16px 20px;margin-bottom:24px;">
    <span style="font-size:14px;font-weight:700;color:${score >= 51 ? "#16a34a" : score >= 26 ? "#f59e0b" : "#ef4444"};">${segment} — Score ${score}/100</span>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">Prénom</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;font-weight:600;">${name}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;">${email}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">Secteur</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;">${sector}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">Taille</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;">${companySize}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;">Plan</td><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;font-weight:600;">${recommendedPlan}</td></tr>
    <tr><td style="padding:10px 0;color:#666;font-size:12px;">Date</td><td style="padding:10px 0;color:#fff;font-size:15px;">${now}</td></tr>
  </table>
  <div style="margin-top:24px;"><a href="mailto:${email}?subject=Suite%20à%20votre%20téléchargement" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Répondre →</a></div>
</div></body></html>`,
      }),
    }).catch(() => {});
  }

  /* ── Réponse ──────────────────────────────────────────────────── */

  return NextResponse.json({
    success: true,
    leadId,
    score,
    segment,
    recommendedPlan,
  });
}
