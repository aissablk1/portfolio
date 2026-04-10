import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/* ────────────────────────────────────────────────
   Audit 360° — Partage temporaire (TTL 1h)
   ──────────────────────────────────────────────── */

interface StoredResult {
  data: unknown;
  expiresAt: number;
}

const store = new Map<string, StoredResult>();
const TTL = 60 * 60 * 1000; // 1 heure
const MAX_ENTRIES = 500;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt < now) store.delete(key);
  }
}

export async function POST(req: NextRequest) {
  try {
    cleanup();

    if (store.size >= MAX_ENTRIES) {
      const oldest = [...store.entries()]
        .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
        .slice(0, 50);
      oldest.forEach(([key]) => store.delete(key));
    }

    const body = await req.json();
    if (!body.domain || !body.dimensions) {
      return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
    }

    const id = randomUUID().split("-")[0];
    store.set(id, {
      data: body,
      expiresAt: Date.now() + TTL,
    });

    return NextResponse.json({ id, expiresAt: Date.now() + TTL });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  cleanup();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const entry = store.get(id);
  if (!entry) {
    return NextResponse.json({ error: "Resultat expire ou introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    data: entry.data,
    expiresAt: entry.expiresAt,
  });
}
