/**
 * Script de création des produits et prix Stripe.
 * À exécuter une seule fois pour initialiser le catalogue.
 *
 * Usage :
 *   npx tsx src/scripts/create-stripe-products.ts
 *
 * Requiert STRIPE_SECRET_KEY dans l'environnement.
 */
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("STRIPE_SECRET_KEY manquante dans l'environnement.");
  process.exit(1);
}

const stripe = new Stripe(secretKey);

const products = [
  {
    name: "Pilote Automatique",
    description:
      "Système d'automatisation clé en main — emails, chatbot IA, notifications, dashboard. Livraison 5 jours.",
    amount: 150000,
    recurring: false,
  },
  {
    name: "Starter",
    description:
      "Premier système automatisé — 1 automatisation clé en main, brief, maquette, formation 1h.",
    amount: 150000,
    recurring: false,
  },
  {
    name: "Pro — Setup",
    description:
      "Système complet multi-briques + 3 mois monitoring et support offerts. Livraison 5-10 jours.",
    amount: 290000,
    recurring: false,
  },
  {
    name: "Pro — Maintenance",
    description:
      "Maintenance mensuelle : monitoring 24/7, bugs sous 48h, MAJ sécurité, rapport mensuel.",
    amount: 49000,
    recurring: true,
  },
  {
    name: "Formation IA Pratique",
    description:
      "1 jour — Prompt engineering + cas d'usage métier + kit IA personnalisé.",
    amount: 49000,
    recurring: false,
  },
  {
    name: "Formation Automatisation",
    description:
      "2 jours — Automatisations Make/n8n, chatbot, email auto, mesure ROI.",
    amount: 89000,
    recurring: false,
  },
  {
    name: "Consulting — Demi-journée",
    description: "Audit, conseil, architecture, implémentation — 4h.",
    amount: 45000,
    recurring: false,
  },
  {
    name: "Consulting — Journée",
    description:
      "Audit, conseil, architecture, implémentation — journée complète 8h.",
    amount: 80000,
    recurring: false,
  },
];

async function main() {
  console.log("Création des produits Stripe...\n");

  for (const p of products) {
    const product = await stripe.products.create({
      name: p.name,
      description: p.description,
      metadata: { created_by: "setup_script" },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: p.amount,
      currency: "eur",
      ...(p.recurring ? { recurring: { interval: "month" } } : {}),
    });

    console.log(`${p.name}: product=${product.id} price=${price.id}`);
  }

  console.log("\nTerminé.");
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
