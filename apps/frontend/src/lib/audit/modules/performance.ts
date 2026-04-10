import type { DimensionResult, Check } from "../types";
import type { FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module Performance — signaux HTML + TTFB
   ──────────────────────────────────────────────── */

export async function analyzePerformance(domain: string, homepage: FetchedPage | null, ttfbMs: number): Promise<DimensionResult> {
  const checks: Check[] = [];
  const html = homepage?.html ?? "";

  // 1. TTFB (Time To First Byte)
  const ttfbGood = ttfbMs > 0 && ttfbMs < 800;
  const ttfbOk = ttfbMs >= 800 && ttfbMs < 1800;
  checks.push({
    id: "ttfb",
    label: "Temps de reponse serveur",
    status: ttfbGood ? "pass" : ttfbOk ? "warn" : "fail",
    detail: ttfbMs > 0
      ? `${ttfbMs} ms ${ttfbGood ? "(excellent)" : ttfbOk ? "(acceptable)" : "(trop lent)"}`
      : "Non mesurable",
    points: ttfbGood ? 25 : ttfbOk ? 12 : 0,
    maxPoints: 25,
  });

  // 2. Taille du HTML
  const htmlKb = Math.round(html.length / 1024);
  const sizeGood = htmlKb > 0 && htmlKb < 150;
  const sizeOk = htmlKb >= 150 && htmlKb < 400;
  checks.push({
    id: "html-size",
    label: "Taille du HTML",
    status: sizeGood ? "pass" : sizeOk ? "warn" : "fail",
    detail: htmlKb === 0 ? "Page vide" : `${htmlKb} Ko ${sizeGood ? "(leger)" : sizeOk ? "(moyen)" : "(lourd)"}`,
    points: sizeGood ? 20 : sizeOk ? 10 : 0,
    maxPoints: 20,
  });

  // 3. Scripts externes
  const scriptMatches = html.match(/<script[^>]*src=/gi) ?? [];
  const scriptCount = scriptMatches.length;
  const scriptsGood = scriptCount > 0 && scriptCount < 15;
  const scriptsOk = scriptCount >= 15 && scriptCount < 30;
  checks.push({
    id: "scripts",
    label: "Scripts externes",
    status: scriptsGood ? "pass" : scriptsOk ? "warn" : scriptCount === 0 ? "warn" : "fail",
    detail: `${scriptCount} scripts ${scriptsGood ? "(raisonnable)" : scriptsOk ? "(beaucoup)" : "(trop)"}`,
    points: scriptsGood ? 15 : scriptsOk ? 7 : 0,
    maxPoints: 15,
  });

  // 4. Lazy loading des images
  const imgMatches = html.match(/<img\b[^>]*>/gi) ?? [];
  const lazyImgs = imgMatches.filter((tag) => /loading=["']lazy["']/i.test(tag)).length;
  const imgTotal = imgMatches.length;
  const lazyRatio = imgTotal > 0 ? lazyImgs / imgTotal : 1;
  const lazyGood = lazyRatio >= 0.7 || imgTotal <= 3;
  checks.push({
    id: "lazy-loading",
    label: "Lazy loading des images",
    status: lazyGood ? "pass" : imgTotal > 0 ? "warn" : "pass",
    detail: imgTotal === 0
      ? "Aucune image sur la page"
      : `${lazyImgs}/${imgTotal} images en lazy loading`,
    points: lazyGood ? 20 : imgTotal > 0 ? 8 : 20,
    maxPoints: 20,
  });

  // 5. Preconnect / DNS prefetch
  const hasPreconnect = /<link[^>]*rel=["'](preconnect|dns-prefetch)["']/i.test(html);
  checks.push({
    id: "preconnect",
    label: "Preconnect / DNS prefetch",
    status: hasPreconnect ? "pass" : "warn",
    detail: hasPreconnect
      ? "Connexions externes optimisees"
      : "Pas de preconnect (performance sous-optimale)",
    points: hasPreconnect ? 20 : 0,
    maxPoints: 20,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "performance",
    label: "Performance",
    tier: "free",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Site rapide et optimise"
      : pct >= 0.4
        ? "Performance moyenne"
        : "Performance critique",
    checks,
  };
}
