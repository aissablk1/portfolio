import type { DimensionResult, Check } from "../types";
import type { FetchedPage } from "../fetch-html";

/* ────────────────────────────────────────────────
   Module Credibilite — signaux de confiance
   ──────────────────────────────────────────────── */

export async function analyzeCredibility(domain: string, homepage: FetchedPage | null): Promise<DimensionResult> {
  const checks: Check[] = [];
  const html = homepage?.html ?? "";

  // 1. Mentions legales / Legal notice
  const hasLegal = /mentions[- ]?legales|legal[- ]?notice|impressum/i.test(html)
    || /href=["'][^"']*(?:mentions-legales|legal|impressum)/i.test(html);
  checks.push({
    id: "legal",
    label: "Mentions legales",
    status: hasLegal ? "pass" : "fail",
    detail: hasLegal ? "Lien vers mentions legales present" : "Aucun lien vers mentions legales",
    points: hasLegal ? 20 : 0,
    maxPoints: 20,
  });

  // 2. Politique de confidentialite
  const hasPrivacy = /confidentialite|privacy[- ]?policy|politique[- ]?de[- ]?confidentialite|datenschutz/i.test(html)
    || /href=["'][^"']*(?:privacy|confidentialite|privacidad)/i.test(html);
  checks.push({
    id: "privacy",
    label: "Politique de confidentialite",
    status: hasPrivacy ? "pass" : "fail",
    detail: hasPrivacy ? "Lien vers privacy policy present" : "Aucune politique de confidentialite",
    points: hasPrivacy ? 20 : 0,
    maxPoints: 20,
  });

  // 3. Contact direct (email ou formulaire)
  const hasEmail = /mailto:/i.test(html);
  const hasContactPage = /href=["'][^"']*contact/i.test(html);
  const hasContact = hasEmail || hasContactPage;
  checks.push({
    id: "contact",
    label: "Moyen de contact",
    status: hasContact ? "pass" : "fail",
    detail: hasEmail && hasContactPage
      ? "Email et page de contact"
      : hasEmail
        ? "Lien mailto present"
        : hasContactPage
          ? "Page de contact"
          : "Aucun moyen de contact visible",
    points: hasContact ? 20 : 0,
    maxPoints: 20,
  });

  // 4. Presence sociale (au moins 1 lien vers une plateforme)
  const socialPatterns = [
    /linkedin\.com/i,
    /twitter\.com|x\.com/i,
    /github\.com/i,
    /facebook\.com/i,
    /instagram\.com/i,
    /youtube\.com/i,
  ];
  const socialCount = socialPatterns.filter((re) => re.test(html)).length;
  const socialGood = socialCount >= 2;
  checks.push({
    id: "social-proof",
    label: "Presence sociale",
    status: socialGood ? "pass" : socialCount === 1 ? "warn" : "fail",
    detail: `${socialCount} reseau(x) social(aux) reference(s)`,
    points: socialGood ? 15 : socialCount === 1 ? 7 : 0,
    maxPoints: 15,
  });

  // 5. Copyright a jour
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const copyrightPattern = new RegExp(`(?:©|&copy;|copyright)\\s*.*?(?:${currentYear}|${previousYear})`, "i");
  const hasRecentCopyright = copyrightPattern.test(html);
  checks.push({
    id: "copyright",
    label: "Copyright a jour",
    status: hasRecentCopyright ? "pass" : "warn",
    detail: hasRecentCopyright
      ? `Copyright ${currentYear} ou ${previousYear} detecte`
      : `Pas de copyright recent (attendu : ${currentYear})`,
    points: hasRecentCopyright ? 10 : 0,
    maxPoints: 10,
  });

  // 6. Temoignages / avis (signaux de preuve sociale)
  const hasTestimonials = /temoignage|testimonial|avis|review|rating/i.test(html)
    || /"@type"\s*:\s*"Review"/i.test(html)
    || /"@type"\s*:\s*"AggregateRating"/i.test(html);
  checks.push({
    id: "testimonials",
    label: "Temoignages / avis",
    status: hasTestimonials ? "pass" : "warn",
    detail: hasTestimonials ? "Signaux de preuve sociale detectes" : "Pas de temoignages visibles",
    points: hasTestimonials ? 15 : 0,
    maxPoints: 15,
  });

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const pct = maxScore > 0 ? score / maxScore : 0;

  return {
    id: "credibility",
    label: "Credibilite",
    tier: "gated",
    score,
    maxScore,
    verdict: pct >= 0.7 ? "good" : pct >= 0.4 ? "warning" : "critical",
    summary: pct >= 0.7
      ? "Site inspire confiance"
      : pct >= 0.4
        ? "Signaux de confiance incomplets"
        : "Manque de credibilite",
    checks,
  };
}
