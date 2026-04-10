/**
 * lead-emails.ts — Templates email pour le système de leads
 *
 * 3 templates : bienvenue (J+0), sectoriel (J+3), hot outreach (conditionnel).
 * Chaque lien passe par le redirect tracker pour le scoring comportemental.
 */

const SITE_URL = "https://www.aissabelkoussa.fr";
const FROM_EMAIL = "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>";

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function redirectUrl(to: string, leadId: string, emailId: string): string {
  const params = new URLSearchParams({ to, lid: leadId, eid: emailId });
  return `${SITE_URL}/api/leads/redirect?${params.toString()}`;
}

/* ── Email bienvenue (J+0) ─────────────────────────────────────────── */

export function welcomeEmail(name: string, leadId: string, emailId: string) {
  const pdfLink = redirectUrl(
    `${SITE_URL}/assets/guides/guide-ia-dirigeants-2026.pdf`,
    leadId,
    emailId
  );

  return {
    from: FROM_EMAIL,
    subject: `Votre guide IA est prêt, ${esc(name)}`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <h1 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">Bonjour ${esc(name)},</h1>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Merci d'avoir téléchargé le guide. Voici votre lien :
    </p>
    <a href="${pdfLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Télécharger le guide →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      15 pages, 5 cas d'usage par secteur, les vrais prix.
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
      <a href="${SITE_URL}" style="color:#666;font-size:12px;">aissabelkoussa.fr</a>
    </div>
  </div>
</body></html>`,
  };
}

/* ── Email sectoriel (J+3) ─────────────────────────────────────────── */

const SECTOR_EMAIL_CONTENT: Record<
  string,
  { subject: string; intro: string }
> = {
  btp: {
    subject: "Comment les artisans BTP automatisent leurs devis avec l'IA",
    intro:
      "Un artisan passe en moyenne 3h par devis. L'IA réduit ça à 15 minutes.",
  },
  comptabilite: {
    subject:
      "5 tâches qu'un cabinet comptable peut automatiser dès aujourd'hui",
    intro:
      "40% du temps d'un collaborateur comptable est consacré à des tâches automatisables.",
  },
  immobilier: {
    subject:
      "Votre site d'agence devrait générer des mandats, pas juste afficher des annonces",
    intro:
      "90% des vendeurs commencent par une estimation en ligne. Si vous n'en proposez pas, ils vont ailleurs.",
  },
  courtage: {
    subject: "Courtier : automatisez la qualification et doublez vos RDV",
    intro:
      "Sur 5 RDV, 1 seul mène à un contrat. Un chatbot filtre les 4 autres automatiquement.",
  },
  commerce: {
    subject:
      "Commerce : un site web qui inspire confiance et attire les clients",
    intro:
      "80% des clients font des recherches en ligne avant de se déplacer.",
  },
  autre: {
    subject: "Le ROI concret de l'IA pour une TPE en 2026",
    intro:
      "L'IA promet des gains de 40%. Pour une TPE, voici ce que ça donne en euros.",
  },
};

export function sectorEmail(
  name: string,
  sector: string,
  articleSlug: string,
  ctaPath: string,
  leadId: string,
  emailId: string
) {
  const s = SECTOR_EMAIL_CONTENT[sector] || SECTOR_EMAIL_CONTENT.autre;
  const articleLink = redirectUrl(
    `${SITE_URL}/blog/${articleSlug}`,
    leadId,
    emailId
  );
  const ctaLink = redirectUrl(`${SITE_URL}${ctaPath}`, leadId, emailId);

  return {
    from: FROM_EMAIL,
    subject: `${esc(name)}, ${s.subject.charAt(0).toLowerCase()}${s.subject.slice(1)}`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour ${esc(name)},</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">${s.intro}</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 24px;">
      J'ai écrit un article complet sur le sujet — avec les vrais chiffres et les outils concrets.
    </p>
    <a href="${articleLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Lire l'article →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      Vous voulez savoir où votre entreprise en est ?
      <a href="${ctaLink}" style="color:#1a1a1a;font-weight:600;">Faites le diagnostic gratuit (2 min)</a>
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
    </div>
  </div>
</body></html>`,
  };
}

/* ── Email hot outreach (conditionnel, si clic J+3) ────────────────── */

export function hotOutreachEmail(
  name: string,
  leadId: string,
  emailId: string
) {
  const calendlyLink = redirectUrl(
    "https://calendly.com/aissabelkoussa/30min",
    leadId,
    emailId
  );

  return {
    from: FROM_EMAIL,
    subject: `${esc(name)}, un échange de 15 minutes ?`,
    html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 24px;background:#fafafa;font-family:system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;">
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">Bonjour ${esc(name)},</p>
    <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px;">
      J'ai vu que le sujet de l'IA pour votre activité vous intéresse.
      Si vous voulez en discuter concrètement — pas de vente, juste un échange
      pour voir si je peux vous aider — je suis disponible.
    </p>
    <a href="${calendlyLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Réserver 15 minutes →
    </a>
    <p style="color:#999;font-size:13px;line-height:1.7;margin:24px 0 0;">
      Zéro engagement, zéro spam. Juste une conversation.
    </p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e5e5;">
      <p style="color:#999;font-size:12px;margin:0;">Aïssa BELKOUSSA — Consultant IA, Albi</p>
    </div>
  </div>
</body></html>`,
  };
}
