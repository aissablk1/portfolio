import type { DimensionResult, Verdict } from "./types";
import { DIMENSION_WEIGHTS } from "./types";

export interface GlobalScore {
  globalScore: number;
  maxGlobalScore: number;
  verdict: Verdict;
}

/**
 * Calcule un score global sur 100, ponderé par l'importance de chaque dimension.
 * Chaque dimension est normalisée sur 100 avant pondération.
 */
export function computeGlobalScore(dimensions: DimensionResult[]): GlobalScore {
  const maxGlobalScore = 100;
  let weightedSum = 0;
  let totalWeight = 0;

  for (const dim of dimensions) {
    const weight = DIMENSION_WEIGHTS[dim.id] ?? 0;
    if (dim.maxScore === 0) continue;
    const normalized = (dim.score / dim.maxScore) * 100;
    weightedSum += normalized * weight;
    totalWeight += weight;
  }

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  let verdict: Verdict = "critical";
  if (globalScore >= 70) verdict = "good";
  else if (globalScore >= 40) verdict = "warning";

  return { globalScore, maxGlobalScore, verdict };
}
