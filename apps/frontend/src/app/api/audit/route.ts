import { NextRequest, NextResponse } from "next/server";
import { fetchPage, normalizeDomain } from "@/lib/audit/fetch-html";
import { computeGlobalScore } from "@/lib/audit/scorer";
import { analyzeSeo } from "@/lib/audit/modules/seo";
import { analyzePerformance } from "@/lib/audit/modules/performance";
import { analyzeAccessibility } from "@/lib/audit/modules/accessibility";
import { analyzeGeo } from "@/lib/audit/modules/geo";
import { analyzeSecurity } from "@/lib/audit/modules/security";
import { analyzeCredibility } from "@/lib/audit/modules/credibility";
import type { AuditResult, DimensionResult } from "@/lib/audit/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawDomain = body.domain as string;

    if (!rawDomain || rawDomain.length < 3) {
      return NextResponse.json({ error: "Domaine invalide" }, { status: 400 });
    }

    const domain = normalizeDomain(rawDomain);
    const baseUrl = `https://${domain}`;

    // Fetch homepage once, measure TTFB
    const t0 = Date.now();
    const homepage = await fetchPage(baseUrl);
    const ttfbMs = Date.now() - t0;

    if (!homepage || !homepage.ok) {
      return NextResponse.json(
        { error: `Impossible d'acceder a ${domain}` },
        { status: 400 }
      );
    }

    // Run all 6 modules in parallel
    const settled = await Promise.allSettled([
      analyzeSeo(domain, homepage),
      analyzePerformance(domain, homepage, ttfbMs),
      analyzeAccessibility(domain, homepage),
      analyzeGeo(domain, homepage),
      analyzeSecurity(domain, homepage),
      analyzeCredibility(domain, homepage),
    ]);

    const dimensions: DimensionResult[] = settled.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      const labels = ["seo", "performance", "accessibility", "geo", "security", "credibility"] as const;
      return {
        id: labels[i],
        label: labels[i],
        tier: "free",
        score: 0,
        maxScore: 100,
        verdict: "critical",
        summary: "Module en erreur",
        checks: [],
        error: r.reason?.message ?? "Unknown error",
      };
    });

    const { globalScore, maxGlobalScore, verdict } = computeGlobalScore(dimensions);

    const result: AuditResult = {
      domain,
      globalScore,
      maxGlobalScore,
      verdict,
      dimensions,
      scannedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: `Erreur: ${message}` }, { status: 500 });
  }
}
