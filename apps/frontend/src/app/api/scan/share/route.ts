import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/* ────────────────────────────────────────────────
   Scanner IA — Partage temporaire
   Stocke les résultats en mémoire avec TTL 1h.
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

// POST — sauvegarder un résultat
export async function POST(req: NextRequest) {
  try {
    cleanup();

    if (store.size >= MAX_ENTRIES) {
      // Supprimer les plus anciens
      const oldest = [...store.entries()]
        .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
        .slice(0, 50);
      oldest.forEach(([key]) => store.delete(key));
    }

    const body = await req.json();

    if (!body.domain || !body.checks) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const id = randomUUID().split("-")[0]; // 8 caractères
    store.set(id, {
      data: body,
      expiresAt: Date.now() + TTL,
    });

    return NextResponse.json({ id, expiresAt: Date.now() + TTL });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET — récupérer un résultat partagé
export async function GET(req: NextRequest) {
  cleanup();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const entry = store.get(id);
  if (!entry) {
    return NextResponse.json({ error: "Résultat expiré ou introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    data: entry.data,
    expiresAt: entry.expiresAt,
  });
}
