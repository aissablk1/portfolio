import type { DimensionResult, Check } from "../types";
import type { FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module Accessibilite — heuristiques WCAG AA
   ──────────────────────────────────────────────── */

export async function analyzeAccessibility(domain: string, homepage: FetchedPage | null): Promise<DimensionResult> {
  const checks: Check[] = [];
  const html = homepage?.html ?? "";

  // 1. lang attribute
  const langMatch = html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  const hasLang = !!langMatch;
  checks.push({
    id: "lang-attr",
    label: "Attribut lang",
    status: hasLang ? "pass" : "fail",
    detail: hasLang ? `lang="${langMatch?.[1]}"` : "Attribut lang manquant sur <html>",
    points: hasLang ? 15 : 0,
    maxPoints: 15,
  });

  // 2. Images avec alt
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const imgsWithAlt = imgTags.filter((tag) => /\balt=["']/i.test(tag)).length;
  const altRatio = imgTags.length > 0 ? imgsWithAlt / imgTags.length : 1;
  const altGood = altRatio >= 0.9;
  checks.push({
    id: "img-alt",
    label: "Attributs alt sur les images",
    status: altGood ? "pass" : altRatio >= 0.5 ? "warn" : "fail",
    detail: imgTags.length === 0
      ? "Aucune image"
      : `${imgsWithAlt}/${imgTags.length} images avec alt`,
    points: altGood ? 20 : altRatio >= 0.5 ? 10 : 0,
    maxPoints: 20,
  });

  // 3. Hierarchie des titres (presence de H1 + H2)
  const hasH1 = /<h1[^>]*>/i.test(html);
  const hasH2 = /<h2[^>]*>/i.test(html);
  const headingGood = hasH1 && hasH2;
  checks.push({
    id: "heading-hierarchy",
    label: "Hierarchie des titres",
    status: headingGood ? "pass" : hasH1 ? "warn" : "fail",
    detail: !hasH1
      ? "Aucun H1"
      : !hasH2
        ? "H1 present mais pas de H2 (hierarchie plate)"
        : "H1 + H2 presents",
    points: headingGood ? 15 : hasH1 ? 7 : 0,
    maxPoints: 15,
  });

  // 4. Landmarks ARIA / semantique HTML5
  const hasMain = /<main\b/i.test(html) || /role=["']main["']/i.test(html);
  const hasNav = /<nav\b/i.test(html) || /role=["']navigation["']/i.test(html);
  const hasFooter = /<footer\b/i.test(html) || /role=["']contentinfo["']/i.test(html);
  const landmarksCount = [hasMain, hasNav, hasFooter].filter(Boolean).length;
  const landmarksGood = landmarksCount === 3;
  checks.push({
    id: "landmarks",
    label: "Landmarks semantiques",
    status: landmarksGood ? "pass" : landmarksCount >= 2 ? "warn" : "fail",
    detail: `${landmarksCount}/3 landmarks (main, nav, footer)`,
    points: landmarksGood ? 20 : landmarksCount >= 2 ? 10 : 0,
    maxPoints: 20,
  });

  // 5. Labels des formulaires
  const inputs = html.match(/<input\b[^>]*>/gi) ?? [];
  const inputsNonHidden = inputs.filter((i) => !/type=["']hidden["']/i.test(i));
  const labelsCount = (html.match(/<label\b/gi) ?? []).length;
  const formGood = inputsNonHidden.length === 0 || labelsCount >= inputsNonHidden.length;
  checks.push({
    id: "form-labels",
    label: "Labels de formulaire",
    status: formGood ? "pass" : "warn",
    detail: inputsNonHidden.length === 0
      ? "Aucun input de formulaire"
      : `${labelsCount} labels pour ${inputsNonHidden.length} inputs`,
    points: formGood ? 15 : 5,
    maxPoints: 15,
  });

  // 6. Skip link / focus visible
  const hasSkipLink = /href=["']#(?:main|content|main-content)["']/i.test(html);
  checks.push({
    id: "skip-link",
    label: "Skip link (navigation clavier)",
    status: hasSkipLink ? "pass" : "warn",
    detail: hasSkipLink ? "Skip link present" : "Pas de skip link detecte",
    points: hasSkipLink ? 15 : 0,
    maxPoints: 15,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "accessibility",
    label: "Accessibilité (WCAG)",
    tier: "free",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Bonnes bases WCAG"
      : pct >= 0.4
        ? "Accessibilité incomplète"
        : "Accessibilité critique",
    checks,
  };
}
