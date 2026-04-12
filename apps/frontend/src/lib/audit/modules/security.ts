import type { DimensionResult, Check } from "../types";
import type { FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module Sécurité — headers HTTP
   ──────────────────────────────────────────────── */

export async function analyzeSecurity(domain: string, homepage: FetchedPage | null): Promise<DimensionResult> {
  const checks: Check[] = [];
  const headers = homepage?.headers;

  // 1. HTTPS
  const isHttps = homepage?.url.startsWith("https://") ?? false;
  checks.push({
    id: "https",
    label: "HTTPS",
    status: isHttps ? "pass" : "fail",
    detail: isHttps ? "Site servi en HTTPS" : "Site non-HTTPS",
    points: isHttps ? 20 : 0,
    maxPoints: 20,
  });

  // 2. HSTS
  const hsts = headers?.get("strict-transport-security") ?? "";
  const hasHsts = hsts.length > 0;
  checks.push({
    id: "hsts",
    label: "Strict-Transport-Security (HSTS)",
    status: hasHsts ? "pass" : "fail",
    detail: hasHsts ? `Header présent : ${hsts.slice(0, 60)}` : "Header HSTS absent",
    points: hasHsts ? 15 : 0,
    maxPoints: 15,
  });

  // 3. CSP
  const csp = headers?.get("content-security-policy") ?? "";
  const hasCsp = csp.length > 0;
  checks.push({
    id: "csp",
    label: "Content-Security-Policy",
    status: hasCsp ? "pass" : "fail",
    detail: hasCsp ? "CSP configurée" : "Pas de CSP — protection XSS manquante",
    points: hasCsp ? 20 : 0,
    maxPoints: 20,
  });

  // 4. X-Frame-Options (ou frame-ancestors dans CSP)
  const xfo = headers?.get("x-frame-options") ?? "";
  const hasFrameAncestors = /frame-ancestors/i.test(csp);
  const hasAntiClickjack = xfo.length > 0 || hasFrameAncestors;
  checks.push({
    id: "frame-options",
    label: "Protection clickjacking",
    status: hasAntiClickjack ? "pass" : "fail",
    detail: hasAntiClickjack
      ? `Protection active (${xfo || "frame-ancestors"})`
      : "Site vulnérable au clickjacking",
    points: hasAntiClickjack ? 15 : 0,
    maxPoints: 15,
  });

  // 5. Referrer-Policy
  const referrerPolicy = headers?.get("referrer-policy") ?? "";
  const hasReferrerPolicy = referrerPolicy.length > 0;
  checks.push({
    id: "referrer-policy",
    label: "Referrer-Policy",
    status: hasReferrerPolicy ? "pass" : "warn",
    detail: hasReferrerPolicy ? `Configurée : ${referrerPolicy}` : "Header absent (default navigateur)",
    points: hasReferrerPolicy ? 15 : 0,
    maxPoints: 15,
  });

  // 6. Permissions-Policy
  const permissionsPolicy = headers?.get("permissions-policy") ?? "";
  const hasPermissionsPolicy = permissionsPolicy.length > 0;
  checks.push({
    id: "permissions-policy",
    label: "Permissions-Policy",
    status: hasPermissionsPolicy ? "pass" : "warn",
    detail: hasPermissionsPolicy
      ? "Permissions limitées"
      : "Header absent (APIs non restreintes)",
    points: hasPermissionsPolicy ? 15 : 0,
    maxPoints: 15,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "security",
    label: "Sécurité",
    tier: "gated",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Headers de sécurité bien configurés"
      : pct >= 0.4
        ? "Quelques headers manquants"
        : "Site exposé aux attaques courantes",
    checks,
  };
}
