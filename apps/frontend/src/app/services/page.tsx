"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Globe,
  BarChart3,
  Bot,
  GraduationCap,
  Briefcase,
  BadgeEuro,
  Users,
  Landmark,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import ExitIntentModal from "@/components/ExitIntentModal";
import CheckoutButton from "@/components/CheckoutButton";

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — FR / EN
   ──────────────────────────────────────────────────────────────────────────── */

const content = {
  fr: {
    hero: {
      title: "Systèmes IA clé en main — à partir de 1 500 €, livrés en 5 jours",
      subtitle:
        "Automatisation, site professionnel, dashboards — prix fixe garanti, 3 mois de maintenance offerts. Formation IA dès 490 €/personne.",
    },

    /* ── Section 2 : Expertise ── */
    expertise: {
      sectionBadge: "Expertise",
      categories: [
        {
          title: "Automatisation & Process",
          badge: "Le plus demandé",
          subtitle:
            "Les entreprises qui automatisent leurs relances et emails récupèrent 10 à 15 heures par semaine. Voici les 5 briques que je déploie.",
          items: [
            "Séquences email automatiques",
            "Chatbot IA sur-mesure",
            "CRM et workflows (n8n/Make)",
            "Prise de RDV en ligne",
            "Relances automatiques",
          ],
        },
        {
          title: "Sites & Conversion",
          badge: null,
          subtitle:
            "Un site professionnel optimisé génère 3 à 5× plus de leads qu'un site vitrine classique. En 2026, vos clients cherchent aussi sur ChatGPT et Perplexity — je construis des sites visibles partout.",
          items: [
            "Site professionnel haute performance",
            "Landing pages optimisées",
            "Tunnels de conversion",
            "SEO local + GEO (visibilité Google & IA)",
            "Données structurées Schema.org",
            "Formulaires intelligents",
          ],
        },
        {
          title: "Pilotage & Intelligence",
          badge: null,
          subtitle:
            "80 % des PME prennent leurs décisions sans dashboard. Un tableau de bord temps réel réduit le délai de décision de 60 %.",
          items: [
            "Dashboards temps réel",
            "KPI et reporting automatisé",
            "Alertes et seuils intelligents",
            "Intégration IA décisionnelle",
          ],
        },
      ],
    },

    /* ── Section 3 : Pricing tiers ── */
    pricing: {
      sectionBadge: "Tarifs",
      title: "3 formules de 1 500 € à 6 900 € — prix fixe, livraison 5 à 10 jours",
      tiers: [
        {
          name: "Starter",
          price: "1 500 \u20ac",
          tagline: "Votre premier système automatisé",
          features: [
            "1 automatisation clé en main (chatbot OU emails OU prise de RDV)",
            "Brief + maquette validée",
            "Livraison 5 jours",
            "Formation 1h incluse",
          ],
          cta: "Démarrer",
          ctaLink: "/contact?plan=starter",
          highlighted: false,
          badge: null,
          monthly: null,
          checkoutPlan: "pilote-automatique" as string | null,
        },
        {
          name: "Pro",
          price: "2 900 \u20ac",
          tagline:
            "Le système complet + 3 mois de tranquillité",
          features: [
            "Système clé en main multi-briques",
            "3 mois monitoring + support offerts (valeur 1 470 \u20ac)",
            "Bugs corrigés sous 48h",
            "MAJ sécurité + rapport mensuel",
            "Livraison 5-10 jours",
          ],
          cta: "Choisir Pro",
          ctaLink: "/contact?plan=pro",
          highlighted: true,
          badge: "Recommandé",
          monthly: "Puis 490 \u20ac/mois. Sans engagement.",
          checkoutPlan: "pro" as string | null,
        },
        {
          name: "Sur-mesure",
          price: "à partir de 6 900 \u20ac",
          tagline: "Votre partenaire technique dédié",
          features: [
            "Système complet (site + IA + data)",
            "Intégration IA sur-mesure",
            "3 mois évolution + support Premium (valeur 5 700 \u20ac)",
            "10h/mois d\u2019évolutions",
            "Support prioritaire 24h",
            "Réunion stratégique mensuelle",
          ],
          cta: "Discuter du projet",
          ctaLink: "/contact?plan=sur-mesure",
          highlighted: false,
          badge: null,
          monthly: "Puis 1 900 \u20ac/mois. Sans engagement.",
          checkoutPlan: null as string | null,
        },
      ],
    },

    /* ── Section 4 : Pilote Automatique ── */
    pilote: {
      badge: "Nouveau — Offre d\u2019entrée",
      title: "Pilote Automatique — 1 500 \u20ac",
      subtitle: "Votre business tourne tout seul en 5 jours",
      features: [
        "5 emails automatiques personnalisés",
        "Chatbot IA entraîné sur vos FAQ",
        "Notifications prospect chaud",
        "Dashboard de suivi",
      ],
      delivery: "Livraison : 5 jours ouvrés",
      option: "Maintenance : 290 \u20ac/mois (optionnel)",
      cta: "Commander le Pilote Automatique",
      ctaLink: "/contact?plan=pilote-automatique",
    },

    /* ── Section 5 : Formations ── */
    formation: {
      sectionBadge: "Formation",
      title: "Formation IA pour entreprises — de 1 à 5 jours, à partir de 490 €/personne, finançable OPCO à 100 %",
      cards: [
        {
          name: "IA Pratique",
          duration: "1 jour",
          priceInter: "490 \u20ac/personne (inter)",
          priceIntra: "1 500 \u20ac (intra, groupe 6-12)",
          features: [
            "Prompt engineering",
            "Cas d\u2019usage métier",
            "Kit IA personnalisé",
          ],
          tagline: "Vos équipes repartent opérationnelles",
        },
        {
          name: "Automatiser son business",
          duration: "2 jours",
          priceInter: "890 \u20ac/personne (inter)",
          priceIntra: "2 800 \u20ac (intra)",
          features: [
            "Automatisations Make/n8n",
            "Chatbot, email auto",
            "Mesure ROI",
          ],
          tagline:
            "2-3 automatisations déployées pendant la formation",
        },
        {
          name: "Sur-mesure",
          duration: "3-5 jours",
          priceInter: "800 \u20ac/jour",
          priceIntra: null,
          features: [
            "Audit préalable",
            "Programme personnalisé",
            "Suivi 3 mois",
          ],
          tagline: "Transformation IA structurée",
        },
      ],
    },

    /* ── Section 6 : Consulting TJM ── */
    consulting: {
      title: "Consulting IA & digital — 450 €/demi-journée, 800 €/jour, 3 600 €/semaine",
      subtitle:
        "Audit, conseil, architecture, implémentation — à la carte",
      rates: [
        { label: "Demi-journée", price: "450 \u20ac" },
        { label: "Journée", price: "800 \u20ac" },
        { label: "Semaine", price: "3 600 \u20ac" },
        { label: "Mois", price: "6 800 \u20ac" },
      ],
    },

    /* ── Section 7 : Aides financières ── */
    aides: {
      title: "4 aides publiques pour financer jusqu'à 100 % de votre projet digital",
      note: "Je vous accompagne dans le montage du dossier de financement.",
      cards: [
        {
          name: "OPCO",
          desc: "Jusqu\u2019à 100% pour les entreprises de moins de 50 salariés",
          context: "Formation",
        },
        {
          name: "OCCAL",
          desc: "Jusqu\u2019à 70% des dépenses, plafond 23 000 \u20ac",
          context: "Artisans, commerce",
        },
        {
          name: "Pass Occitanie",
          desc: "50% des dépenses, plafond 10 000 \u20ac",
          context: "TPE/PME",
        },
        {
          name: "IA Booster France 2030",
          desc: "Diagnostic + formation gratuits",
          context: "Bpifrance",
        },
      ],
    },

    /* ── Section 8 : Comparatif ── */
    comparatif: {
      badge: "Comparatif",
      title: "Agence (10-50K €, 2-6 mois) vs freelance spécialisé (1 500 €, 5 jours) — comparatif",
      subtitle:
        "Comparez les modèles. Choisissez en connaissance de cause.",
      columns: [
        "",
        "Agence web",
        "Freelance low-cost",
        "SaaS (Axonaut, etc.)",
        "Aïssa BELKOUSSA",
      ],
      rows: [
        {
          label: "Délai",
          values: ["2-6 mois", "1-3 semaines", "Immédiat", "5-10 jours"],
        },
        {
          label: "Prix",
          values: [
            "10 000-50 000 \u20ac",
            "500-2 000 \u20ac",
            "50-200 \u20ac/mois",
            "À partir de 1 500 \u20ac",
          ],
        },
        {
          label: "Maintenance",
          values: [
            "Supplément coûteux",
            "Aucune ou limitée",
            "Incluse (générique)",
            "3 mois offerts",
          ],
        },
        {
          label: "IA intégrée",
          values: ["Rarement", "Non", "Basique", "Sur-mesure"],
        },
        {
          label: "Visibilité IA (GEO)",
          values: ["Non", "Non", "Non", "Inclus"],
        },
        {
          label: "Formation incluse",
          values: ["Payante", "Non", "Documentation", "Oui (1h+)"],
        },
        {
          label: "Sur-mesure",
          values: ["Oui (cher)", "Partiel", "Non", "100%"],
        },
        {
          label: "Code source",
          values: [
            "Rarement",
            "Variable",
            "Non applicable (N/A)",
            "Licence d'usage complète",
          ],
        },
      ],
    },

    /* ── Section 9 : Maintenance ── */
    maintenance: {
      badge: "Maintenance",
      title: "Maintenance site & IA — 490 €/mois (Essentiel) ou 1 900 €/mois (Premium), -25 % en annuel",
      subtitle:
        "Après les 3 mois offerts, gardez votre système au top.",
      plans: [
        {
          name: "Essentiel",
          price: "490 \u20ac/mois",
          priceYearly: "368 \u20ac/mois",
          priceYearlyTotal: "4 410 \u20ac/an (soit 3 mois offerts)",
          features: [
            "MAJ sécurité et performances",
            "Monitoring 24/7",
            "Bugs corrigés sous 48h",
            "Rapport mensuel",
            "Support par email",
          ],
        },
        {
          name: "Premium",
          price: "1 900 \u20ac/mois",
          priceYearly: "1 425 \u20ac/mois",
          priceYearlyTotal: "17 100 \u20ac/an (soit 3 mois offerts)",
          features: [
            "Tout Essentiel +",
            "10h/mois d\u2019évolutions",
            "Support prioritaire 24h",
            "Réunion stratégique mensuelle",
            "Optimisation IA continue",
          ],
        },
      ],
      annualNote:
        "Engagement annuel : -25% (3 mois offerts sur 12). Sans engagement sinon.",
    },

    /* ── Section 10 : FAQ ── */
    faq: [
      {
        q: "Que se passe-t-il si j\u2019arrête la maintenance ?",
        a: "Votre site reste en ligne et fonctionnel. Mais sans mises à jour régulières, les performances SEO se dégradent, les failles de sécurité ne sont plus corrigées, et votre système ne s\u2019adapte plus aux évolutions du marché. En moyenne, un site non maintenu perd 20-35% de son trafic organique en 6 mois.",
      },
      {
        q: "Pourquoi 3 mois offerts ?",
        a: "Un système digital a besoin de 3 mois pour atteindre son plein potentiel. Pendant cette période, on optimise, on ajuste, on mesure. Vous voyez les résultats concrets avant de vous engager sur la suite.",
      },
      {
        q: "Et si je ne sais pas exactement ce dont j\u2019ai besoin ?",
        a: "C\u2019est le cas de 80% de mes clients au premier appel. L\u2019échange de 30 minutes sert exactement à ça : clarifier votre besoin, identifier la bonne approche, et vous proposer le format adapté. Aucun engagement.",
      },
      {
        q: "Est-ce que je suis propriétaire du code ?",
        a: "Vous bénéficiez d\u2019une licence d\u2019usage complète et illimitée dans le temps. Vous exploitez votre projet en toute liberté. La propriété intellectuelle reste au prestataire, ce qui garantit la maintenance et l\u2019évolution continue de vos outils.",
      },
      {
        q: "Je peux gérer moi-même la maintenance ?",
        a: "Oui. Après les 3 mois offerts, vous êtes libre de gérer la maintenance en interne si vous avez les compétences techniques. Votre système reste fonctionnel.",
      },
      {
        q: "Que se passe-t-il si le projet prend plus de temps ?",
        a: "Les prix sont forfaitaires. Si le projet dépasse le cadre prévu pour des raisons de mon côté, je ne facture pas le surplus. Si le périmètre évolue de votre côté, on en discute et on ajuste ensemble.",
      },
      {
        q: "L\u2019abonnement est-il avec engagement ?",
        a: "Non. Après les 3 mois offerts, la maintenance est sans engagement — vous pouvez arrêter à tout moment. L\u2019engagement annuel est une option qui vous fait économiser 25% (3 mois gratuits sur 12).",
      },
      {
        q: "Comment financer le projet avec mon OPCO ?",
        a: "Je vous aide à monter le dossier. Pour les entreprises de moins de 50 salariés, la formation peut être prise en charge à 100%.",
      },
      {
        q: "Proposez-vous des formations ?",
        a: "Oui, de 1 jour (acculturation IA) à 5 jours (transformation complète). Finançables OPCO.",
      },
    ],

    /* ── Section 11 : Final CTA ── */
    finalCta: {
      title: "Premier échange gratuit.\n30 min. Zéro engagement.",
      cta: "Prendre rendez-vous",
    },

    /* ── UI strings ── */
    ui: {
      servicesAndPricing: "Services & Tarifs",
      getProposal: "Recevoir ma proposition",
      seePricing: "Voir les tarifs",
      threePillars: "Trois piliers pour votre croissance",
      included: "Inclus",
      funding: "Financement",
      billingFrequency: "Fréquence de facturation",
      monthly: "Mensuel",
      annual: "Annuel",
      learnMore: "En savoir plus",
      faqTitle: "9 questions fréquentes sur les systèmes IA, les prix et la maintenance",
      faqSubtitle: "Tout ce que vous devez savoir avant de lancer votre système. Une question manque ? Échangeons.",
      finalCtaSubtitle: "On regarde ensemble si je peux vous aider. Pas de commercial, pas de bullshit.",
      stickyCta: "Premier échange gratuit — 30 min",
    },
  },

  en: {
    hero: {
      title: "Systems that work for you",
      subtitle:
        "Build, automate, train — fixed price, guaranteed results",
    },

    expertise: {
      sectionBadge: "Expertise",
      categories: [
        {
          title: "Automation & Process",
          badge: "Most requested",
          subtitle:
            "The systems that run your business without you",
          items: [
            "Automated email sequences",
            "Custom AI chatbot",
            "CRM and workflows (n8n/Make)",
            "Online appointment booking",
            "Automated follow-ups",
          ],
        },
        {
          title: "Sites & Conversion",
          badge: null,
          subtitle:
            "The interfaces that turn visitors into customers — on Google and in AI responses",
          items: [
            "High-performance professional website",
            "Optimized landing pages",
            "Conversion tunnels",
            "Local SEO + GEO (Google & AI visibility)",
            "Schema.org structured data",
            "Smart forms",
          ],
        },
        {
          title: "Analytics & Intelligence",
          badge: null,
          subtitle:
            "The numbers you need to decide fast and well",
          items: [
            "Real-time dashboards",
            "Automated KPI & reporting",
            "Smart alerts & thresholds",
            "AI-powered decision support",
          ],
        },
      ],
    },

    pricing: {
      sectionBadge: "Pricing",
      title: "Systems",
      tiers: [
        {
          name: "Starter",
          price: "\u20ac1,500",
          tagline: "Your first automated system",
          features: [
            "1 turnkey automation (chatbot OR emails OR booking)",
            "Brief + validated mockup",
            "Delivered in 5 days",
            "1h training included",
          ],
          cta: "Get started",
          ctaLink: "/contact?plan=starter",
          highlighted: false,
          badge: null,
          monthly: null,
          checkoutPlan: "pilote-automatique" as string | null,
        },
        {
          name: "Pro",
          price: "\u20ac2,900",
          tagline:
            "The complete system + 3 months of peace of mind",
          features: [
            "Turnkey multi-module system",
            "3 months monitoring + support included (\u20ac1,470 value)",
            "Bugs fixed within 48h",
            "Security updates + monthly report",
            "Delivered in 5-10 days",
          ],
          cta: "Choose Pro",
          ctaLink: "/contact?plan=pro",
          highlighted: true,
          badge: "Recommended",
          monthly: "Then \u20ac490/month. No commitment.",
          checkoutPlan: "pro" as string | null,
        },
        {
          name: "Custom",
          price: "from \u20ac6,900",
          tagline: "Your dedicated technical partner",
          features: [
            "Complete system (website + AI + data)",
            "Custom AI integration",
            "3 months evolution + Premium support (\u20ac5,700 value)",
            "10h/month of evolutions",
            "Priority 24h support",
            "Monthly strategic meeting",
          ],
          cta: "Let\u2019s discuss",
          ctaLink: "/contact?plan=sur-mesure",
          highlighted: false,
          badge: null,
          monthly: "Then \u20ac1,900/month. No commitment.",
          checkoutPlan: null as string | null,
        },
      ],
    },

    pilote: {
      badge: "New \u2014 Entry offer",
      title: "Autopilot \u2014 \u20ac1,500",
      subtitle: "Your business runs itself in 5 days",
      features: [
        "5 personalized automated emails",
        "AI chatbot trained on your FAQs",
        "Hot lead notifications",
        "Tracking dashboard",
      ],
      delivery: "Delivery: 5 business days",
      option: "Maintenance: \u20ac290/month (optional)",
      cta: "Order the Autopilot",
      ctaLink: "/contact?plan=pilote-automatique",
    },

    formation: {
      sectionBadge: "Training",
      title: "AI Training \u2014 Make your team autonomous",
      cards: [
        {
          name: "Practical AI",
          duration: "1 day",
          priceInter: "\u20ac490/person (inter)",
          priceIntra: "\u20ac1,500 (intra, group 6-12)",
          features: [
            "Prompt engineering",
            "Business use cases",
            "Custom AI kit",
          ],
          tagline: "Your teams leave operational",
        },
        {
          name: "Automate your business",
          duration: "2 days",
          priceInter: "\u20ac890/person (inter)",
          priceIntra: "\u20ac2,800 (intra)",
          features: [
            "Make/n8n automations",
            "Chatbot, email auto",
            "ROI measurement",
          ],
          tagline:
            "2-3 automations deployed during training",
        },
        {
          name: "Custom",
          duration: "3-5 days",
          priceInter: "\u20ac800/day",
          priceIntra: null,
          features: [
            "Preliminary audit",
            "Custom program",
            "3-month follow-up",
          ],
          tagline: "Structured AI transformation",
        },
      ],
    },

    consulting: {
      title: "Need an expert for the day?",
      subtitle:
        "Audit, consulting, architecture, implementation \u2014 a la carte",
      rates: [
        { label: "Half-day", price: "\u20ac450" },
        { label: "Full day", price: "\u20ac800" },
        { label: "Week", price: "\u20ac3,600" },
        { label: "Month", price: "\u20ac6,800" },
      ],
    },

    aides: {
      title: "Your clients can fund up to 100% of the project",
      note: "I help you with the funding application.",
      cards: [
        {
          name: "OPCO",
          desc: "Up to 100% for companies with fewer than 50 employees",
          context: "Training",
        },
        {
          name: "OCCAL",
          desc: "Up to 70% of expenses, \u20ac23,000 cap",
          context: "Craftsmen, retail",
        },
        {
          name: "Pass Occitanie",
          desc: "50% of expenses, \u20ac10,000 cap",
          context: "SMEs",
        },
        {
          name: "AI Booster France 2030",
          desc: "Free diagnostic + training",
          context: "Bpifrance",
        },
      ],
    },

    comparatif: {
      badge: "Comparison",
      title: "Why not an agency, a cheap freelancer or a SaaS?",
      subtitle:
        "Compare the models. Choose with full knowledge.",
      columns: [
        "",
        "Web agency",
        "Low-cost freelancer",
        "SaaS (Axonaut, etc.)",
        "Aïssa BELKOUSSA",
      ],
      rows: [
        {
          label: "Timeframe",
          values: ["2-6 months", "1-3 weeks", "Immediate", "5-10 days"],
        },
        {
          label: "Price",
          values: [
            "\u20ac10,000-50,000",
            "\u20ac500-2,000",
            "\u20ac50-200/mo",
            "From \u20ac1,500",
          ],
        },
        {
          label: "Maintenance",
          values: [
            "Costly add-on",
            "None or limited",
            "Included (generic)",
            "3 months free",
          ],
        },
        {
          label: "AI built-in",
          values: ["Rarely", "No", "Basic", "Custom"],
        },
        {
          label: "AI visibility (GEO)",
          values: ["No", "No", "No", "Included"],
        },
        {
          label: "Training included",
          values: ["Paid", "No", "Documentation", "Yes (1h+)"],
        },
        {
          label: "Custom-built",
          values: ["Yes (expensive)", "Partial", "No", "100%"],
        },
        {
          label: "Source code",
          values: [
            "Rarely",
            "Variable",
            "Not Applicable (N/A)",
            "Comprehensive usage license",
          ],
        },
      ],
    },

    maintenance: {
      badge: "Maintenance",
      title: "Maintenance subscriptions",
      subtitle:
        "After the 3 free months, keep your system running at its best.",
      plans: [
        {
          name: "Essential",
          price: "\u20ac490/month",
          priceYearly: "\u20ac368/month",
          priceYearlyTotal: "\u20ac4,410/year (3 months free)",
          features: [
            "Security & performance updates",
            "24/7 monitoring",
            "Bugs fixed within 48h",
            "Monthly report",
            "Email support",
          ],
        },
        {
          name: "Premium",
          price: "\u20ac1,900/month",
          priceYearly: "\u20ac1,425/month",
          priceYearlyTotal: "\u20ac17,100/year (3 months free)",
          features: [
            "Everything in Essential +",
            "10h/month of evolutions",
            "Priority 24h support",
            "Monthly strategic meeting",
            "Continuous AI optimization",
          ],
        },
      ],
      annualNote:
        "Annual commitment: -25% (3 months free out of 12). No commitment otherwise.",
    },

    faq: [
      {
        q: "What happens if I stop maintenance?",
        a: "Your site stays online and functional. But without regular updates, SEO performance degrades, security vulnerabilities go unpatched, and your system stops adapting. On average, an unmaintained site loses 20-35% of organic traffic in 6 months.",
      },
      {
        q: "Why 3 free months?",
        a: "A digital system needs 3 months to reach full potential. During this period, we optimize, adjust, and measure. You see concrete results before committing.",
      },
      {
        q: "What if I don\u2019t know exactly what I need?",
        a: "That\u2019s the case for 80% of my clients. The 30-minute call is exactly for that: clarifying your need, identifying the right approach, and proposing the right format. No commitment.",
      },
      {
        q: "Do I own the code?",
        a: "You get a comprehensive, unlimited usage license. You operate your project freely. Intellectual property remains with the provider, ensuring ongoing maintenance and evolution.",
      },
      {
        q: "Can I handle maintenance myself?",
        a: "Yes. After the 3 free months, you\u2019re free to manage maintenance in-house if you have the technical skills. Your system stays functional.",
      },
      {
        q: "What if the project takes longer?",
        a: "Prices are fixed. If the project exceeds scope on my side, I don\u2019t charge extra. If scope evolves from your side, we discuss and adjust together.",
      },
      {
        q: "Is there a commitment?",
        a: "No. After the 3 free months, maintenance is commitment-free. The annual plan is an option that saves you 25% (3 months free out of 12).",
      },
      {
        q: "How to fund the project with OPCO?",
        a: "I help you build the application. For companies with fewer than 50 employees, training can be 100% covered.",
      },
      {
        q: "Do you offer training?",
        a: "Yes, from 1 day (AI introduction) to 5 days (full transformation). OPCO fundable.",
      },
    ],

    finalCta: {
      title: "Free first call.\n30 min. Zero commitment.",
      cta: "Book a call",
    },

    /* ── UI strings ── */
    ui: {
      servicesAndPricing: "Services & Pricing",
      getProposal: "Get my proposal",
      seePricing: "See pricing",
      threePillars: "Three pillars for your growth",
      included: "Included",
      funding: "Funding",
      billingFrequency: "Billing frequency",
      monthly: "Monthly",
      annual: "Annual",
      learnMore: "Learn more",
      faqTitle: "Your questions,\nmy answers.",
      faqSubtitle: "Everything you need to know before launching your system. Missing a question? Let\u2019s talk.",
      finalCtaSubtitle: "Let\u2019s see together if I can help. No salesman, no BS.",
      stickyCta: "Free first call \u2014 30 min",
    },
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   ICONS for expertise categories
   ──────────────────────────────────────────────────────────────────────────── */
const categoryIcons = [Bot, Globe, BarChart3];
const aideIcons = [Users, Landmark, Rocket, Sparkles];

/* ────────────────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ──────────────────────────────────────────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
};

const fadeUpSmall = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
});

/* ────────────────────────────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────────────────────────────── */

export default function ServicesPage() {
  const { language } = useLanguage();
  const t = content[language];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subBilling, setSubBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-0">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.ui.servicesAndPricing}
                </span>
              </div>
              <h1 className="text-fluid-display tracking-tighter uppercase max-w-4xl mb-8 whitespace-pre-line">
                {t.hero.title}
              </h1>
              <p className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  {t.ui.getProposal}
                  <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-site-border text-xs font-bold uppercase tracking-widest text-site-text-light hover:border-site-accent hover:text-site-accent transition-all"
                >
                  {t.ui.seePricing}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2 — 3 CATEGORIES D'EXPERTISE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.expertise.sectionBadge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                {t.ui.threePillars}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.expertise.categories.map((cat, idx) => {
                const Icon = categoryIcons[idx];
                return (
                  <motion.div
                    key={idx}
                    {...fadeUpSmall(idx * 0.12)}
                    className="relative border border-site-border rounded-2xl p-8 md:p-10 hover:border-site-accent/30 transition-colors group"
                  >
                    {cat.badge && (
                      <span className="absolute -top-3 left-6 text-[9px] font-bold uppercase tracking-widest text-white bg-site-accent px-3 py-1 rounded-full">
                        {cat.badge}
                      </span>
                    )}

                    <div className="flex items-center gap-4 mb-6 mt-1">
                      <div className="w-10 h-10 rounded-full border border-site-border flex items-center justify-center text-site-text-light group-hover:border-site-accent group-hover:text-site-accent transition-colors">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-medium tracking-tight uppercase">
                        {cat.title}
                      </h3>
                    </div>

                    <p className="text-sm text-site-text-light leading-relaxed mb-6">
                      {cat.subtitle}
                    </p>

                    <ul className="space-y-3">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check
                            size={14}
                            className="mt-0.5 text-site-accent shrink-0"
                            strokeWidth={2.5}
                          />
                          <span className="text-sm text-site-text-light">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3 — GRILLE TARIFAIRE SYSTEMES
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="px-container mb-32 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.pricing.sectionBadge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase mb-4">
                {t.pricing.title}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 lg:items-end">
              {t.pricing.tiers.map((tier, idx) => {
                const isHighlighted = tier.highlighted;
                return (
                  <motion.div
                    key={idx}
                    {...fadeUpSmall(idx * 0.12)}
                    className={cn(
                      "relative flex flex-col border rounded-2xl transition-all duration-500",
                      isHighlighted
                        ? "lg:scale-105 lg:z-10 border-site-accent shadow-[0_0_60px_-12px_rgba(0,0,0,0.15)] bg-site-bg"
                        : "bg-site-bg border-site-border hover:border-site-accent/30"
                    )}
                  >
                    {tier.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-site-accent px-4 py-1.5 rounded-full">
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-8 md:p-10 flex flex-col flex-1">
                      <h3 className="text-xl font-medium tracking-tight uppercase mb-2">
                        {tier.name}
                      </h3>
                      <p className="text-sm text-site-text-light leading-relaxed mb-6 min-h-[40px]">
                        {tier.tagline}
                      </p>

                      {/* Price */}
                      <div className="mb-8">
                        <span className="text-4xl md:text-5xl font-medium tracking-tighter">
                          {tier.price}
                        </span>
                        {tier.monthly && (
                          <p className="text-xs text-site-text-light/60 mt-2">
                            {tier.monthly}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      {tier.checkoutPlan ? (
                        <CheckoutButton
                          plan={tier.checkoutPlan}
                          label={tier.cta}
                          className={cn(
                            "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all mb-8",
                            isHighlighted
                              ? "bg-site-accent text-white hover:bg-site-accent/85 hover:scale-105"
                              : "border border-site-border text-site-text hover:border-site-accent hover:text-site-accent"
                          )}
                        />
                      ) : (
                        <Link
                          href={tier.ctaLink}
                          className={cn(
                            "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all mb-8",
                            isHighlighted
                              ? "bg-site-accent text-white hover:bg-site-accent/85 hover:scale-105"
                              : "border border-site-border text-site-text hover:border-site-accent hover:text-site-accent"
                          )}
                        >
                          {tier.cta}
                          <ArrowUpRight size={14} />
                        </Link>
                      )}

                      {/* Features */}
                      <div className="border-t border-site-border pt-6 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-4">
                          {t.ui.included}
                        </p>
                        <ul className="space-y-3">
                          {tier.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-3">
                              <Check
                                size={14}
                                className="mt-0.5 text-site-accent shrink-0"
                                strokeWidth={2.5}
                              />
                              <span className="text-sm text-site-text-light">
                                {f}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4 — PILOTE AUTOMATIQUE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="mx-2 md:mx-4 mb-32">
          <div className="relative bg-site-accent text-white rounded-4xl md:rounded-[4rem] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

            <div className="relative px-container section-padding">
              <div className="max-w-7xl mx-auto">
                <motion.div {...fadeUp}>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/15 px-4 py-1.5 rounded-full mb-8">
                    <Sparkles size={12} />
                    {t.pilote.badge}
                  </span>

                  <h2 className="text-fluid-title tracking-tighter uppercase mb-4">
                    {t.pilote.title}
                  </h2>
                  <p className="text-lg opacity-80 max-w-xl mb-10">
                    {t.pilote.subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-10">
                    {t.pilote.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check
                          size={14}
                          className="mt-0.5 opacity-60 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm opacity-80">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                    <span className="text-sm opacity-60">{t.pilote.delivery}</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
                    <span className="text-sm opacity-60">{t.pilote.option}</span>
                  </div>

                  <CheckoutButton
                    plan="pilote-automatique"
                    label={t.pilote.cta}
                    className="inline-flex items-center gap-3 bg-white text-site-accent px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5 — FORMATION IA
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <GraduationCap size={16} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.formation.sectionBadge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                {t.formation.title}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.formation.cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  {...fadeUpSmall(idx * 0.12)}
                  className="border border-site-border rounded-2xl p-8 md:p-10 flex flex-col hover:border-site-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium tracking-tight uppercase">
                      {card.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-site-accent bg-site-accent/10 px-2.5 py-1 rounded-full">
                      {card.duration}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-medium">{card.priceInter}</p>
                    {card.priceIntra && (
                      <p className="text-xs text-site-text-light/60 mt-1">
                        {card.priceIntra}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {card.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <Check
                          size={12}
                          className="mt-1 text-site-accent shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-site-text-light">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-site-accent font-medium italic">
                    {card.tagline}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 6 — CONSULTING & ACCOMPAGNEMENT (TJM)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <Briefcase size={16} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  Consulting
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-4">
                {t.consulting.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed">
                {t.consulting.subtitle}
              </p>
            </motion.div>

            <motion.div
              {...fadeUpSmall(0.1)}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {t.consulting.rates.map((r, idx) => (
                <div
                  key={idx}
                  className="border border-site-border rounded-2xl p-6 md:p-8 text-center hover:border-site-accent/30 transition-colors"
                >
                  <p className="text-2xl md:text-3xl font-medium tracking-tighter text-site-accent mb-2">
                    {r.price}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-site-text-light/50">
                    {r.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 7 — AIDES FINANCIERES
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="mx-2 md:mx-4 mb-32">
          <div className="relative bg-site-text text-white rounded-4xl md:rounded-[4rem] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05)_0%,transparent_60%)]" />

            <div className="relative px-container section-padding">
              <div className="max-w-7xl mx-auto">
                <motion.div {...fadeUp} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <BadgeEuro size={16} className="opacity-60" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                      {t.ui.funding}
                    </span>
                  </div>
                  <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                    {t.aides.title}
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {t.aides.cards.map((card, idx) => {
                    const Icon = aideIcons[idx];
                    return (
                      <motion.div
                        key={idx}
                        {...fadeUpSmall(idx * 0.1)}
                        className="border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-colors"
                      >
                        <Icon
                          size={20}
                          className="mb-4 opacity-40"
                          strokeWidth={1.5}
                        />
                        <h4 className="text-base font-medium mb-2">
                          {card.name}
                        </h4>
                        <p className="text-sm opacity-70 mb-3 leading-relaxed">
                          {card.desc}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                          {card.context}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.p
                  {...fadeUpSmall(0.4)}
                  className="mt-10 text-sm opacity-50 text-center"
                >
                  {t.aides.note}
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 8 — COMPARATIF MARCHE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.comparatif.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6 whitespace-pre-line">
                {t.comparatif.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed">
                {t.comparatif.subtitle}
              </p>
            </motion.div>

            <motion.div
              {...fadeUpSmall(0.2)}
              className="overflow-x-auto -mx-container px-container"
            >
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr>
                    {t.comparatif.columns.map((col, i) => (
                      <th
                        key={i}
                        className={cn(
                          "text-left py-4 px-5 text-xs font-bold uppercase tracking-widest",
                          i === 0
                            ? "text-site-text-light/40 w-[18%]"
                            : i === 4
                            ? "text-site-accent bg-site-accent/[0.04] rounded-t-xl"
                            : "text-site-text-light"
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.comparatif.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-t border-site-border/50">
                      <td className="py-4 px-5 text-sm font-medium">
                        {row.label}
                      </td>
                      {row.values.map((val, vIdx) => (
                        <td
                          key={vIdx}
                          className={cn(
                            "py-4 px-5 text-sm",
                            vIdx === 3
                              ? "text-site-accent font-medium bg-site-accent/[0.04]"
                              : "text-site-text-light"
                          )}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 9 — MAINTENANCE (ABONNEMENTS)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.maintenance.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6">
                {t.maintenance.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed mb-10">
                {t.maintenance.subtitle}
              </p>

              {/* Billing Toggle */}
              <div
                role="tablist"
                aria-label={t.ui.billingFrequency}
                className="inline-flex items-center bg-[#f5f5f5] rounded-full p-1 gap-0.5"
              >
                {(["monthly", "yearly"] as const).map((mode) => (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={subBilling === mode}
                    onClick={() => setSubBilling(mode)}
                    className={cn(
                      "relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer",
                      "flex items-center gap-2",
                      subBilling === mode
                        ? "bg-site-accent text-white shadow-md"
                        : "text-site-text-light hover:text-site-text"
                    )}
                  >
                    {mode === "monthly" ? t.ui.monthly : null}
                    {mode === "yearly" && (
                      <>
                        {t.ui.annual}
                        <span
                          className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors duration-300",
                            subBilling === "yearly"
                              ? "bg-white/20 text-white"
                              : "bg-green-100 text-green-700"
                          )}
                        >
                          -25%
                        </span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {t.maintenance.plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  {...fadeUpSmall(idx * 0.12)}
                  className="border border-site-border rounded-2xl p-8 md:p-10 flex flex-col hover:border-site-accent/30 transition-colors"
                >
                  <h4 className="text-lg font-medium tracking-tight uppercase mb-4">
                    {plan.name}
                  </h4>

                  <div className="mb-8 min-h-[70px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={subBilling}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
                        }}
                      >
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-medium tracking-tighter">
                            {subBilling === "yearly"
                              ? plan.priceYearly
                              : plan.price}
                          </span>
                        </div>
                        {subBilling === "yearly" && (
                          <p className="text-xs text-site-text-light/50 mt-2">
                            {plan.priceYearlyTotal}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <Check
                          size={12}
                          className="mt-1 text-site-accent shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm text-site-text-light">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-site-border text-xs font-bold uppercase tracking-widest hover:border-site-accent hover:text-site-accent transition-all"
                  >
                    {t.ui.learnMore}
                    <ArrowUpRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p
              {...fadeUpSmall(0.3)}
              className="mt-8 text-xs text-site-text-light/50 max-w-4xl"
            >
              {t.maintenance.annualNote}
            </motion.p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 10 — FAQ
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container pb-32 border-t border-site-border pt-32">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2 h-2 rounded-full bg-site-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                    FAQ
                  </span>
                </div>
                <h2 className="text-fluid-title tracking-tighter uppercase">
                  {t.ui.faqTitle}
                </h2>
              </motion.div>
              <motion.p
                {...fadeUpSmall(0.2)}
                className="text-site-text-light max-w-sm text-sm leading-relaxed md:text-right"
              >
                {t.ui.faqSubtitle}
              </motion.p>
            </div>

            {/* FAQ cards — 2 independent column grids, open item spans 2 rows */}
            {(() => {
              const left = t.faq.filter((_, i) => i % 2 === 0);
              const right = t.faq.filter((_, i) => i % 2 === 1);

              const renderCard = (
                item: (typeof t.faq)[0],
                realIdx: number,
                delayIdx: number
              ) => {
                const isOpen = openFaq === realIdx;
                return (
                  <motion.div
                    key={realIdx}
                    {...fadeUpSmall(delayIdx * 0.06)}
                    className={cn(
                      "group border rounded-2xl overflow-hidden transition-colors duration-300 self-start",
                      isOpen
                        ? "border-site-accent bg-site-accent/[0.02] shadow-sm md:[grid-row:span_2]"
                        : "border-site-border hover:border-site-accent/30"
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : realIdx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${realIdx}`}
                      className="w-full p-6 md:p-8 flex items-start gap-5 text-left cursor-pointer"
                    >
                      <span
                        className={cn(
                          "text-xs font-bold shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300",
                          isOpen
                            ? "bg-site-accent text-white"
                            : "bg-site-border/60 text-site-text-light"
                        )}
                      >
                        {String(realIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm md:text-base font-medium leading-snug group-hover:text-site-accent transition-colors">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 mt-0.5 text-site-text-light transition-transform duration-300",
                          isOpen && "rotate-180 text-site-accent"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            id={`faq-answer-${realIdx}`}
                            role="region"
                            className="px-6 md:px-8 pb-6 md:pb-8 pl-[4.25rem] md:pl-[4.75rem]"
                          >
                            <p className="text-sm text-site-text-light leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              };

              const colRows = (count: number) => `repeat(${count}, auto)`;

              return (
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  <div className="flex-1 grid gap-4 md:gap-5" style={{ gridTemplateRows: colRows(left.length) }}>
                    {left.map((item, i) => renderCard(item, i * 2, i))}
                  </div>
                  <div className="flex-1 grid gap-4 md:gap-5" style={{ gridTemplateRows: colRows(right.length) }}>
                    {right.map((item, i) => renderCard(item, i * 2 + 1, i))}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 11 — CTA FINAL
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="px-container pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeUp}
              className="border border-site-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-site-accent)_0%,transparent_70%)] opacity-[0.03]" />

              <div className="relative">
                <h2 className="text-fluid-title tracking-tighter uppercase mb-6 whitespace-pre-line">
                  {t.finalCta.title}
                </h2>
                <p className="text-site-text-light mb-10 max-w-lg mx-auto">
                  {t.ui.finalCtaSubtitle}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-site-accent text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-site-accent/85 hover:scale-105 transition-all"
                >
                  {t.finalCta.cta}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ExitIntentModal />

      {/* ── Sticky CTA mobile ────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-site-bg/90 backdrop-blur-xl border-t border-site-border px-4 py-3 safe-area-pb">
        <Link
          href="/contact"
          className="flex items-center justify-center gap-2 w-full bg-site-accent text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          {t.ui.stickyCta}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
