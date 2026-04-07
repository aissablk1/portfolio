export interface UpsellOffer {
  upsellPlan: string;
  headline: { fr: string; en: string };
  description: { fr: string; en: string };
  originalPrice: number;
  upsellPrice: number;
  badge: { fr: string; en: string };
  cta: { fr: string; en: string };
}

export const UPSELL_MAP: Record<string, UpsellOffer> = {
  starter: {
    upsellPlan: "pro",
    headline: {
      fr: "Passez au systeme complet",
      en: "Upgrade to the full system",
    },
    description: {
      fr: "Vous venez de prendre le Starter. Avec le Pro, vous obtenez un systeme multi-briques + 3 mois de maintenance offerts. Tout est livre, tout est maintenu.",
      en: "You just got the Starter. With Pro, you get a multi-component system + 3 months free maintenance. Everything delivered, everything maintained.",
    },
    originalPrice: 4400,
    upsellPrice: 2900,
    badge: { fr: "Economisez 1 500 EUR", en: "Save EUR 1,500" },
    cta: { fr: "Ajouter le Pro a ma commande", en: "Add Pro to my order" },
  },
  "pilote-automatique": {
    upsellPlan: "pro",
    headline: {
      fr: "Passez au systeme complet",
      en: "Upgrade to the full system",
    },
    description: {
      fr: "Votre automatisation est en route. Ajoutez le systeme complet avec site + dashboard + 3 mois de maintenance.",
      en: "Your automation is on its way. Add the full system with site + dashboard + 3 months maintenance.",
    },
    originalPrice: 4400,
    upsellPrice: 2900,
    badge: { fr: "Economisez 1 500 EUR", en: "Save EUR 1,500" },
    cta: { fr: "Passer au systeme complet", en: "Upgrade to the full system" },
  },
  pro: {
    upsellPlan: "pro-maintenance",
    headline: {
      fr: "Securisez votre investissement",
      en: "Secure your investment",
    },
    description: {
      fr: "Votre systeme sera livre dans 10 jours. Ajoutez la maintenance pour que tout continue de tourner apres les 3 mois offerts : monitoring 24/7, bugs sous 48h, mises a jour securite.",
      en: "Your system will be delivered in 10 days. Add maintenance to keep everything running after the 3 free months: 24/7 monitoring, bugs within 48h, security updates.",
    },
    originalPrice: 590,
    upsellPrice: 490,
    badge: { fr: "490 EUR/mois — sans engagement", en: "EUR 490/mo — no commitment" },
    cta: { fr: "Ajouter la maintenance", en: "Add maintenance" },
  },
  "formation-ia-pratique": {
    upsellPlan: "formation-automatisation",
    headline: {
      fr: "Completez avec l'automatisation",
      en: "Complete with automation",
    },
    description: {
      fr: "Vous maitrisez l'IA. Ajoutez la formation automatisation (2 jours) pour connecter l'IA a vos workflows : Make, n8n, chatbots, emails automatiques.",
      en: "You've mastered AI. Add automation training (2 days) to connect AI to your workflows: Make, n8n, chatbots, automated emails.",
    },
    originalPrice: 1380,
    upsellPrice: 890,
    badge: { fr: "Economisez 490 EUR", en: "Save EUR 490" },
    cta: { fr: "Ajouter la formation", en: "Add the training" },
  },
  "consulting-demi-journee": {
    upsellPlan: "consulting-journee",
    headline: {
      fr: "Passez a la journee complete",
      en: "Upgrade to a full day",
    },
    description: {
      fr: "4 heures c'est bien, 8 heures c'est mieux. Doublez votre temps de consulting pour seulement 350 EUR de plus.",
      en: "4 hours is good, 8 hours is better. Double your consulting time for only EUR 350 more.",
    },
    originalPrice: 900,
    upsellPrice: 800,
    badge: { fr: "Seulement +350 EUR", en: "Only +EUR 350" },
    cta: { fr: "Passer a la journee", en: "Upgrade to full day" },
  },
  audit: {
    upsellPlan: "starter",
    headline: {
      fr: "Passez de l'audit a l'action",
      en: "Go from audit to action",
    },
    description: {
      fr: "Votre audit est en route. Profitez-en : les 47 EUR de votre audit sont deduits du Starter. Votre premier systeme automatise, livre en 5 jours.",
      en: "Your audit is on its way. Take advantage: the EUR 47 from your audit is deducted from the Starter. Your first automated system, delivered in 5 days.",
    },
    originalPrice: 1500,
    upsellPrice: 1453,
    badge: { fr: "47 EUR deduits", en: "EUR 47 deducted" },
    cta: { fr: "Passer a l'action", en: "Take action" },
  },
};
