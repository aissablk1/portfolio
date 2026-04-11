import { NextResponse } from "next/server";
import { buildUnsubscribeUrl } from "@/lib/newsletter-token";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "contact@aissabelkoussa.fr";
const FROM_EMAIL = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>";
const SITE_URL = "https://www.aissabelkoussa.fr";

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

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeUnsubscribeUrl(email: string): string | null {
  try {
    return buildUnsubscribeUrl(SITE_URL, email);
  } catch {
    return null;
  }
}

// ————————————————————————————————————————————————————
// Template 1 : Notification admin (reçoit un nouvel abonné)
// ————————————————————————————————————————————————————
function buildAdminEmail(email: string, source: string, nowFr: string): string {
  const safeEmail = esc(email);
  const safeSource = esc(source);
  const initial = email.charAt(0).toUpperCase();
  const domain = email.split("@")[1] || "";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="width:8px;height:8px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 4px #16a34a20;"></div>
      <span style="color:#16a34a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Nouvel abonné newsletter</span>
    </div>

    <div style="background:linear-gradient(135deg,#16a34a10,#0a0a0a);border:1px solid #16a34a30;border-radius:16px;padding:28px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#16a34a,#0ea5e9);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:700;">${esc(initial)}</div>
        <div>
          <p style="margin:0;color:#fff;font-size:17px;font-weight:600;word-break:break-all;">${safeEmail}</p>
          <p style="margin:4px 0 0;color:#888;font-size:12px;">${esc(domain)}</p>
        </div>
      </div>
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Répondre &rarr;</a>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;width:35%;">Source</td>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:14px;">
          <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:3px 12px;font-size:11px;">${safeSource}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Date</td>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:14px;">${esc(nowFr)}</td>
      </tr>
      <tr>
        <td style="padding:14px 0;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Domaine</td>
        <td style="padding:14px 0;color:#fff;font-size:14px;font-family:ui-monospace,monospace;">${esc(domain)}</td>
      </tr>
    </table>

    <div style="margin-top:28px;padding:18px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:12px;">
      <p style="margin:0 0 10px;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Actions rapides</p>
      <div>
        <a href="mailto:${safeEmail}?subject=Bienvenue%20dans%20la%20newsletter" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Email perso</a>
        <a href="https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(email)}" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Chercher LinkedIn</a>
        <a href="${SITE_URL}/admin" style="display:inline-block;margin:4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Dashboard</a>
      </div>
    </div>

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;text-align:center;">
      <p style="color:#444;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;margin:0;">aissabelkoussa.fr &bull; notification automatique</p>
    </div>
  </div>
</body>
</html>`;
}

// ————————————————————————————————————————————————————
// Template 2 : Bienvenue abonné
// ————————————————————————————————————————————————————
function buildWelcomeEmail(email: string, unsubUrl: string | null): string {
  const safeEmail = esc(email);
  const unsubBlock = unsubUrl
    ? `<a href="${unsubUrl}" style="color:#999;text-decoration:underline;">Se désinscrire</a>`
    : `<a href="mailto:${CONTACT_EMAIL}?subject=Désinscription%20newsletter" style="color:#999;text-decoration:underline;">Se désinscrire</a>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <div style="margin-bottom:8px;">
      <span style="display:inline-block;padding:4px 12px;background:#16a34a15;color:#16a34a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;border-radius:20px;">Inscription confirmée</span>
    </div>

    <h1 style="color:#0a0a0a;font-size:28px;line-height:1.2;margin:16px 0 12px;font-weight:800;letter-spacing:-0.02em;">
      Bienvenue à bord.
    </h1>
    <p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 32px;">
      Merci de rejoindre la newsletter. Un article concret chaque semaine sur l'IA, l'automatisation et la visibilité digitale pour les PME et artisans.
    </p>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;margin-bottom:32px;">
      <p style="margin:0 0 16px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;">Ce que vous allez recevoir</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px;"><span style="color:#16a34a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">1 article par semaine</strong> — études de cas réels et playbooks opérationnels.</td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;"><span style="color:#16a34a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">Zéro spam, zéro pub.</strong> Que du contenu utile que vous pouvez appliquer.</td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;"><span style="color:#16a34a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">Désinscription en 1 clic</strong> — à tout moment, sans question.</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:40px;">
      <a href="${SITE_URL}/blog" style="display:inline-block;background:#0a0a0a;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
        Lire les derniers articles &nbsp;&rarr;
      </a>
      <a href="${SITE_URL}/diagnostic" style="display:inline-block;margin-left:8px;padding:14px 24px;color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:600;">
        Diagnostic gratuit
      </a>
    </div>

    <div style="background:#f5f5f5;border-radius:12px;padding:20px;margin-bottom:32px;">
      <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
        <strong style="color:#0a0a0a;">Besoin d'aide rapidement&nbsp;?</strong> Répondez simplement à cet email. Je lis tout, personnellement.
      </p>
    </div>

    <div style="margin-bottom:24px;">
      <p style="color:#0a0a0a;font-size:14px;font-weight:700;margin:0 0 2px;">Aïssa BELKOUSSA</p>
      <p style="color:#888;font-size:12px;margin:0;">Architecte de systèmes &amp; Consultant IA &bull; Albi</p>
    </div>

    <div style="border-top:1px solid #e5e5e5;padding-top:20px;text-align:center;">
      <div style="margin-bottom:12px;">
        <a href="${SITE_URL}" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">Site</a>
        <span style="color:#ccc;">&bull;</span>
        <a href="https://www.linkedin.com/in/aissabelkoussa" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">LinkedIn</a>
        <span style="color:#ccc;">&bull;</span>
        <a href="${SITE_URL}/blog" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">Blog</a>
      </div>
      <p style="color:#999;font-size:11px;margin:0 0 6px;">
        Vous recevez cet email à <strong>${safeEmail}</strong> suite à votre inscription sur aissabelkoussa.fr.
      </p>
      <p style="color:#999;font-size:11px;margin:0;">
        ${unsubBlock} &bull; <a href="mailto:${CONTACT_EMAIL}" style="color:#999;text-decoration:underline;">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const safeSource = source || "footer";

  const nowFr = new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  // 1. Notification admin
  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      subject: `Newsletter — Nouvel inscrit : ${normalizedEmail}`,
      html: buildAdminEmail(normalizedEmail, safeSource, nowFr),
      reply_to: normalizedEmail,
    }),
  });

  if (!adminRes.ok) {
    console.error("Resend newsletter error:", await adminRes.text());
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }

  // 2. Email de bienvenue à l'abonné (avec headers RFC 8058 one-click unsubscribe)
  const unsubUrl = safeUnsubscribeUrl(normalizedEmail);
  const welcomeHeaders: Record<string, string> = {};
  if (unsubUrl) {
    welcomeHeaders["List-Unsubscribe"] = `<${unsubUrl}>, <mailto:${CONTACT_EMAIL}?subject=Unsubscribe>`;
    welcomeHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: normalizedEmail,
      subject: "Bienvenue dans la newsletter — Aïssa BELKOUSSA",
      html: buildWelcomeEmail(normalizedEmail, unsubUrl),
      headers: welcomeHeaders,
    }),
  }).catch((err) => {
    console.warn("Newsletter welcome email failed:", err);
  });

  return NextResponse.json({ success: true });
}
