/**
 * lead-scoring.ts — Algorithme de scoring leads multi-facteurs
 *
 * Score initial (profil) + score comportemental (actions).
 * Segmentation automatique : FROID / TIÈDE / CHAUD / BRÛLANT.
 * Routage sectoriel pour les emails de nurturing.
 */

export type Sector = "btp" | "comptabilite" | "immobilier" | "courtage" | "commerce" | "autre";
export type CompanySize = "solo" | "2-10" | "11-50" | "50+";
export type Segment = "FROID" | "TIÈDE" | "CHAUD" | "BRÛLANT";

/* ── Score initial (à la capture) ──────────────────────────────────── */

const SECTOR_SCORES: Record<Sector, number> = {
  btp: 10,
  comptabilite: 10,
  immobilier: 8,
  courtage: 8,
  commerce: 5,
  autre: 3,
};

const SIZE_SCORES: Record<CompanySize, number> = {
  solo: 5,
  "2-10": 10,
  "11-50": 20,
  "50+": 30,
};

export function computeInitialScore(sector: Sector, size: CompanySize): number {
  return (SECTOR_SCORES[sector] || 3) + (SIZE_SCORES[size] || 5);
}

/* ── Score comportemental (post-capture) ───────────────────────────── */

export const EVENT_SCORES: Record<string, number> = {
  email_opened: 5,
  email_clicked: 10,
  page_services: 15,
  page_calculateur: 10,
  page_diagnostic: 10,
  diagnostic_completed: 20,
  page_contact: 25,
  return_visit: 10,
  j3_opened: 5,
  j3_clicked: 15,
};

/* ── Segmentation ──────────────────────────────────────────────────── */

export function getSegment(score: number): Segment {
  if (score >= 76) return "BRÛLANT";
  if (score >= 51) return "CHAUD";
  if (score >= 26) return "TIÈDE";
  return "FROID";
}

/* ── Recommandation d'offre ────────────────────────────────────────── */

export function getRecommendedPlan(size: CompanySize): string {
  if (size === "50+" || size === "11-50") return "partenaire";
  if (size === "2-10") return "accelerateur";
  return "starter";
}

/* ── Routage sectoriel (email J+3) ─────────────────────────────────── */

const SECTOR_ARTICLES: Record<Sector, { slug: string; cta: string }> = {
  btp: { slug: "automatiser-devis-artisan-btp", cta: "/diagnostic" },
  comptabilite: { slug: "expert-comptable-ia-automatisation-cabinet", cta: "/calculateur-roi" },
  immobilier: { slug: "agence-immobiliere-site-web-generation-mandats", cta: "/diagnostic" },
  courtage: { slug: "courtier-assurance-automatiser-qualification-leads", cta: "/calculateur-roi" },
  commerce: { slug: "commerce-or-bijouterie-site-web-confiance-seo", cta: "/diagnostic" },
  autre: { slug: "roi-intelligence-artificielle-tpe-2026", cta: "/diagnostic" },
};

export function getSectorArticle(sector: Sector) {
  return SECTOR_ARTICLES[sector] || SECTOR_ARTICLES.autre;
}

/* ── Labels secteur (pour les emails) ──────────────────────────────── */

export const SECTOR_LABELS: Record<Sector, string> = {
  btp: "BTP / Artisanat",
  comptabilite: "Comptabilité / Finance",
  immobilier: "Immobilier",
  courtage: "Courtage / Assurance",
  commerce: "Commerce / Retail",
  autre: "Autre",
};
