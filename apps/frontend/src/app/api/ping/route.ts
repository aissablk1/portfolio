/**
 * /api/ping — Page view tracking proxy
 *
 * Proxie les page views vers le backend (POST /api/tracker) en same-origin
 * pour éviter le blocage par les ad blockers (uBlock, etc.).
 *
 * Flux : navigateur → /api/ping (Vercel, même domaine) → /api/tracker (Render) → MongoDB
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

    await fetch(`${BACKEND_URL}/api/tracker`, {
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
