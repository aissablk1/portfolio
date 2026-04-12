import type { DimensionResult, Check } from "../types";
import { fetchText, type FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module GEO — Visibilite dans les reponses IA
   ──────────────────────────────────────────────── */

export async function analyzeGeo(domain: string, homepage: FetchedPage | null): Promise<DimensionResult> {
  const checks: Check[] = [];
  const baseUrl = `https://${domain}`;
  const html = homepage?.html ?? "";

  // 1. llms.txt
  const llmsContent = await fetchText(`${baseUrl}/llms.txt`);
  const hasLlms = llmsContent !== null && llmsContent.length > 20;
  checks.push({
    id: "llms-txt",
    label: "Fichier llms.txt",
    status: hasLlms ? "pass" : "fail",
    detail: hasLlms
      ? "llms.txt present — guide les IA"
      : "Pas de llms.txt — les IA n'ont pas de guide",
    points: hasLlms ? 25 : 0,
    maxPoints: 25,
  });

  // 2. Schema.org de qualite (Organization, Person, Service, LocalBusiness)
  const schemaMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  const allSchemas = schemaMatches.join(" ");
  const hasOrg = /"@type"\s*:\s*"(?:Organization|LocalBusiness|Person)"/i.test(allSchemas);
  const hasService = /"@type"\s*:\s*"(?:Service|ProfessionalService)"/i.test(allSchemas);
  const schemaScore = [hasOrg, hasService].filter(Boolean).length;
  checks.push({
    id: "schema-entity",
    label: "Entites structurees (Schema.org)",
    status: schemaScore === 2 ? "pass" : schemaScore === 1 ? "warn" : "fail",
    detail: schemaScore === 0
      ? "Aucune entite structuree"
      : `Entites presentes : ${[hasOrg && "Organization", hasService && "Service"].filter(Boolean).join(", ")}`,
    points: schemaScore === 2 ? 20 : schemaScore === 1 ? 10 : 0,
    maxPoints: 20,
  });

  // 3. FAQ structuree
  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/i.test(allSchemas);
  checks.push({
    id: "faq-schema",
    label: "FAQ structuree",
    status: hasFaqSchema ? "pass" : "warn",
    detail: hasFaqSchema
      ? "FAQPage schema detecte — les IA adorent ce format"
      : "Pas de FAQPage schema",
    points: hasFaqSchema ? 15 : 0,
    maxPoints: 15,
  });

  // 4. H2 au format question (signal Q&A)
  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) ?? [];
  const h2Texts = h2Matches.map((h) => h.replace(/<[^>]+>/g, "").trim());
  const questionH2s = h2Texts.filter((t) => /\?$/.test(t) || /^(comment|pourquoi|quel|quelle|qu[e']|est-ce|quand|ou|how|why|what|when|where)/i.test(t));
  const hasQA = questionH2s.length >= 2;
  checks.push({
    id: "qa-format",
    label: "Format question/reponse",
    status: hasQA ? "pass" : questionH2s.length === 1 ? "warn" : "fail",
    detail: `${questionH2s.length} titre(s) au format question detecte(s)`,
    points: hasQA ? 15 : questionH2s.length === 1 ? 7 : 0,
    maxPoints: 15,
  });

  // 5. robots.txt n'exclut pas les bots IA
  const robotsContent = await fetchText(`${baseUrl}/robots.txt`);
  const robots = robotsContent ?? "";
  const blocksGptBot = /User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//i.test(robots);
  const blocksClaudeBot = /User-agent:\s*ClaudeBot[\s\S]*?Disallow:\s*\//i.test(robots);
  const blocksPerplexity = /User-agent:\s*PerplexityBot[\s\S]*?Disallow:\s*\//i.test(robots);
  const aiBlocked = blocksGptBot || blocksClaudeBot || blocksPerplexity;
  checks.push({
    id: "ai-crawlers",
    label: "Acces des crawlers IA",
    status: aiBlocked ? "fail" : "pass",
    detail: aiBlocked
      ? "Des bots IA sont bloques dans robots.txt"
      : "Tous les crawlers IA peuvent acceder au site",
    points: aiBlocked ? 0 : 25,
    maxPoints: 25,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "geo",
    label: "Visibilité IA (GEO)",
    tier: "gated",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Site bien positionne pour les IA"
      : pct >= 0.4
        ? "Quelques signaux manquants"
        : "Invisible pour les IA",
    checks,
  };
}
