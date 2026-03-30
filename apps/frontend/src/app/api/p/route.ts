/**
 * /api/p — Page view tracking proxy (p = ping)
 *
 * Proxie les page views vers le backend (POST /api/t) en same-origin
 * pour éviter le blocage par les ad blockers (uBlock, etc.).
 *
 * Flux : navigateur → /api/p (Vercel, même domaine) → /api/t (Render) → MongoDB
 *
 * Les noms courts "p" et "t" sont volontairement anodins pour ne pas
 * déclencher les filtres anti-tracking des extensions navigateur.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.text();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    await fetch(`${BACKEND_URL}/api/t`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": ip,
      },
      body,
    }).catch(() => {});
  } catch {
    // Never fail
  }

  return NextResponse.json({ ok: true });
}
