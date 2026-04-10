import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "contact@aissabelkoussa.fr";
const FROM_EMAIL = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>";

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

  const now = new Date().toLocaleString("fr-FR", {
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
      subject: `Newsletter — Nouvel inscrit : ${email}`,
      html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <div style="background:#16a34a15;border:2px solid #16a34a;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <span style="color:#16a34a;font-size:13px;font-weight:700;">Nouvel abonné newsletter</span>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Email</td>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;font-weight:600;">${email}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Source</td>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:15px;">${source || "footer"}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Date</td>
        <td style="padding:12px 0;color:#fff;font-size:15px;">${now}</td>
      </tr>
    </table>
  </div>
</body></html>`,
    }),
  });

  if (!adminRes.ok) {
    console.error("Resend newsletter error:", await adminRes.text());
    return NextResponse.json(
      { error: "Failed to process" },
      { status: 500 }
    );
  }

  // 2. Email de bienvenue à l'abonné
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "Bienvenue dans la newsletter — Aïssa BELKOUSSA",
      html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <h1 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">Bienvenue !</h1>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Merci de vous être inscrit à la newsletter. Chaque semaine, je partage un article concret sur l'IA, l'automatisation et la visibilité digitale pour les PME et artisans.
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Zéro spam, que du contenu utile. Vous pouvez vous désinscrire à tout moment.
    </p>
    <a href="https://www.aissabelkoussa.fr/blog" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
      Lire les derniers articles →
    </a>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
      <a href="https://www.aissabelkoussa.fr" style="color:#666;font-size:12px;">aissabelkoussa.fr</a>
    </div>
  </div>
</body></html>`,
    }),
  }).catch((err) => {
    console.warn("Newsletter welcome email failed:", err);
  });

  return NextResponse.json({ success: true });
}
