export type StripePlan =
  | "pilote-automatique"
  | "starter"
  | "pro"
  | "formation-ia-pratique"
  | "formation-automatisation"
  | "consulting-demi-journee"
  | "consulting-journee";

export interface StripeProduct {
  name: string;
  description: string;
  priceId: string;
  amount: number;
  mode: "payment" | "subscription";
  recurringPriceId?: string;
  trialDays?: number;
}

export const STRIPE_PRODUCTS: Record<StripePlan, StripeProduct> = {
  "pilote-automatique": {
    name: "Pilote Automatique",
    description:
      "Systeme d'automatisation cle en main — emails, chatbot IA, notifications, dashboard. Livraison 5 jours.",
    priceId: "price_1TIDXrBJITi85SXR9cTLn1aP",
    amount: 150000,
    mode: "payment",
  },
  starter: {
    name: "Starter",
    description:
      "Premier systeme automatise — 1 automatisation cle en main, brief, maquette, formation 1h.",
    priceId: "price_1TIDXrBJITi85SXRCcg4hTm2",
    amount: 150000,
    mode: "payment",
  },
  pro: {
    name: "Pro — Setup",
    description:
      "Systeme complet multi-briques + 3 mois monitoring et support offerts. Livraison 5-10 jours.",
    priceId: "price_1TIDXsBJITi85SXRzFlVJ084",
    amount: 290000,
    mode: "payment",
  },
  "formation-ia-pratique": {
    name: "Formation IA Pratique",
    description:
      "1 jour — Prompt engineering + cas d'usage metier + kit IA personnalise.",
    priceId: "price_1TIDXtBJITi85SXR1nAJ989i",
    amount: 49000,
    mode: "payment",
  },
  "formation-automatisation": {
    name: "Formation Automatisation",
    description:
      "2 jours — Automatisations Make/n8n, chatbot, email auto, mesure ROI.",
    priceId: "price_1TIDXuBJITi85SXRz9WXlw8F",
    amount: 89000,
    mode: "payment",
  },
  "consulting-demi-journee": {
    name: "Consulting — Demi-journee",
    description: "Audit, conseil, architecture, implementation — 4h.",
    priceId: "price_1TIDXvBJITi85SXRzXwAZHKE",
    amount: 45000,
    mode: "payment",
  },
  "consulting-journee": {
    name: "Consulting — Journee",
    description:
      "Audit, conseil, architecture, implementation — journee complete 8h.",
    priceId: "price_1TIDXvBJITi85SXRUvgu4llx",
    amount: 80000,
    mode: "payment",
  },
};

/**
 * Pro — Maintenance (abonnement mensuel)
 * A utiliser separement pour les checkout en mode subscription.
 */
/**
 * Tripwire — Audit Digital Express (47 EUR)
 * TODO: Creer le prix dans Stripe Dashboard et remplacer le priceId ci-dessous.
 */
export const STRIPE_TRIPWIRE = {
  name: "Audit Digital Express",
  description:
    "Rapport d'audit personnalise de votre presence digitale. Livre par email sous 24h.",
  priceId: "price_TRIPWIRE_TODO", // A remplacer apres creation dans Stripe
  amount: 4700,
  mode: "payment" as const,
};

export const STRIPE_MAINTENANCE_SUBSCRIPTION = {
  name: "Pro — Maintenance",
  description:
    "Maintenance mensuelle : monitoring 24/7, bugs sous 48h, MAJ securite, rapport mensuel.",
  priceId: "price_1TIDXtBJITi85SXRLoRXTukX",
  amount: 49000,
  mode: "subscription" as const,
};
