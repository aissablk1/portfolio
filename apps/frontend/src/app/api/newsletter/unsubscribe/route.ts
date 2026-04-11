import { NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";

const BACKEND_URL = process.env.BACKEND_URL || "";

function html(body: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Désinscription — Aïssa BELKOUSSA</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:80px 24px;background:#fafafa;font-family:system-ui,-apple-system,sans-serif;">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function handleUnsubscribe(
  email: string,
  token: string
): Promise<{ ok: boolean; status: number; reason: string }> {
  if (!email || !token || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, status: 400, reason: "invalid_email" };
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return { ok: false, status: 403, reason: "invalid_token" };
  }

  if (!BACKEND_URL) {
    console.error("BACKEND_URL not configured");
    return { ok: false, status: 500, reason: "backend_error" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/newsletter/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    if (!res.ok) {
      console.error("Backend unsubscribe failed:", await res.text());
      return { ok: false, status: 502, reason: "backend_error" };
    }
  } catch (err) {
    console.error("Backend unsubscribe network error:", err);
    return { ok: false, status: 502, reason: "backend_unreachable" };
  }

  return { ok: true, status: 200, reason: "unsubscribed" };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";

  const result = await handleUnsubscribe(email, token);

  if (result.ok) {
    const safeEmail = email.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
    return html(
      `<div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:40px;text-align:center;">
        <div style="width:56px;height:56px;margin:0 auto 20px;background:#16a34a15;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:#16a34a;font-weight:700;">✓</div>
        <h1 style="color:#1a1a1a;font-size:22px;margin:0 0 12px;font-weight:700;">Désinscription confirmée</h1>
        <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 24px;">
          L'adresse <strong>${safeEmail}</strong> ne recevra plus d'emails de la newsletter.
        </p>
        <p style="color:#999;font-size:13px;margin:0 0 28px;">
          Vous pouvez vous réinscrire à tout moment depuis le site.
        </p>
        <a href="https://www.aissabelkoussa.fr" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Retour au site</a>
      </div>`
    );
  }

  const messages: Record<string, string> = {
    invalid_email: "Adresse email invalide.",
    invalid_token: "Lien de désinscription invalide ou expiré.",
    backend_error: "Le service est temporairement indisponible. Réessayez dans quelques minutes.",
    backend_unreachable: "Le service est injoignable. Réessayez plus tard.",
  };

  return html(
    `<div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:40px;text-align:center;">
      <div style="width:56px;height:56px;margin:0 auto 20px;background:#dc262615;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;color:#dc2626;font-weight:700;">✕</div>
      <h1 style="color:#1a1a1a;font-size:22px;margin:0 0 12px;font-weight:700;">Désinscription impossible</h1>
      <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${messages[result.reason] || "Une erreur est survenue."}
      </p>
      <a href="mailto:contact@aissabelkoussa.fr?subject=Désinscription%20newsletter" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Me contacter</a>
    </div>`,
    result.status
  );
}

// One-click unsubscribe pour Gmail/Apple Mail (RFC 8058)
export async function POST(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";

  const result = await handleUnsubscribe(email, token);
  return NextResponse.json(
    { success: result.ok, reason: result.reason },
    { status: result.status }
  );
}
