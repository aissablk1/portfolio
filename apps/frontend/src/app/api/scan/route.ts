import { NextRequest, NextResponse } from "next/server";

/* ────────────────────────────────────────────────
   Scanner IA — API Route
   Analyse technique d'un domaine pour évaluer sa
   "visibilité IA" (GEO readiness).
   ──────────────────────────────────────────────── */

interface ScanResult {
  domain: string;
  score: number;
  maxScore: number;
  verdict: "critical" | "warning" | "good";
  checks: {
    id: string;
    label: string;
    status: "pass" | "warn" | "fail";
    detail: string;
    points: number;
    maxPoints: number;
  }[];
  scannedAt: string;
}

const TIMEOUT = 8000;

async function safeFetch(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "AissaBelkoussa-Scanner/1.0" },
      redirect: "follow",
    });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}

function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/\/+$/, "");
  d = d.replace(/^www\./, "");
  return d;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawDomain = body.domain as string;

    if (!rawDomain || rawDomain.length < 3) {
      return NextResponse.json({ error: "Domaine invalide" }, { status: 400 });
    }

    const domain = normalizeDomain(rawDomain);
    const baseUrl = `https://${domain}`;
    const checks: ScanResult["checks"] = [];

    // ── 1. Homepage accessible ──────────────────
    const homepageRes = await safeFetch(baseUrl);
    const homepageHtml = homepageRes?.ok ? await homepageRes.text() : "";
    const homepageOk = homepageRes?.ok ?? false;

    checks.push({
      id: "homepage",
      label: "Site accessible (HTTPS)",
      status: homepageOk ? "pass" : "fail",
      detail: homepageOk
        ? `${domain} accessible en HTTPS (${homepageRes?.status})`
        : `Impossible d'accéder a ${domain}`,
      points: homepageOk ? 10 : 0,
      maxPoints: 10,
    });

    if (!homepageOk) {
      return NextResponse.json({
        domain,
        score: 0,
        maxScore: 100,
        verdict: "critical" as const,
        checks,
        scannedAt: new Date().toISOString(),
      } satisfies ScanResult);
    }

    // ── 2. Meta description ─────────────────────
    const metaMatch = homepageHtml.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
    ) ?? homepageHtml.match(
      /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i
    );
    const metaDesc = metaMatch?.[1] ?? "";
    const metaLen = metaDesc.length;
    const metaGood = metaLen >= 80 && metaLen <= 200;

    checks.push({
      id: "meta-description",
      label: "Meta description optimisee",
      status: metaGood ? "pass" : metaLen > 0 ? "warn" : "fail",
      detail: metaLen === 0
        ? "Aucune meta description trouvee"
        : metaGood
          ? `Meta description presente (${metaLen} caracteres)`
          : `Meta description trop ${metaLen < 80 ? "courte" : "longue"} (${metaLen} car.)`,
      points: metaGood ? 10 : metaLen > 0 ? 5 : 0,
      maxPoints: 10,
    });

    // ── 3. Title tag ────────────────────────────
    const titleMatch = homepageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
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
          ? `Title presente (${titleLen} car.)`
          : `Title ${titleLen < 30 ? "trop courte" : "trop longue"} (${titleLen} car.)`,
      points: titleGood ? 10 : titleLen > 0 ? 5 : 0,
      maxPoints: 10,
    });

    // ── 4. Schema.org / JSON-LD ─────────────────
    const schemaMatches = homepageHtml.match(
      /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );
    const schemaCount = schemaMatches?.length ?? 0;
    const hasOrg = homepageHtml.includes('"Organization"') || homepageHtml.includes('"LocalBusiness"');
    const schemaGood = schemaCount >= 2 && hasOrg;

    checks.push({
      id: "schema",
      label: "Donnees structurees (Schema.org)",
      status: schemaGood ? "pass" : schemaCount > 0 ? "warn" : "fail",
      detail: schemaCount === 0
        ? "Aucune donnee structuree JSON-LD detectee"
        : schemaGood
          ? `${schemaCount} blocs JSON-LD dont Organisation/LocalBusiness`
          : `${schemaCount} bloc(s) JSON-LD mais pas d'entite Organisation`,
      points: schemaGood ? 15 : schemaCount > 0 ? 7 : 0,
      maxPoints: 15,
    });

    // ── 5. Headings structure (H1) ──────────────
    const h1Matches = homepageHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
    const h1Count = h1Matches?.length ?? 0;
    const h1Good = h1Count === 1;

    checks.push({
      id: "h1",
      label: "Structure des titres (H1 unique)",
      status: h1Good ? "pass" : h1Count > 0 ? "warn" : "fail",
      detail: h1Count === 0
        ? "Aucune balise H1 trouvee"
        : h1Good
          ? "Une balise H1 unique detectee"
          : `${h1Count} balises H1 detectees (devrait etre 1)`,
      points: h1Good ? 10 : h1Count > 0 ? 5 : 0,
      maxPoints: 10,
    });

    // ── 6. robots.txt ───────────────────────────
    const robotsRes = await safeFetch(`${baseUrl}/robots.txt`);
    const robotsTxt = robotsRes?.ok ? await robotsRes.text() : "";
    const hasRobots = robotsRes?.ok && robotsTxt.length > 10;
    const blocksCrawl = robotsTxt.includes("Disallow: /") && !robotsTxt.includes("Disallow: /\n");

    checks.push({
      id: "robots",
      label: "Fichier robots.txt",
      status: hasRobots && !blocksCrawl ? "pass" : hasRobots ? "warn" : "fail",
      detail: !hasRobots
        ? "Aucun fichier robots.txt"
        : blocksCrawl
          ? "robots.txt bloque potentiellement l'indexation"
          : "robots.txt present et ouvert",
      points: hasRobots && !blocksCrawl ? 10 : hasRobots ? 5 : 0,
      maxPoints: 10,
    });

    // ── 7. Sitemap ──────────────────────────────
    const sitemapUrl = robotsTxt.match(/Sitemap:\s*(.+)/i)?.[1]?.trim() ?? `${baseUrl}/sitemap.xml`;
    const sitemapRes = await safeFetch(sitemapUrl);
    const hasSitemap = sitemapRes?.ok && (sitemapRes.headers.get("content-type")?.includes("xml") ?? false);

    checks.push({
      id: "sitemap",
      label: "Sitemap XML",
      status: hasSitemap ? "pass" : "fail",
      detail: hasSitemap
        ? "Sitemap XML accessible"
        : "Aucun sitemap XML trouve",
      points: hasSitemap ? 10 : 0,
      maxPoints: 10,
    });

    // ── 8. llms.txt (nouveau standard GEO) ──────
    const llmsRes = await safeFetch(`${baseUrl}/llms.txt`);
    const hasLlms = llmsRes?.ok && (await llmsRes.text()).length > 10;

    checks.push({
      id: "llms-txt",
      label: "Fichier llms.txt (standard GEO)",
      status: hasLlms ? "pass" : "warn",
      detail: hasLlms
        ? "llms.txt present — votre site guide les IA"
        : "Pas de llms.txt — les IA ne savent pas comment lire votre site",
      points: hasLlms ? 15 : 0,
      maxPoints: 15,
    });

    // ── 9. Open Graph tags ──────────────────────
    const hasOgTitle = /property=["']og:title["']/i.test(homepageHtml);
    const hasOgDesc = /property=["']og:description["']/i.test(homepageHtml);
    const hasOgImage = /property=["']og:image["']/i.test(homepageHtml);
    const ogScore = [hasOgTitle, hasOgDesc, hasOgImage].filter(Boolean).length;

    checks.push({
      id: "og-tags",
      label: "Open Graph (partage social)",
      status: ogScore === 3 ? "pass" : ogScore > 0 ? "warn" : "fail",
      detail: ogScore === 3
        ? "Tags Open Graph complets (title, description, image)"
        : ogScore > 0
          ? `Open Graph partiel (${ogScore}/3 tags)`
          : "Aucun tag Open Graph",
      points: ogScore === 3 ? 10 : ogScore > 0 ? 4 : 0,
      maxPoints: 10,
    });

    // ── Scoring final ───────────────────────────
    const score = checks.reduce((sum, c) => sum + c.points, 0);
    const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);

    let verdict: ScanResult["verdict"] = "critical";
    if (score >= 70) verdict = "good";
    else if (score >= 40) verdict = "warning";

    return NextResponse.json({
      domain,
      score,
      maxScore,
      verdict,
      checks,
      scannedAt: new Date().toISOString(),
    } satisfies ScanResult);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du scan" },
      { status: 500 }
    );
  }
}
