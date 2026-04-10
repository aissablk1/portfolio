/* ────────────────────────────────────────────────
   Audit 360° — Types partagés
   ──────────────────────────────────────────────── */

export type CheckStatus = "pass" | "warn" | "fail";
export type DimensionId = "seo" | "performance" | "accessibility" | "geo" | "security" | "credibility";
export type Verdict = "critical" | "warning" | "good";
export type Tier = "free" | "gated";

export interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  points: number;
  maxPoints: number;
}

export interface DimensionResult {
  id: DimensionId;
  label: string;
  tier: Tier;
  score: number;
  maxScore: number;
  verdict: Verdict;
  summary: string;
  checks: Check[];
  error?: string;
}

export interface AuditResult {
  domain: string;
  globalScore: number;
  maxGlobalScore: number;
  verdict: Verdict;
  dimensions: DimensionResult[];
  scannedAt: string;
}

export const DIMENSION_WEIGHTS: Record<DimensionId, number> = {
  seo: 0.20,
  performance: 0.20,
  accessibility: 0.15,
  geo: 0.20,
  security: 0.15,
  credibility: 0.10,
};

export const FREE_DIMENSIONS: DimensionId[] = ["seo", "performance", "accessibility"];
export const GATED_DIMENSIONS: DimensionId[] = ["geo", "security", "credibility"];
