import type { DimensionResult, Check } from "../types";
import { fetchText, type FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module SEO — 4 checks techniques
   ──────────────────────────────────────────────── */

export async function analyzeSeo(domain: string, homepage: FetchedPage | null): Promise<DimensionResult> {
  const checks: Check[] = [];
  const baseUrl = `https://${domain}`;
  const html = homepage?.html ?? "";

  // 1. Meta description
  const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    ?? html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  const metaDesc = metaMatch?.[1] ?? "";
  const metaLen = metaDesc.length;
  const metaGood = metaLen >= 80 && metaLen <= 200;
  checks.push({
    id: "meta-description",
    label: "Meta description",
    status: metaGood ? "pass" : metaLen > 0 ? "warn" : "fail",
    detail: metaLen === 0
      ? "Aucune meta description"
      : metaGood
        ? `Présente (${metaLen} caractères)`
        : `Trop ${metaLen < 80 ? "courte" : "longue"} (${metaLen} car.)`,
    points: metaGood ? 25 : metaLen > 0 ? 12 : 0,
    maxPoints: 25,
  });

  // 2. Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const titleText = titleMatch?.[1]?.trim() ?? "";
  const titleLen = titleText.length;
  const titleGood = titleLen >= 30 && titleLen <= 70;
  checks.push({
    id: "title",
    label: "Balise title",
    status: titleGood ? "pass" : titleLen > 0 ? "warn" : "fail",
    detail: titleLen === 0
      ? "Aucune balise title"
      : titleGood
        ? `Présente (${titleLen} car.)`
        : `${titleLen < 30 ? "Trop courte" : "Trop longue"} (${titleLen} car.)`,
    points: titleGood ? 25 : titleLen > 0 ? 12 : 0,
    maxPoints: 25,
  });

  // 3. H1 structure
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h1Count = h1Matches?.length ?? 0;
  const h1Good = h1Count === 1;
  checks.push({
    id: "h1",
    label: "Structure H1",
    status: h1Good ? "pass" : h1Count > 0 ? "warn" : "fail",
    detail: h1Count === 0
      ? "Aucun H1"
      : h1Good
        ? "Un H1 unique"
        : `${h1Count} H1 (devrait être 1)`,
    points: h1Good ? 20 : h1Count > 0 ? 10 : 0,
    maxPoints: 20,
  });

  // 4. Sitemap
  const sitemapContent = await fetchText(`${baseUrl}/sitemap.xml`);
  const hasSitemap = sitemapContent !== null && sitemapContent.includes("<urlset");
  checks.push({
    id: "sitemap",
    label: "Sitemap XML",
    status: hasSitemap ? "pass" : "fail",
    detail: hasSitemap ? "Sitemap accessible" : "Aucun sitemap.xml",
    points: hasSitemap ? 30 : 0,
    maxPoints: 30,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "seo",
    label: "SEO technique",
    tier: "free",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Fondations SEO solides"
      : pct >= 0.4
        ? "SEO incomplet"
        : "SEO critique",
    checks,
  };
}
