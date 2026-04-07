"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "en";

interface Dictionary {
  warning: string;
  nav: {
    offers: string;
    approach: string;
    expertise: string;
    systems: string;
    about: string;
    contact: string;
    services: string;
    blog: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    popularBadge: string;
    includesLabel: string;
    durationLabel: string;
    cta: string;
    timeSavings: {
      badge: string;
      title: string;
      subtitle: string;
      items: Array<{
        metric: string;
        label: string;
        detail: string;
      }>;
    };
    tiers: Array<{
      name: string;
      tag: string;
      badge?: string;
      description: string;
      price: string;
      priceNote: string;
      monthlyPrice: string;
      monthlyNote: string;
      duration: string;
      features: string[];
      excluded: string[];
    }>;
    ecosystemCta: {
      text: string;
      button: string;
    };
    comparison: {
      badge: string;
      title: string;
      subtitle: string;
      columns: string[];
      rows: Array<{ label: string; values: string[] }>;
    };
    recurring: {
      badge: string;
      title: string;
      subtitle: string;
      billingToggle: {
        monthly: string;
        yearly: string;
        saveBadge: string;
      };
      plans: Array<{
        name: string;
        price: string;
        priceYearly: string;
        priceYearlyTotal: string;
        features: string[];
      }>;
    };
    process: {
      badge: string;
      title: string;
      steps: Array<{ title: string; description: string }>;
    };
    finalCta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  offers: {
    title: string;
    initiate: string;
    pillar1Props: { title: string; sub: string };
    pillar2Props: { title: string; sub: string };
    pillar3Props: { title: string; sub: string };
  };
  approach: {
    title: string;
    intro: string;
    bio: string;
    subtitle: string;
    pillars: Array<{ title: string; content: string }>;
  };
  expertises: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      microcopy: string;
    }>;
  };
  socialProof: {
    badge: string;
    title: string;
    projects: Array<{
      name: string;
      sector: string;
      description: string;
    }>;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  systems: {
    title: string;
    intro: string;
    backLink: string;
    notFound: string;
    backToBase: string;
    category: string;
    categoryValue: string;
    year: string;
    status: string;
    deployed: string;
    intelligence: string;
    architectureLabel: string;
    architectureDesc: string;
    innovationLabel: string;
    innovationDesc: string;
    startCta: string;
    startCtaButton: string;
    items: Array<{
      id: string;
      slug: string;
      title: string;
      sub: string;
      desc: string;
      color: string;
      stack: string[];
    }>;
  };
  about: {
    content: string;
    location: string;
    bio: string[];
    photoAlt: string;
  };
  contact: {
    title: string;
    subtitle: string;
    cta: string;
  };
  footer: {
    jobTitle: string;
    industry: string;
    systemsStrategy: string;
    title: string;
    baseline: string;
    credits: string;
    reserved: string;
    version: string;
    betaNotice: string;
    legalNotice: string;
    privacyPolicy: string;
    termsOfService: string;
    termsAndConditions: string;
    explore: string;
    architecture: string;
    legal: string;
  };
  funnel: {
    steps: {
      identity: {
        title: string;
        nameLabel: string;
        namePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        contextLabel: string;
        contextPlaceholder: string;
      };
      needs: { title: string; options: { id: string; label: string; template: string }[] };
      details: {
        title: string;
        messageLabel: string;
        budgetLabel: string;
        customMessage: string;
        useTemplate: string;
      };
      message: { label: string; placeholder: string };
    };
    cta: { next: string; prev: string; submit: string; submitting: string; guarantee: string };
    success: {
      title: string;
      message: string;
      bookCall: string;
      bookCallSubtext: string;
      whatsappMessage: string;
      whatsappCta: string;
      backHome: string;
    };
    plan: { selectedLabel: string };
    errors: { generic: string; rate: string };
  };
  contactPage: {
    badge: string;
    heading: string;
    headingItalic: string;
    intro: string;
    availability: string;
    calendlySection: string;
    calendlyTitle: string;
    calendlyDuration: string;
    calendlyLocation: string;
    calendlyFree: string;
    calendlyDesc: string;
  };
  diagnostic: {
    srTitle: string;
    progressLabel: string;
    lastStep: string;
    questionOf: string;
    back: string;
    questions: Array<{
      id: string;
      question: string;
      options: Array<{ label: string; score: number }>;
    }>;
    emailPhase: {
      title: string;
      subtitle: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      sending: string;
      submit: string;
      skip: string;
    };
    results: {
      levelLabel: string;
      answersLabel: string;
      seeOffers: string;
      sendError: string;
      levels: {
        advanced: { level: string; headline: string; body: string; cta: string };
        intermediate: { level: string; headline: string; body: string; cta: string };
        beginner: { level: string; headline: string; body: string; cta: string };
      };
    };
  };
  audit: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    price: string;
    originalPrice: string;
    guarantee: string;
    delivery: string;
    deductible: string;
    freeDiagnostic: string;
    freeDiagnosticCta: string;
  };
  upsell: {
    timerLabel: string;
    skip: string;
  };
  unsubscribe: {
    title: string;
    subtitle: string;
    backHome: string;
  };
  leadMagnet: {
    submit: string;
    ready: string;
    download: string;
  };
  domainAlert: {
    badge: string;
    title: string;
    subtitle: string;
    whatHappened: {
      title: string;
      description: string;
    };
    facts: {
      title: string;
      domain: string;
      holder: string;
      registrar: string;
      registeredOn: string;
      expiresOn: string;
      status: string;
      dns: string;
      ip: string;
      hosting: string;
      ssl: string;
      contentHistory: string;
      suspiciousInfra: string;
    };
    violations: {
      title: string;
      items: string[];
    };
    actions: {
      title: string;
      items: string[];
    };
    legitimateDomain: {
      title: string;
      description: string;
      cta: string;
    };
    legal: {
      title: string;
      articles: string[];
    };
  };
  notFound: {
    code: string;
    title: string;
    subtitle: string;
    seePlans: string;
    backHome: string;
  };
  phishing: {
    alreadyHere: string;
    domainLabel: string;
    holderLabel: string;
    registrarLabel: string;
    registeredLabel: string;
    expiresLabel: string;
    statusLabel: string;
    dnsLabel: string;
    hostingLabel: string;
    sslLabel: string;
    historyLabel: string;
    suspectLabel: string;
  };
  domainLegit: {
    badge: string;
    title: string;
    subtitle: string;
    ownership: {
      title: string;
      domain: string;
      holder: string;
      registrar: string;
      createdOn: string;
      dns: string;
      hosting: string;
      ssl: string;
      ip: string;
      email: string;
      status: string;
    };
    whyThisPage: {
      title: string;
      description: string;
    };
    verification: {
      title: string;
      items: string[];
    };
    usurpation: {
      title: string;
      description: string;
      cta: string;
    };
  };
  exitIntent: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    trust: string;
  };
  whatsapp: {
    defaultMessage: string;
  };
  pricingTeaser: {
    stats: Array<{ value: string; label: string }>;
    then: string;
    month: string;
    allDetails: string;
  };
  ui: {
    diagnosticFree: string;
    pricing: string;
    menuOpen: string;
    menuClose: string;
    learnMore: string;
    viewPricing: string;
    redirecting: string;
  };
  checkout: {
    verifying: string;
    confirmed: string;
    thanks: string;
    confirmedDesc: string;
    thanksDesc: string;
    planKickoff: string;
    backHome: string;
    reassurance: string;
  };
  calendly: {
    title: string;
    fallbackTitle: string;
    fallbackDesc: string;
    fallbackCta: string;
  };
  blog: {
    badge: string;
    title: string;
    subtitle: string;
    empty: string;
    featured: string;
    cta: string;
    viewOffers: string;
  };
  article: {
    backToBlog: string;
    helpful: string;
    share: string;
    viewOffers: string;
    relatedArticles: string;
  };
  links: {
    subtitle: string;
    portfolio: string;
    portfolioDesc: string;
    pricing: string;
    pricingDesc: string;
    diagnostic: string;
    diagnosticDesc: string;
    contact: string;
    contactDesc: string;
    whatsapp: string;
    whatsappDesc: string;
    blog: string;
    blogDesc: string;
    available: string;
  };
  availabilityBanner: {
    months: string[];
    slotSingular: string;
    slotPlural: string;
  };
  maintenanceGate: {
    title: string;
    description: string;
    comeback: string;
    passwordPlaceholder: string;
  };
  roi: {
    badge: string;
    title: string;
    tradeLabel: string;
    hoursLabel: (hours: number) => string;
    projection: string;
    savedPerWeek: string;
    valuePerWeek: string;
    savedPerYear: string;
    weeksUnit: string;
    breakEven: string;
    summary: (weeksToROI: number, weeklySaved: string) => string;
    placeholder: string;
  };
}

const dictionaries: Record<Language, Dictionary> = {
  fr: {
    warning: "aissabelkoussa.com est un domaine de phishing, assurez-vous d'être sur aissabelkoussa.fr",
    nav: {
      offers: "Offres",
      approach: "Approche",
      expertise: "Expertises",
      systems: "Systèmes",
      about: "À propos",
      contact: "Contact",
      services: "Services",
      blog: "Blog",
    },
    services: {
      badge: "Offres & Résultats",
      title: "Votre système digital.\nConçu, livré, opérationnel.",
      subtitle: "Quatre offres claires. Un seul objectif : un système qui tourne dès la livraison. Premier échange gratuit, sans engagement.",
      popularBadge: "Recommandé",
      includesLabel: "Ce qui est inclus",
      durationLabel: "Durée estimée",
      cta: "Démarrer",
      timeSavings: {
        badge: "Pourquoi automatiser",
        title: "Chaque semaine sans système,\nc'est du temps et de l'argent qui s'évaporent.",
        subtitle: "Voici ce que gagnent concrètement mes clients dès la mise en production.",
        items: [
          { metric: "13h", label: "récupérées par semaine", detail: "Tâches admin de 15h réduites à 2h grâce aux automations" },
          { metric: "×50", label: "plus rapide sur les devis", detail: "De 3h par devis à 5 minutes — envoi automatique" },
          { metric: "5 min", label: "de délai de réponse", detail: "Contre 48h en moyenne — relance automatique 24/7" },
          { metric: "-70%", label: "vs. coût d'une agence", detail: "Système complet dès 2 900 € — une agence facture 15 000 €+" },
          { metric: "10 jours", label: "de délai de livraison", detail: "Contre 2-3 mois chez une agence classique" },
          { metric: "24/7", label: "votre système travaille", detail: "Même quand vous êtes sur chantier ou en rendez-vous" },
        ],
      },
      tiers: [
        {
          name: "Pilote Automatique",
          tag: "Premier système",
          badge: "Nouveau",
          description: "Votre premier système automatisé en 5 jours. Chatbot + emails auto + dashboard — tout ce qu'il faut pour démarrer.",
          price: "1 500 €",
          priceNote: "Paiement unique. Livraison en 5 jours ouvrés.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "5 jours ouvrés",
          features: [
            "Chatbot IA intégré à votre site",
            "Emails automatiques (bienvenue, relance, suivi)",
            "Dashboard de suivi en temps réel",
            "Déploiement en production",
            "Documentation technique",
            "Formation prise en main (1h)",
          ],
          excluded: [
            "Aucune maintenance post-livraison",
            "Aucune mise à jour de sécurité",
            "Aucun monitoring",
          ],
        },
        {
          name: "Pro",
          tag: "Projet + maintenance",
          badge: "Recommandé",
          description: "Système complet livré et maintenu. 3 mois de maintenance offerts — vous ne touchez à rien.",
          price: "2 900 €",
          priceNote: "Puis 490 €/mois après les 3 mois offerts. Sans engagement.",
          monthlyPrice: "490 €",
          monthlyNote: "3 mois offerts (valeur 1 470 €)",
          duration: "5 à 10 jours ouvrés",
          features: [
            "1 système livré clé en main (site, automation ou dashboard)",
            "Brief stratégique + maquette validée avant dev",
            "Licence d'usage complète",
            "Déploiement en production inclus",
            "3 mois de monitoring + support offerts",
            "Corrections de bugs sous 48h",
            "Mises à jour de sécurité continues",
            "Rapport mensuel de performance",
          ],
          excluded: [],
        },
        {
          name: "Sur-mesure",
          tag: "Système + évolution continue",
          description: "Partenaire technique dédié. Votre infrastructure complète — site, IA, données — avec un accompagnement continu.",
          price: "À partir de 6 900 €",
          priceNote: "Puis 1 900 €/mois après les 3 mois offerts. Sans engagement.",
          monthlyPrice: "1 900 €",
          monthlyNote: "3 mois offerts (valeur 5 700 €)",
          duration: "1 à 2 mois",
          features: [
            "Système multi-briques (site + automations + data)",
            "Intégration IA sur-mesure (agents, LLM, workflows)",
            "Architecture scalable et documentée",
            "3 mois d'évolution + support Premium offerts",
            "Évolutions et nouvelles fonctionnalités (10h/mois)",
            "Support prioritaire sous 24h",
            "Réunion mensuelle de suivi stratégique",
            "Accès prioritaire aux nouvelles technologies IA",
          ],
          excluded: [],
        },
        {
          name: "Formation IA",
          tag: "Montée en compétences",
          badge: "Nouveau",
          description: "Rendez votre équipe autonome sur l'IA. Formations pratiques, sur-mesure, finançables OPCO.",
          price: "À partir de 490 €/pers",
          priceNote: "Finançable OPCO. Tarif dégressif selon le nombre de participants.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "1 à 3 jours",
          features: [
            "Audit des besoins IA de votre équipe",
            "Programme de formation personnalisé",
            "Ateliers pratiques sur vos cas d'usage",
            "Supports de formation inclus",
            "Suivi post-formation (1 mois)",
            "Finançable OPCO",
          ],
          excluded: [],
        },
      ],
      ecosystemCta: {
        text: "Besoin d'une architecture sur mesure ? Le plan Sur-mesure s'adapte à vos ambitions — de 2 à 6 mois, CTO externalisé.",
        button: "Échanger 30 min",
      },
      comparison: {
        badge: "Pourquoi moi",
        title: "Agence, freelance Fiverr,\nou builder pro ?",
        subtitle: "Comparez objectivement avant de choisir.",
        columns: ["Critère", "Agence web", "Freelance low-cost", "Aïssa BELKOUSSA"],
        rows: [
          { label: "Délai de livraison", values: ["2 à 4 mois", "2 à 6 semaines", "5 à 10 jours"] },
          { label: "Prix moyen", values: ["8 000 – 25 000 €", "500 – 2 000 €", "2 900 €"] },
          { label: "Maintenance incluse", values: ["Rarement", "Jamais", "3 mois offerts"] },
          { label: "IA & automatisations", values: ["En option (+)", "Non", "Intégré nativement"] },
          { label: "Interlocuteur unique", values: ["Non (chef de projet + dev + designer)", "Oui (mais turnover)", "Oui, toujours"] },
          { label: "Code source livré", values: ["Parfois", "Rarement", "Toujours — licence d'usage incluse"] },
          { label: "Prix final garanti", values: ["Rarement (devis évolutifs)", "Oui", "Oui — contractuel"] },
          { label: "Support post-livraison", values: ["Payant dès J+1", "Néant", "3 mois inclus, puis 490 €/mois"] },
        ],
      },
      recurring: {
        badge: "Abonnement continu",
        title: "Un système ne se lance pas.\nIl se maintient.",
        subtitle: "Après la livraison, votre système a besoin de surveillance, de mises à jour et d'évolutions. Je reste à vos côtés avec un abonnement adapté.",
        billingToggle: {
          monthly: "Mensuel",
          yearly: "Annuel",
          saveBadge: "3 mois offerts",
        },
        plans: [
          {
            name: "Essentiel",
            price: "490 €",
            priceYearly: "368 €",
            priceYearlyTotal: "Facturé 4 410 €/an. Vous économisez 1 470 €/an.",
            features: [
              "Monitoring et alertes 24/7",
              "Corrections de bugs sous 48h",
              "Mises à jour de sécurité et dépendances",
              "1h de support mensuel inclus",
              "Rapport mensuel de performance",
            ],
          },
          {
            name: "Pro",
            price: "1 900 €",
            priceYearly: "1 425 €",
            priceYearlyTotal: "Facturé 17 100 €/an. Vous économisez 5 700 €/an.",
            features: [
              "Tout Essentiel +",
              "Évolutions et nouvelles fonctionnalités (jusqu'à 10h/mois)",
              "Support prioritaire sous 24h",
              "Optimisation continue des performances",
              "Réunion mensuelle de suivi stratégique",
              "Accès prioritaire aux nouvelles technologies IA",
            ],
          },
          {
            name: "Entreprise",
            price: "Sur devis",
            priceYearly: "Sur devis",
            priceYearlyTotal: "Engagement annuel avec remise négociée.",
            features: [
              "Tout Pro +",
              "Volume d'heures illimité négocié",
              "Architecture conseil et veille technologique",
              "Intégration IA continue (nouveaux agents, workflows)",
              "SLA garanti avec temps de réponse contractuel",
              "Interlocuteur dédié, disponibilité étendue",
            ],
          },
        ],
      },
      process: {
        badge: "Comment ça se passe",
        title: "Du premier échange au système en production",
        steps: [
          { title: "Échange", description: "Un appel de 30 min pour comprendre votre besoin, vos contraintes et vos objectifs. Gratuit, sans engagement." },
          { title: "Diagnostic", description: "J'analyse votre situation et je vous propose une architecture avec un devis clair, un planning et les livrables attendus." },
          { title: "Construction", description: "Je conçois, je code, je teste. Vous suivez l'avancement en temps réel avec des démos régulières à chaque étape." },
          { title: "Livraison", description: "Déploiement en production, formation, documentation. Votre système tourne — et je reste disponible pour la suite." },
        ],
      },
      finalCta: {
        title: "Prêt à lancer votre système ?",
        subtitle: "30 minutes suffisent pour cadrer votre projet. Gratuit, zéro engagement.",
        button: "Réserver un échange",
      },
    },
    hero: {
      title: "Automatisation IA pour PME et artisans —\nsystèmes livrés clé en main à partir de 1 500 €",
      subtitle: "Sites professionnels, chatbots IA, workflows automatisés, dashboards — prix fixe, livraison en 5 à 10 jours, 3 mois de maintenance offerts. Basé à Albi, France.",
      ctaPrimary: "Initier un projet",
      ctaSecondary: "Voir les systèmes",
      scroll: "Scroll ⭣",
    },
    offers: {
      title: "3 piliers : automatisation, interface de conversion, pilotage data",
      initiate: "Initier",
      pillar1Props: {
        title: "De l'intuition au système autonome",
        sub: "Vous avez une idée de ce qui pourrait tourner tout seul. Je la structure, je l'architecture, je la déploie. Workflows, automatisations, infrastructures — sans la complexité inutile."
      },
      pillar2Props: { 
        title: "Une interface qui reflète ce que vous avez construit", 
        sub: "Pas un site vitrine de plus. Un écosystème digital cohérent — où chaque point de contact raconte votre système et convertit vos visiteurs en clients." 
      },
      pillar3Props: { 
        title: "Workflow Algorithmique & Intelligence des données", 
        sub: "Des décisions éclairées, en temps réel. Dashboards, cockpits, alerting, stratégies data. Je construis les yeux de votre business — pour que vous pilotiez avec des faits, pas des intuitions." 
      },
    },
    approach: {
      title: "Comment je travaille",
      intro: "Je ne livre pas des livrables. Je construis des systèmes. Voici ce qui guide chaque projet.",
      bio: "System-first, business-driven",
      subtitle: "Je fusionne stratégie, design et systèmes pour bâtir des architectures digitales qui libèrent du temps.",
      pillars: [
        { 
          title: "System-first, business-driven", 
          content: "Un système qui ne sert pas un objectif business précis est un jouet. Chaque automation, chaque dashboard, chaque ligne de code a une raison d'être mesurable." 
        },
        { 
          title: "Builder, pas consultant", 
          content: "Je ne fais pas de recommandations que quelqu'un d'autre exécutera. Je conçois, je code, je teste, je déploie — et je vous livre quelque chose qui tourne vraiment." 
        },
        { 
          title: "Simplicité structurelle", 
          content: "Un système simple qui tourne 24h/24 vaut infiniment plus qu'une architecture brillante impossible à maintenir. Je tranche dans le superflu." 
        },
        { 
          title: "Transparence totale", 
          content: "Vous savez où on en est. Vous comprenez ce qu'on construit. Pas de jargon pour impressionner — de la clarté pour avancer." 
        },
      ],
    },
    expertises: {
      title: "Les systèmes que je maîtrise",
      items: [
        {
          title: "Automatisation qui libère votre temps",
          description: "Libérez votre potentiel humain en déléguant la répétition à des machines. Je conçois des flux autonomes qui connectent vos outils et fiabilisent vos opérations 24/7.",
          microcopy: "Industrialiser l'efficience"
        },
        {
          title: "IA concrète, pas expérimentale",
          description: "Intégrez l'intelligence artificielle au cœur de votre métier. Du LLM spécialisé aux agents autonomes, je bâtis des systèmes capables de raisonner et d'agir sur vos données.",
          microcopy: "Déployer l'intelligence"
        },
        {
          title: "Voir son business en temps réel",
          description: "Ne pilotez plus à vue. J'installe des cockpits de données qui transforment le bruit numérique en indicateurs décisionnels clairs et exploitables instantanément.",
          microcopy: "Maîtriser le flux"
        },
        {
          title: "Des process qui s'exécutent seuls",
          description: "Performance et précision pour les environnements à haute fréquence. J'optimise vos algorithmes et vos chaînes de traitement pour une exécution sans faille.",
          microcopy: "Exécuter avec précision"
        },
        {
          title: "Piloter avec les bons chiffres",
          description: "Le design au service de la décision. Des interfaces immersives conçues pour une lecture rapide et une gestion intuitive de systèmes complexes.",
          microcopy: "Visualiser l'essentiel"
        },
        {
          title: "Un site qui travaille pour vous",
          description: "Votre présence digitale n'est pas qu'une image, c'est un actif. Je crée des expériences immersives qui captent l'attention et convertissent par leur clarté.",
          microcopy: "Captiver l'audience"
        },
        {
          title: "Des outils taillés pour votre équipe",
          description: "Des outils que vos équipes aimeront utiliser. Je simplifie vos processus internes avec des solutions sur-mesure qui s'adaptent à vos méthodes, pas l'inverse.",
          microcopy: "Simplifier l'usage"
        },
        {
          title: "Convertir sans effort manuel",
          description: "La conversion comme un système. J'automatise vos tunnels de vente et la nutrition de vos leads pour garantir une croissance prévisible et scalable.",
          microcopy: "Scaler la croissance"
        }
      ],
    },
    socialProof: {
      badge: "Références",
      title: "Projets livrés",
      projects: [
        {
          name: "DK Building",
          sector: "BTP",
          description: "Site corporate + CMS sur-mesure pour une PME de construction metallique",
        },
        {
          name: "Syna Events",
          sector: "Evenementiel",
          description: "Site evenementiel deploye en production",
        },
        {
          name: "Jolananas",
          sector: "E-commerce",
          description: "Storefront Shopify premium connectee via GraphQL",
        },
        {
          name: "Albi RP",
          sector: "Gaming",
          description: "Ecosysteme complet : jeu Roblox + bot Discord + site + API",
        },
      ],
      stats: [
        { value: "93", label: "projets realises" },
        { value: "4+", label: "annees d'experience" },
      ],
    },
    systems: {
      title: "Systèmes construits, pas promis",
      intro: "Ce n'est pas ce que je pourrais faire. C'est ce que j'ai fait.",
      backLink: "Retour aux systèmes",
      notFound: "Système introuvable.",
      backToBase: "Retour à la base",
      category: "Catégorie",
      categoryValue: "Architecture système",
      year: "Année",
      status: "Statut",
      deployed: "Déployé",
      intelligence: "Intelligence\nsystème",
      architectureLabel: "Architecture",
      architectureDesc: "Approche micro-services avec pipelines de déploiement automatisés et observabilité en temps réel.",
      innovationLabel: "Innovation",
      innovationDesc: "Agents IA intégrés pour l'optimisation des workflows et l'automatisation des processus décisionnels.",
      startCta: "Démarrer un système\ncomme celui-ci ?",
      startCtaButton: "Initier un projet",
      items: [
        {
          id: "dk-building",
          slug: "dk-building",
          title: "DK BUILDING",
          sub: "Site corporate & CMS sur-mesure — BTP, Albi",
          desc: "PME de construction métallique sans présence web. Résultat : un site corporate complet avec CMS intégré, panneau admin sécurisé et galerie de réalisations — déployé en production sur dkbuilding.fr.",
          color: "#0F172A",
          stack: ["React 19", "Node.js", "Vercel", "Turso DB", "Cloudinary", "GSAP"]
        },
        {
          id: "jolananas",
          slug: "jolananas",
          title: "JOLANANAS",
          sub: "Storefront e-commerce premium — Mode artisanale française",
          desc: "Une boutique Shopify standard ne rendait pas justice à la marque. Résultat : une storefront sur-mesure Next.js connectée à Shopify via GraphQL — catalogue, panier persistant, compte client, blog et conformité RGPD complète.",
          color: "#1E293B",
          stack: ["Next.js", "TypeScript", "Shopify GraphQL", "Prisma", "PostgreSQL", "Framer Motion"]
        },
        {
          id: "albi-rp",
          slug: "albi-rp",
          title: "ALBI RP™",
          sub: "Écosystème jeu + bot + site — Roblox RP francophone",
          desc: "Aucun serveur RP sérieux dans l'écosystème Roblox francophone. Résultat : un écosystème complet — jeu Roblox, bot Discord synchronisé en temps réel, site web et API — construit de zéro, en production active.",
          color: "#334155",
          stack: ["Lua/Luau", "TypeScript", "Discord.js", "Vercel", "Tailwind", "Zod"]
        }
      ]
    },
    about: {
      content: "Je m'appelle Aïssa. Je suis entrepreneur, builder, et architecte de systèmes — basé dans le sud de France, opérant partout.\n\nPas d'héritage, pas de filet. Juste des années à apprendre, construire et tester — jusqu'à maîtriser ce que beaucoup délèguent sans comprendre.\n\nCe qui me différencie ? Je vis dans les deux mondes à la fois : je comprends la stratégie business et je construis le système technique qui l'exécute. Pas besoin de chef de projet entre vous et le code.\n\nSi vous avez une idée de système — floue ou précise — je peux l'utiliser pour transformer en quelque chose de réel.",
      location: "Basé dans le sud de 🇫🇷. Travaillant dans le monde entier.",
      bio: [
        "Je m'appelle Aïssa. Je suis entrepreneur, builder, et architecte de systèmes — basé dans le sud de France, opérant partout.",
        "Pas d'héritage, pas de filet. Juste des années à apprendre, construire et tester — jusqu'à maîtriser ce que beaucoup délèguent sans comprendre.",
        "Ce qui me différencie ? Je vis dans les deux mondes à la fois : je comprends la stratégie business et je construis le système technique qui l'exécute. Pas besoin de chef de projet entre vous et le code.",
        "Si vous avez une idée de système — floue ou précise — je peux la transformer en quelque chose de réel.",
      ],
      photoAlt: "Aïssa BELKOUSSA — Architecte de systèmes",
    },
    contact: {
      title: "Une idée de système ? Un process qui tourne mal ? Un projet qui attend depuis trop longtemps ?",
      subtitle: "Parlons-en. Une conversation suffit pour savoir si je peux vous aider.",
      cta: "Initier un projet →",
    },
    footer: {
      jobTitle: "Developpeur Creatif",
      industry: "Architecture Industrielle",
      systemsStrategy: "Strategie des Systemes",
      title: "Construire l'avenir du progrès numérique.",
      baseline: "Architecture de systèmes, automation et innovation digitale.",
      credits: "© 2026 Portfolio par AÏSSA BELKOUSSA",
      reserved: "Tous droits réservés",
      version: "Version préliminaire",
      betaNotice: "Ce site est en version beta. Le design, les fonctionnalités et le contenu sont susceptibles d'évoluer. Merci de votre compréhension.",
      legalNotice: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions générales d'utilisation",
      termsAndConditions: "Conditions générales de vente",
      explore: "Explorer",
      architecture: "Architecture",
      legal: "Légal",
    },
    funnel: {
      steps: {
        identity: {
          title: "Qui êtes-vous ?",
          nameLabel: "Nom complet",
          namePlaceholder: "Jean Dupont",
          emailLabel: "Email",
          emailPlaceholder: "jean@entreprise.com",
          contextLabel: "Entreprise ou Projet",
          contextPlaceholder: "Dassault Systèmes"
        },
        needs: {
          title: "De quoi avez-vous besoin ?",
          options: [
            { id: "site", label: "Site web professionnel", template: "J'ai besoin d'un site web professionnel qui reflète mon activité et génère des contacts qualifiés. Mon activité est..." },
            { id: "automation", label: "Automatisation & IA", template: "Je perds du temps sur des tâches répétitives (devis, relances, suivi client...). Je voudrais automatiser..." },
            { id: "dashboard", label: "Dashboard & données", template: "J'ai besoin d'un tableau de bord pour piloter mon activité avec des données en temps réel. Aujourd'hui je gère avec..." },
            { id: "system", label: "Système complet", template: "J'ai besoin d'un écosystème complet : site + automatisations + données. Mon objectif business est de..." },
            { id: "maintenance", label: "Maintenance d'un système existant", template: "J'ai déjà un site/système en place mais il n'est plus maintenu. J'ai besoin de..." },
            { id: "other", label: "Autre besoin", template: "" }
          ]
        },
        details: {
          title: "Dites-m'en plus",
          messageLabel: "Votre message",
          budgetLabel: "Budget estimé",
          customMessage: "Message personnalisé",
          useTemplate: "Utiliser un template"
        },
        message: { label: "Votre message (optionnel)", placeholder: "Décrivez votre besoin en quelques mots..." },
      },
      cta: { next: "Continuer", prev: "Retour", submit: "Recevoir ma proposition en 48h", submitting: "Envoi en cours...", guarantee: "Gratuit, sans engagement — réponse sous 48h" },
      success: {
        title: "Demande reçue",
        message: "Je reviens vers vous sous 48h pour analyser votre système.",
        bookCall: "Réserver mon appel — 30 min",
        bookCallSubtext: "Gratuit, sans engagement — créneaux limités",
        whatsappMessage: "Bonjour Aïssa, je viens d'envoyer ma demande via le site.",
        whatsappCta: "Ou m'écrire sur WhatsApp",
        backHome: "Retour à l'accueil",
      },
      plan: { selectedLabel: "Plan sélectionné" },
      errors: {
        generic: "Une erreur est survenue. Réessayez ou contactez-moi sur LinkedIn.",
        rate: "Trop de demandes. Réessayez dans quelques minutes.",
      },
    },
    contactPage: {
      badge: "Initiation de projet",
      heading: "Construisons\nvotre futur",
      headingItalic: "système.",
      intro: "Dites-moi tout sur vos ambitions. Que ce soit pour une architecture complexe, une automation intelligente ou un cockpit de données, je suis là pour structurer votre chaos.",
      availability: "Disponibilité : Projets T2-T3",
      calendlySection: "Ou réservez directement",
      calendlyTitle: "Appel découverte",
      calendlyDuration: "30 min",
      calendlyLocation: "Google Meet",
      calendlyFree: "Gratuit, sans engagement",
      calendlyDesc: "On fait le point sur votre besoin, votre budget et vos délais. Vous repartez avec une vision claire de ce qui est possible — même si on ne travaille pas ensemble.",
    },
    diagnostic: {
      srTitle: "Diagnostic digital gratuit",
      progressLabel: "Diagnostic",
      lastStep: "Dernière étape",
      questionOf: "Question",
      back: "Retour",
      questions: [
        { id: "site", question: "Votre site web actuel vous rapporte-t-il des clients ?", options: [{ label: "Oui, régulièrement", score: 3 }, { label: "Quelques-uns, mais pas assez", score: 2 }, { label: "Non, c'est juste une vitrine", score: 1 }, { label: "Je n'ai pas de site", score: 0 }] },
        { id: "rdv", question: "Comment vos clients prennent-ils rendez-vous ?", options: [{ label: "En ligne (Calendly, formulaire...)", score: 3 }, { label: "Par email", score: 2 }, { label: "Par téléphone uniquement", score: 1 }, { label: "Bouche-à-oreille", score: 0 }] },
        { id: "devis", question: "Combien de temps pour envoyer un devis ?", options: [{ label: "Automatique (moins de 5 min)", score: 3 }, { label: "Moins d'1 heure", score: 2 }, { label: "Quelques heures à 1 jour", score: 1 }, { label: "Plusieurs jours", score: 0 }] },
        { id: "relance", question: "Relancez-vous vos prospects non convertis ?", options: [{ label: "Oui, automatiquement", score: 3 }, { label: "Oui, manuellement", score: 2 }, { label: "Parfois, quand j'y pense", score: 1 }, { label: "Jamais", score: 0 }] },
        { id: "temps", question: "Combien d'heures/semaine sur des tâches admin répétitives ?", options: [{ label: "Moins de 2h", score: 3 }, { label: "2 à 5h", score: 2 }, { label: "5 à 10h", score: 1 }, { label: "Plus de 10h", score: 0 }] },
      ],
      emailPhase: {
        title: "Vos résultats sont prêts.",
        subtitle: "Entrez votre nom et email pour voir votre score et recevoir des recommandations personnalisées.",
        namePlaceholder: "Votre prénom",
        emailPlaceholder: "votre@email.com",
        sending: "Envoi...",
        submit: "Voir mes résultats",
        skip: "Voir sans donner mon email",
      },
      results: {
        levelLabel: "Niveau",
        answersLabel: "Vos réponses",
        seeOffers: "Voir toutes les offres",
        sendError: "Vos résultats sont affichés, mais l'envoi par email a échoué. Réessayez plus tard ou contactez-nous directement.",
        levels: {
          advanced: { level: "Avancé", headline: "Votre système digital est solide.", body: "Vous avez déjà une bonne base. L'étape suivante : automatiser ce qui reste manuel et optimiser votre tunnel de conversion pour maximiser chaque visite.", cta: "Passer au niveau supérieur" },
          intermediate: { level: "Intermédiaire", headline: "Vous perdez du temps et des clients chaque semaine.", body: "Les fondations sont là, mais votre système a des trous. Des devis trop lents, des relances oubliées, un site qui n'amène pas de leads — chaque semaine, c'est du CA qui s'évapore.", cta: "Colmater les fuites" },
          beginner: { level: "Débutant", headline: "Votre activité tourne sans filet digital.", body: "Pas de site efficace, pas de prise de RDV en ligne, pas de relance automatique. Vous faites tout à la main — et vous laissez de l'argent sur la table chaque jour. La bonne nouvelle : un système complet se met en place en 10 jours.", cta: "Construire mon système" },
        },
      },
    },
    domainAlert: {
      badge: "Alerte usurpation de domaine",
      title: "aissabelkoussa.com ne m'appartient pas.",
      subtitle: "Ce domaine est détenu par un tiers inconnu et utilise mon identité sans mon consentement. Si vous êtes arrivé ici, c'est que vous cherchiez probablement le bon site.",
      whatHappened: {
        title: "Ce qui se passe",
        description: "Le nom de domaine aissabelkoussa.com a été enregistré le 26 mai 2025 par l'entité « Team AG Internet », sans aucune autorisation de ma part. Ce détenteur a depuis activé la protection WHOIS (Whois Privacy Protection Foundation) pour masquer son identité. Ce domaine a été utilisé pour afficher des informations personnelles me concernant sans consentement — constituant une usurpation d'identité numérique.",
      },
      facts: {
        title: "Les faits",
        domain: "aissabelkoussa.com",
        holder: "Team AG Internet — masqué depuis via Whois Privacy Protection Foundation",
        registrar: "Hosting Concepts B.V. d/b/a Registrar.eu (Openprovider)",
        registeredOn: "26 mai 2025",
        expiresOn: "26 mai 2026",
        status: "Parking — verrouillé (client transfer prohibited)",
        dns: "verify1/2/3.registrar.eu (serveurs de vérification, aucun site actif)",
        ip: "15.197.130.221 — AWS Global Accelerator (ASN16509 AMAZON-02, US)",
        hosting: "Amazon Web Services (AWS) — infrastructure CDN via Global Accelerator + CloudFront",
        ssl: "Certificat émis par R11 (Let's Encrypt) le 9 juin 2025, validité 3 mois",
        contentHistory: "Évolution : infos personnelles usurpées → site fictif de production vidéo → page parking liens art/galeries → serveurs de vérification (état actuel)",
        suspiciousInfra: "Connexions détectées vers euob.youseasky.com, d38psrni17bvxu.cloudfront.net, obseu.youseasky.com — infrastructure tierce suspecte",
      },
      violations: {
        title: "Violations constatées",
        items: [
          "Usurpation d'identité numérique — utilisation non autorisée de mon nom, prénom et identité professionnelle",
          "Affichage non consenti d'informations personnelles — SIRET, adresse, données professionnelles",
          "Violation du RGPD — Articles 5, 6, 7 et 9 relatifs au traitement licite, au consentement et aux données sensibles",
          "Atteinte au droit à l'image et à la réputation professionnelle",
          "Risque de phishing — confusion volontaire entre .com et .fr pour tromper les visiteurs",
        ],
      },
      actions: {
        title: "Actions engagées",
        items: [
          "Signalement à Google Safe Browsing pour marquage du domaine comme phishing",
          "Plainte auprès du registrar Openprovider pour abus de domaine",
          "Plainte ICANN pour violation des règles d'enregistrement de domaine",
          "Signalement à la CNIL pour violation du RGPD",
          "Signalement à AWS Abuse (hébergement de l'infrastructure)",
          "Surveillance automatisée 24/7 du domaine (DNS, WHOIS, contenu)",
        ],
      },
      legitimateDomain: {
        title: "Mon vrai site",
        description: "Mon site officiel et légitime est hébergé sur le domaine aissabelkoussa.fr — le seul domaine que je possède et contrôle. Si vous cherchez à me contacter ou à voir mon travail, c'est là-bas qu'il faut aller.",
        cta: "Aller sur aissabelkoussa.fr",
      },
      legal: {
        title: "Base juridique",
        articles: [
          "Article 226-4-1 du Code Pénal — Usurpation d'identité numérique (1 an d'emprisonnement, 15 000 € d'amende)",
          "Loi Informatique et Libertés — Article 6 (traitement loyal et licite)",
          "RGPD — Articles 5, 6, 7 et 9 (licéité du traitement, consentement, données sensibles)",
          "Politique UDRP de l'ICANN — Résolution des litiges de noms de domaine",
        ],
      },
    },
    notFound: {
      code: "404",
      title: "Cette page n'existe pas.",
      subtitle: "L'URL que vous avez suivie ne mène nulle part. Peut-être a-t-elle été déplacée, supprimée, ou n'a-t-elle jamais existé.",
      seePlans: "Voir les offres",
      backHome: "Retour à l'accueil",
    },
    phishing: {
      alreadyHere: "Vous y êtes déjà",
      domainLabel: "Domaine",
      holderLabel: "Detenteur",
      registrarLabel: "Registrar",
      registeredLabel: "Enregistre le",
      expiresLabel: "Expire le",
      statusLabel: "Statut",
      dnsLabel: "DNS",
      hostingLabel: "Hebergement",
      sslLabel: "Certificat SSL",
      historyLabel: "Historique du contenu",
      suspectLabel: "Infrastructure suspecte",
    },
    domainLegit: {
      badge: "Domaine officiel verifie",
      title: "aissabelkoussa.fr — vous etes au bon endroit.",
      subtitle: "Ce domaine est le seul que je possede et controle. C'est mon espace officiel sur le web.",
      ownership: {
        title: "Propriété du domaine",
        domain: "aissabelkoussa.fr",
        holder: "Aïssa BELKOUSSA (personne physique)",
        registrar: "OVHcloud (Roubaix, France)",
        createdOn: "2025",
        dns: "OVHcloud — CNAME vers Vercel (f1f0ec239b0fc4a4.vercel-dns-017.com)",
        hosting: "Vercel Inc. (Edge Network mondial, serverless)",
        ssl: "Certificat automatique Vercel — émis pour aissabelkoussa.fr et www.aissabelkoussa.fr",
        ip: "216.198.79.1 (Vercel)",
        email: "contact@aissabelkoussa.fr — iCloud Mail (MX) + Resend (transactionnel, DKIM vérifié)",
        status: "Actif — déployé automatiquement via GitHub → Vercel",
      },
      whyThisPage: {
        title: "Pourquoi cette page existe",
        description: "Un tiers a enregistré le domaine aissabelkoussa.com sans mon autorisation, affichant mes informations personnelles sans consentement. Cette page existe pour dissiper toute confusion : aissabelkoussa.fr est le seul domaine légitime lié à mon identité professionnelle.",
      },
      verification: {
        title: "Comment verifier",
        items: [
          "L'URL dans votre barre d'adresse affiche bien aissabelkoussa.fr",
          "Le certificat SSL est emis pour aissabelkoussa.fr (cadenas dans le navigateur)",
          "Le WHOIS du domaine .fr est enregistre aupres d'OVHcloud par le titulaire legitime",
          "Ce site est deploye via Vercel et le DNS est gere par OVHcloud",
        ],
      },
      usurpation: {
        title: "Alerte sur aissabelkoussa.com",
        description: "Le domaine aissabelkoussa.com a été enregistré par « Team AG Internet » le 26 mai 2025 sans mon consentement. Ce détenteur a depuis masqué son identité via WHOIS privacy. Des signalements ont été déposés.",
        cta: "Voir le detail de l'usurpation",
      },
    },
    exitIntent: {
      badge: "Avant de partir",
      title: "Votre diagnostic\ngratuit en 2 min",
      subtitle: "Découvrez combien d'heures par semaine votre entreprise perd sur des tâches automatisables.",
      cta: "Recevoir mon diagnostic",
      trust: "Réponse personnalisée sous 48h",
    },
    whatsapp: {
      defaultMessage: "Bonjour Aïssa, j'ai vu votre site et j'aimerais discuter d'un projet.",
    },
    pricingTeaser: {
      stats: [
        { value: "100%", label: "Code livré en votre nom" },
        { value: "48h", label: "Temps de réponse max" },
        { value: "0", label: "Intermédiaire" },
      ],
      then: "puis",
      month: "/mois",
      allDetails: "Tous les détails et abonnements",
    },
    ui: {
      diagnosticFree: "Diagnostic gratuit",
      pricing: "Tarifs",
      menuOpen: "Ouvrir le menu",
      menuClose: "Fermer le menu",
      learnMore: "En savoir +",
      viewPricing: "Voir les tarifs",
      redirecting: "Redirection...",
    },
    checkout: {
      verifying: "Vérification du paiement...",
      confirmed: "Paiement confirmé",
      thanks: "Merci",
      confirmedDesc: "Votre commande a été enregistrée. Vous recevrez un email de confirmation sous quelques minutes.",
      thanksDesc: "Merci pour votre confiance. Si le paiement est en cours de traitement, vous recevrez une confirmation par email.",
      planKickoff: "Planifier le kick-off",
      backHome: "Retour à l'accueil",
      reassurance: "Facture envoyée par email \u2022 Support disponible 7j/7",
    },
    calendly: {
      title: "Réserver un appel découverte — Calendly",
      fallbackTitle: "Réserver un appel découverte",
      fallbackDesc: "30 minutes pour cadrer votre projet. Gratuit, zéro engagement.",
      fallbackCta: "Choisir un créneau",
    },
    blog: {
      badge: "Blog",
      title: "Articles experts : IA, automatisation et sites web pour PME",
      subtitle: "Guides pratiques, études de cas et retours d'expérience pour les artisans BTP et prestataires B2B qui veulent se digitaliser.",
      empty: "Aucun article publié pour le moment. Revenez bientôt.",
      featured: "À la une",
      cta: "Tu veux un système qui tourne pour toi ?",
      viewOffers: "Voir les offres",
    },
    article: {
      backToBlog: "Retour au blog",
      helpful: "Cet article t'a été utile ?",
      share: "Partage-le avec un artisan ou un entrepreneur qui en a besoin.",
      viewOffers: "Voir les offres",
      relatedArticles: "Articles liés",
    },
    links: {
      subtitle: "Architecte de systèmes digitaux — Albi, France",
      portfolio: "Portfolio & Systèmes",
      portfolioDesc: "Voir mes réalisations et mon approche",
      pricing: "Tarifs & Plans",
      pricingDesc: "Autonome · Accélérateur · Partenaire",
      diagnostic: "Diagnostic gratuit",
      diagnosticDesc: "Testez votre maturité digitale en 2 min",
      contact: "Prendre contact",
      contactDesc: "Recevoir ma proposition en 48h",
      whatsapp: "WhatsApp",
      whatsappDesc: "Réponse en quelques heures",
      blog: "Blog",
      blogDesc: "Articles experts IA & automatisation",
      available: "Disponible pour nouveaux projets",
    },
    availabilityBanner: {
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      slotSingular: "{month} {year} — {slots} créneau projet disponible",
      slotPlural: "{month} {year} — {slots} créneaux projets disponibles",
    },
    maintenanceGate: {
      title: "Site en maintenance",
      description: "Le site est en cours de construction et sera bientôt disponible.",
      comeback: "Revenez d'ici peu.",
      passwordPlaceholder: "Mot de passe",
    },
    roi: {
      badge: "Calculez votre ROI",
      title: "Combien vous coûte\nchaque semaine sans système ?",
      tradeLabel: "Votre métier",
      hoursLabel: (hours: number) => `Heures perdues en admin par semaine : ${hours}h`,
      projection: "Votre projection",
      savedPerWeek: "récupérées / semaine",
      valuePerWeek: "de valeur / semaine",
      savedPerYear: "économisés / an",
      weeksUnit: "sem.",
      breakEven: "pour rentabiliser",
      summary: (weeksToROI: number, weeklySaved: string) =>
        `En ${weeksToROI} semaines, votre système Accélérateur à 2 900 € est rentabilisé. Ensuite, c'est ${weeklySaved} € de valeur nette chaque semaine.`,
      placeholder: "Sélectionnez votre métier pour voir votre ROI",
    },
    audit: {
      badge: "Audit express",
      title: "Votre site vous rapporte-t-il des clients ?",
      subtitle: "Un rapport personnalise qui identifie exactement ce qui ne fonctionne dans votre systeme digital — et comment le corriger.",
      cta: "Commander mon audit",
      price: "47",
      originalPrice: "197",
      guarantee: "Satisfait ou rembourse",
      delivery: "Livre sous 24h",
      deductible: "Paiement unique. Deductible si vous passez a une offre superieure.",
      freeDiagnostic: "Vous preferez un diagnostic gratuit d'abord ?",
      freeDiagnosticCta: "Faire le diagnostic gratuit",
    },
    upsell: {
      timerLabel: "Offre disponible",
      skip: "Non merci, voir ma confirmation",
    },
    unsubscribe: {
      title: "Desinscription confirmee",
      subtitle: "Vous ne recevrez plus d'emails automatiques de notre part.",
      backHome: "Retour a l'accueil",
    },
    leadMagnet: {
      submit: "Recevoir la ressource",
      ready: "Votre ressource est prete.",
      download: "Telecharger",
    },
  },
  en: {
    warning: "aissabelkoussa.com is a phishing domain, make sure you are on aissabelkoussa.fr",
    nav: {
      offers: "Services",
      approach: "Approach",
      expertise: "Expertise",
      systems: "Systems",
      about: "About",
      contact: "Contact",
      services: "Pricing",
      blog: "Blog",
    },
    services: {
      badge: "Services & Results",
      title: "Your digital system.\nDesigned, delivered, operational.",
      subtitle: "Four clear offers. One goal: a system that runs from day one. First call free, no strings attached.",
      popularBadge: "Recommended",
      includesLabel: "What's included",
      durationLabel: "Estimated timeline",
      cta: "Get started",
      timeSavings: {
        badge: "Why automate",
        title: "Every week without a system,\ntime and money evaporate.",
        subtitle: "Here's what my clients concretely gain from day one in production.",
        items: [
          { metric: "13h", label: "saved per week", detail: "Admin tasks cut from 15h to 2h with automations" },
          { metric: "×50", label: "faster quotes", detail: "From 3h per quote to 5 minutes — auto-sent" },
          { metric: "5 min", label: "client response time", detail: "Down from 48h average — 24/7 automatic follow-up" },
          { metric: "-70%", label: "vs. agency cost", detail: "Full system from €2,900 — agencies charge €15,000+" },
          { metric: "10 days", label: "delivery time", detail: "Vs. 2-3 months at a traditional agency" },
          { metric: "24/7", label: "your system works", detail: "Even when you're on-site or in meetings" },
        ],
      },
      tiers: [
        {
          name: "Autopilot",
          tag: "First system",
          badge: "New",
          description: "Your first automated system in 5 days. Chatbot + auto emails + dashboard — everything you need to get started.",
          price: "€1,500",
          priceNote: "One-time payment. Delivered in 5 business days.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "5 business days",
          features: [
            "AI chatbot integrated to your website",
            "Automated emails (welcome, follow-up, tracking)",
            "Real-time tracking dashboard",
            "Production deployment",
            "Technical documentation",
            "Onboarding session (1h)",
          ],
          excluded: [
            "No post-delivery maintenance",
            "No security updates",
            "No monitoring",
          ],
        },
        {
          name: "Pro",
          tag: "Project + maintenance",
          badge: "Recommended",
          description: "Complete system delivered and maintained. 3 months free maintenance — you don't touch a thing.",
          price: "€2,900",
          priceNote: "Then €490/month after 3 free months. No commitment.",
          monthlyPrice: "€490",
          monthlyNote: "3 months free (€1,470 value)",
          duration: "5 to 10 business days",
          features: [
            "1 turnkey system (website, automation or dashboard)",
            "Strategic brief + validated mockup",
            "Comprehensive usage license",
            "Production deployment included",
            "3 months monitoring + support included",
            "Bug fixes within 48h",
            "Continuous security updates",
            "Monthly performance report",
          ],
          excluded: [],
        },
        {
          name: "Custom",
          tag: "System + continuous evolution",
          description: "Dedicated technical partner. Your complete infrastructure — site, AI, data — with ongoing support.",
          price: "From €6,900",
          priceNote: "Then €1,900/month after 3 free months. No commitment.",
          monthlyPrice: "€1,900",
          monthlyNote: "3 months free (€5,700 value)",
          duration: "1 to 2 months",
          features: [
            "Multi-module system (site + automations + data)",
            "Custom AI integration (agents, LLM, workflows)",
            "Documented scalable architecture",
            "3 months evolution + Premium support included",
            "New features and evolutions (10h/month)",
            "Priority support within 24h",
            "Monthly strategic review meeting",
            "Priority access to latest AI technologies",
          ],
          excluded: [],
        },
        {
          name: "AI Training",
          tag: "Skill building",
          badge: "New",
          description: "Make your team autonomous on AI. Hands-on, tailored training sessions.",
          price: "From €490/person",
          priceNote: "Eligible for OPCO funding. Volume discounts available.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "1 to 3 days",
          features: [
            "Team AI needs audit",
            "Custom training program",
            "Hands-on workshops on your use cases",
            "Training materials included",
            "Post-training follow-up (1 month)",
            "Eligible for OPCO funding",
          ],
          excluded: [],
        },
      ],
      ecosystemCta: {
        text: "Need a custom architecture? The Custom plan adapts to your ambitions — 2 to 6 months, outsourced CTO.",
        button: "Chat for 30 min",
      },
      comparison: {
        badge: "Why me",
        title: "Agency, cheap freelancer,\nor pro builder?",
        subtitle: "Compare objectively before choosing.",
        columns: ["Criteria", "Web agency", "Low-cost freelancer", "Aïssa BELKOUSSA"],
        rows: [
          { label: "Delivery time", values: ["2 to 4 months", "2 to 6 weeks", "5 to 10 days"] },
          { label: "Average price", values: ["€8,000 – €25,000", "€500 – €2,000", "€2,900"] },
          { label: "Maintenance included", values: ["Rarely", "Never", "3 months free"] },
          { label: "AI & automations", values: ["Optional (+)", "No", "Built-in natively"] },
          { label: "Single point of contact", values: ["No (PM + dev + designer)", "Yes (but high turnover)", "Yes, always"] },
          { label: "Source code delivered", values: ["Sometimes", "Rarely", "Always — usage license included"] },
          { label: "Guaranteed final price", values: ["Rarely (evolving quotes)", "Yes", "Yes — contractual"] },
          { label: "Post-delivery support", values: ["Paid from day 1", "None", "3 months included, then €490/mo"] },
        ],
      },
      recurring: {
        badge: "Ongoing subscription",
        title: "A system isn't just launched.\nIt's maintained.",
        subtitle: "After delivery, your system needs monitoring, updates, and evolutions. I stay by your side with a subscription tailored to your needs.",
        billingToggle: {
          monthly: "Monthly",
          yearly: "Yearly",
          saveBadge: "3 months free",
        },
        plans: [
          {
            name: "Essential",
            price: "€490",
            priceYearly: "€368",
            priceYearlyTotal: "Billed €4,410/year. You save €1,470/year.",
            features: [
              "24/7 monitoring and alerts",
              "Bug fixes within 48h",
              "Security and dependency updates",
              "1h monthly support included",
              "Monthly performance report",
            ],
          },
          {
            name: "Pro",
            price: "€1,900",
            priceYearly: "€1,425",
            priceYearlyTotal: "Billed €17,100/year. You save €5,700/year.",
            features: [
              "Everything in Essential +",
              "Evolutions and new features (up to 10h/month)",
              "Priority support within 24h",
              "Continuous performance optimization",
              "Monthly strategic review meeting",
              "Priority access to latest AI technologies",
            ],
          },
          {
            name: "Enterprise",
            price: "Custom quote",
            priceYearly: "Custom quote",
            priceYearlyTotal: "Annual commitment with negotiated discount.",
            features: [
              "Everything in Pro +",
              "Negotiated unlimited hours",
              "Architecture consulting and tech watch",
              "Continuous AI integration (new agents, workflows)",
              "Guaranteed SLA with contractual response time",
              "Dedicated contact, extended availability",
            ],
          },
        ],
      },
      process: {
        badge: "How it works",
        title: "From first call to system in production",
        steps: [
          { title: "Call", description: "A 30-min call to understand your need, constraints and goals. Free, no commitment." },
          { title: "Diagnosis", description: "I analyze your situation and propose an architecture with a clear quote, timeline and expected deliverables." },
          { title: "Build", description: "I design, code, and test. You follow progress in real-time with regular demos at each stage." },
          { title: "Delivery", description: "Production deployment, training, documentation. Your system runs — and I stay available for what comes next." },
        ],
      },
      finalCta: {
        title: "Ready to launch your system?",
        subtitle: "30 minutes is all it takes to scope your project. Free, zero commitment.",
        button: "Book a call",
      },
    },
    hero: {
      title: "You know you should automate.\nYou don't know where to start.",
      subtitle: "I transform your system intuitions into concrete, coherent, and reliable digital architectures — from a fuzzy idea to a system that runs in the background.",
      ctaPrimary: "Initialize a project",
      ctaSecondary: "View systems",
      scroll: "Scroll ⭣",
    },
    offers: {
      title: "What I build for you",
      initiate: "Explore",
      pillar1Props: { 
        title: "From intuition to autonomous system", 
        sub: "You have an idea of what could run on its own. I structure it, architect it, and deploy it. Workflows, automations, infrastructures — without unnecessary complexity." 
      },
      pillar2Props: { 
        title: "An interface that reflects what you've built", 
        sub: "Not just another showcase site. A coherent digital ecosystem — where every touchpoint tells your system's story and converts visitors into clients." 
      },
      pillar3Props: { 
        title: "Algorithmic Workflow & Data Intelligence", 
        sub: "Informed decisions, in real-time. Dashboards, cockpits, alerting, data strategies. I build the eyes of your business — so you lead with facts, not intuitions." 
      },
    },
    approach: {
      title: "How I work",
      intro: "I don't deliver deliverables. I build systems. Here is what guides every project.",
      bio: "System-first, business-driven",
      subtitle: "I merge strategy, design, and systems to build digital architectures that free up time.",
      pillars: [
        { 
          title: "System-first, business-driven", 
          content: "A system that doesn't serve a specific business goal is a toy. Every automation, every dashboard, every line of code has a measurable reason for being." 
        },
        { 
          title: "Builder, not consultant", 
          content: "I don't make recommendations for someone else to execute. I design, I code, I test, I deploy — and I deliver something that truly runs." 
        },
        { 
          title: "Structural simplicity", 
          content: "A simple system that runs 24/7 is infinitely more valuable than a brilliant architecture impossible to maintain. I cut through the superfluous." 
        },
        { 
          title: "Total transparency", 
          content: "You know where we are. You understand what we're building. No jargon to impress — clarity to move forward." 
        },
      ],
    },
    expertises: {
      title: "Systems I master",
      items: [
        {
          title: "Automation that frees your time",
          description: "Free up your human potential by delegating repetition to machines. I design autonomous flows that connect your tools and secure your operations 24/7.",
          microcopy: "Industrialize efficiency"
        },
        {
          title: "Concrete AI, not experimental",
          description: "Integrate artificial intelligence into the heart of your business. From specialized LLMs to autonomous agents, I build systems capable of reasoning and acting on your data.",
          microcopy: "Deploy intelligence"
        },
        {
          title: "See your business in real-time",
          description: "Stop flying blind. I install data cockpits that transform digital noise into clear, instantly actionable decision indicators.",
          microcopy: "Master the flow"
        },
        {
          title: "Self-executing processes",
          description: "Performance and precision for high-frequency environments. I optimize your algorithms and processing chains for flawless execution.",
          microcopy: "Execute with precision"
        },
        {
          title: "Pilot with the right numbers",
          description: "Design at the service of decision. Immersive interfaces designed for quick reading and intuitive management of complex systems.",
          microcopy: "Visualize the essential"
        },
        {
          title: "A site that works for you",
          description: "Your digital presence is not just an image, it's an asset. I create immersive experiences that capture attention and convert through clarity.",
          microcopy: "Captivate the audience"
        },
        {
          title: "Tools tailored for your team",
          description: "Tools your teams will love to use. I simplify your internal processes with bespoke solutions that adapt to your methods, not the other way around.",
          microcopy: "Simplify usage"
        },
        {
          title: "Convert without manual effort",
          description: "Conversion as a system. I automate your sales funnels and lead nurturing to guarantee predictable and scalable growth.",
          microcopy: "Scale growth"
        }
      ],
    },
    socialProof: {
      badge: "References",
      title: "Delivered projects",
      projects: [
        {
          name: "DK Building",
          sector: "Construction",
          description: "Corporate site + custom CMS for a steel construction SME",
        },
        {
          name: "Syna Events",
          sector: "Events",
          description: "Event website deployed in production",
        },
        {
          name: "Jolananas",
          sector: "E-commerce",
          description: "Premium Shopify storefront connected via GraphQL",
        },
        {
          name: "Albi RP",
          sector: "Gaming",
          description: "Full ecosystem: Roblox game + Discord bot + website + API",
        },
      ],
      stats: [
        { value: "93", label: "delivered projects" },
        { value: "4+", label: "years of experience" },
      ],
    },
    systems: {
      title: "Built systems, not promises",
      intro: "It's not what I could do. It's what I have done.",
      backLink: "Back to systems",
      notFound: "System not found.",
      backToBase: "Back to base",
      category: "Category",
      categoryValue: "System Architecture",
      year: "Year",
      status: "Status",
      deployed: "Deployed",
      intelligence: "System\nIntelligence",
      architectureLabel: "Architecture",
      architectureDesc: "Micro-services approach with automated deployment pipelines and real-time observability.",
      innovationLabel: "Innovation",
      innovationDesc: "Integrated AI agents for workflow optimization and automated decision-making processes.",
      startCta: "Start a system\nlike this?",
      startCtaButton: "Initialize a project",
      items: [
        {
          id: "dk-building",
          slug: "dk-building",
          title: "DK BUILDING",
          sub: "Corporate site & custom CMS — Construction, Albi",
          desc: "A steel construction SME with no web presence. Result: a complete corporate site with built-in CMS, secure admin panel and project gallery — deployed in production on dkbuilding.fr.",
          color: "#0F172A",
          stack: ["React 19", "Node.js", "Vercel", "Turso DB", "Cloudinary", "GSAP"]
        },
        {
          id: "jolananas",
          slug: "jolananas",
          title: "JOLANANAS",
          sub: "Premium e-commerce storefront — French artisan fashion",
          desc: "A standard Shopify theme couldn't do the brand justice. Result: a custom Next.js storefront connected to Shopify via GraphQL — catalog, persistent cart, customer accounts, blog and full GDPR compliance.",
          color: "#1E293B",
          stack: ["Next.js", "TypeScript", "Shopify GraphQL", "Prisma", "PostgreSQL", "Framer Motion"]
        },
        {
          id: "albi-rp",
          slug: "albi-rp",
          title: "ALBI RP™",
          sub: "Game + bot + site ecosystem — French Roblox RP",
          desc: "No serious RP server in the French Roblox ecosystem. Result: a complete ecosystem — Roblox game, real-time synced Discord bot, website and API — built from scratch, actively in production.",
          color: "#334155",
          stack: ["Lua/Luau", "TypeScript", "Discord.js", "Vercel", "Tailwind", "Zod"]
        }
      ]
    },
    about: {
      content: "My name is Aïssa. I'm an entrepreneur, builder, and systems architect — based in the South of France, operating worldwide.\n\nNo inheritance, no safety net. Just years of learning, building and testing — until I mastered what many outsource without understanding.\n\nWhat sets me apart? I live in both worlds at once: I understand business strategy and I build the technical system that executes it. No need for a project manager between you and the code.\n\nIf you have a system idea — vague or precise — I can turn it into something real.",
      location: "Based in the South of 🇫🇷. Working worldwide.",
      bio: [
        "My name is Aïssa. I'm an entrepreneur, builder, and systems architect — based in the South of France, operating worldwide.",
        "No inheritance, no safety net. Just years of learning, building and testing — until I mastered what many outsource without understanding.",
        "What sets me apart? I live in both worlds at once: I understand business strategy and I build the technical system that executes it. No need for a project manager between you and the code.",
        "If you have a system idea — vague or precise — I can turn it into something real.",
      ],
      photoAlt: "Aïssa BELKOUSSA — Systems Architect",
    },
    contact: {
      title: "A system idea? A process gone wrong? A project waiting for long enough?",
      subtitle: "Let's talk. One conversation is enough to know if I can help you.",
      cta: "Initialize a project →",
    },
    footer: {
      jobTitle: "Creative Developer",
      industry: "Industrial Architecture",
      systemsStrategy: "Systems Strategy",
      title: "Building the future of digital progress.",
      baseline: "System architectures, automation and digital innovation.",
      credits: "© 2026 Portfolio by AÏSSA BELKOUSSA",
      reserved: "All rights reserved",
      version: "Preliminary version",
      betaNotice: "This website is in beta. Design, features, and content are subject to change. Thank you for your understanding.",
      legalNotice: "Legal notice",
      privacyPolicy: "Privacy policy",
      termsOfService: "Terms of service",
      termsAndConditions: "Terms and conditions",
      explore: "Explore",
      architecture: "Architecture",
      legal: "Legal",
    },
    funnel: {
      steps: {
        identity: {
          title: "Who are you?",
          nameLabel: "Full Name",
          namePlaceholder: "John Doe",
          emailLabel: "Email",
          emailPlaceholder: "john@company.com",
          contextLabel: "Company or Project",
          contextPlaceholder: "Wayne Enterprises"
        },
        needs: {
          title: "What do you need?",
          options: [
            { id: "site", label: "Professional website", template: "I need a professional website that reflects my business and generates qualified leads. My business is..." },
            { id: "automation", label: "Automation & AI", template: "I'm losing time on repetitive tasks (quotes, follow-ups, client tracking...). I'd like to automate..." },
            { id: "dashboard", label: "Dashboard & data", template: "I need a dashboard to monitor my business with real-time data. Today I manage with..." },
            { id: "system", label: "Complete system", template: "I need a full ecosystem: website + automations + data. My business goal is to..." },
            { id: "maintenance", label: "Maintenance of an existing system", template: "I already have a website/system in place but it's no longer maintained. I need..." },
            { id: "other", label: "Other need", template: "" }
          ]
        },
        details: {
          title: "Tell me more",
          messageLabel: "Your message",
          budgetLabel: "Estimated Budget",
          customMessage: "Custom message",
          useTemplate: "Use template"
        },
        message: { label: "Your message (optional)", placeholder: "Describe your need in a few words..." },
      },
      cta: { next: "Continue", prev: "Back", submit: "Get my proposal in 48h", submitting: "Sending...", guarantee: "Free, no commitment — response within 48h" },
      success: {
        title: "Request received",
        message: "I'll get back to you within 48h to analyze your system.",
        bookCall: "Book my call — 30 min",
        bookCallSubtext: "Free, no commitment — limited slots",
        whatsappMessage: "Hi Aïssa, I just submitted my request through the website.",
        whatsappCta: "Or message me on WhatsApp",
        backHome: "Back to home",
      },
      plan: { selectedLabel: "Selected plan" },
      errors: {
        generic: "Something went wrong. Please try again or reach out on LinkedIn.",
        rate: "Too many requests. Please try again in a few minutes.",
      },
    },
    contactPage: {
      badge: "Project initiation",
      heading: "Let's build\nyour next",
      headingItalic: "system.",
      intro: "Tell me everything about your ambitions. Whether it's a complex architecture, an intelligent automation, or a data dashboard, I'm here to structure your chaos.",
      availability: "Availability: Q2-Q3 Projects",
      calendlySection: "Or book directly",
      calendlyTitle: "Discovery call",
      calendlyDuration: "30 min",
      calendlyLocation: "Google Meet",
      calendlyFree: "Free, no commitment",
      calendlyDesc: "We review your needs, budget and timeline. You leave with a clear picture of what's possible — even if we don't work together.",
    },
    diagnostic: {
      srTitle: "Free digital diagnostic",
      progressLabel: "Diagnostic",
      lastStep: "Last step",
      questionOf: "Question",
      back: "Back",
      questions: [
        { id: "site", question: "Does your current website bring you clients?", options: [{ label: "Yes, regularly", score: 3 }, { label: "A few, but not enough", score: 2 }, { label: "No, it's just a showcase", score: 1 }, { label: "I don't have a website", score: 0 }] },
        { id: "rdv", question: "How do your clients book appointments?", options: [{ label: "Online (Calendly, form...)", score: 3 }, { label: "By email", score: 2 }, { label: "By phone only", score: 1 }, { label: "Word of mouth", score: 0 }] },
        { id: "devis", question: "How long to send a quote?", options: [{ label: "Automatic (under 5 min)", score: 3 }, { label: "Under 1 hour", score: 2 }, { label: "A few hours to 1 day", score: 1 }, { label: "Several days", score: 0 }] },
        { id: "relance", question: "Do you follow up with unconverted prospects?", options: [{ label: "Yes, automatically", score: 3 }, { label: "Yes, manually", score: 2 }, { label: "Sometimes, when I remember", score: 1 }, { label: "Never", score: 0 }] },
        { id: "temps", question: "Hours/week spent on repetitive admin tasks?", options: [{ label: "Under 2h", score: 3 }, { label: "2 to 5h", score: 2 }, { label: "5 to 10h", score: 1 }, { label: "Over 10h", score: 0 }] },
      ],
      emailPhase: {
        title: "Your results are ready.",
        subtitle: "Enter your name and email to see your score and receive personalized recommendations.",
        namePlaceholder: "Your first name",
        emailPlaceholder: "your@email.com",
        sending: "Sending...",
        submit: "See my results",
        skip: "See without giving my email",
      },
      results: {
        levelLabel: "Level",
        answersLabel: "Your answers",
        seeOffers: "See all plans",
        sendError: "Your results are displayed, but the email failed to send. Try again later or contact us directly.",
        levels: {
          advanced: { level: "Advanced", headline: "Your digital system is solid.", body: "You already have a strong foundation. Next step: automate what's still manual and optimize your conversion funnel to maximize every visit.", cta: "Level up" },
          intermediate: { level: "Intermediate", headline: "You're losing time and clients every week.", body: "The foundations are there, but your system has gaps. Slow quotes, forgotten follow-ups, a site that doesn't generate leads — every week, revenue evaporates.", cta: "Fix the leaks" },
          beginner: { level: "Beginner", headline: "Your business runs without a digital safety net.", body: "No effective website, no online booking, no automatic follow-up. You do everything manually — and leave money on the table every day. Good news: a complete system is up in 10 days.", cta: "Build my system" },
        },
      },
    },
    domainAlert: {
      badge: "Domain impersonation alert",
      title: "aissabelkoussa.com does not belong to me.",
      subtitle: "This domain is held by an unknown third party and uses my identity without my consent. If you landed here, you were probably looking for the right website.",
      whatHappened: {
        title: "What is happening",
        description: "The domain name aissabelkoussa.com was registered on May 26, 2025 by the entity 'Team AG Internet', without any authorization from me. This registrant has since enabled WHOIS privacy (Whois Privacy Protection Foundation) to hide their identity. This domain was used to display personal information about me without consent — constituting digital identity theft.",
      },
      facts: {
        title: "The facts",
        domain: "aissabelkoussa.com",
        holder: "Team AG Internet — since hidden via Whois Privacy Protection Foundation",
        registrar: "Hosting Concepts B.V. d/b/a Registrar.eu (Openprovider)",
        registeredOn: "May 26, 2025",
        expiresOn: "May 26, 2026",
        status: "Parked — locked (client transfer prohibited)",
        dns: "verify1/2/3.registrar.eu (verification servers, no active website)",
        ip: "15.197.130.221 — AWS Global Accelerator (ASN16509 AMAZON-02, US)",
        hosting: "Amazon Web Services (AWS) — CDN infrastructure via Global Accelerator + CloudFront",
        ssl: "Certificate issued by R11 (Let's Encrypt) on June 9, 2025, valid for 3 months",
        contentHistory: "Evolution: stolen personal info → fake video production site → art/gallery parking page → verification servers (current state)",
        suspiciousInfra: "Connections detected to euob.youseasky.com, d38psrni17bvxu.cloudfront.net, obseu.youseasky.com — suspicious third-party infrastructure",
      },
      violations: {
        title: "Documented violations",
        items: [
          "Digital identity theft — unauthorized use of my name and professional identity",
          "Non-consensual display of personal information — SIRET, address, professional data",
          "GDPR violation — Articles 5, 6, 7 and 9 regarding lawful processing, consent and sensitive data",
          "Infringement of image rights and professional reputation",
          "Phishing risk — deliberate confusion between .com and .fr to deceive visitors",
        ],
      },
      actions: {
        title: "Actions taken",
        items: [
          "Report to Google Safe Browsing to flag the domain as phishing",
          "Complaint to the registrar Openprovider for domain abuse",
          "ICANN complaint for domain registration policy violation",
          "Report to the CNIL (French Data Protection Authority) for GDPR violation",
          "Report to AWS Abuse (infrastructure hosting)",
          "Automated 24/7 domain monitoring (DNS, WHOIS, content)",
        ],
      },
      legitimateDomain: {
        title: "My real website",
        description: "My official and legitimate website is hosted on the domain aissabelkoussa.fr — the only domain I own and control. If you are looking to contact me or see my work, that is where you need to go.",
        cta: "Go to aissabelkoussa.fr",
      },
      legal: {
        title: "Legal basis",
        articles: [
          "Article 226-4-1 of the French Penal Code — Digital identity theft (1 year imprisonment, €15,000 fine)",
          "French Data Protection Act — Article 6 (fair and lawful processing)",
          "GDPR — Articles 5, 6, 7 and 9 (lawfulness of processing, consent, sensitive data)",
          "ICANN UDRP Policy — Domain name dispute resolution",
        ],
      },
    },
    notFound: {
      code: "404",
      title: "This page doesn't exist.",
      subtitle: "The URL you followed leads nowhere. It may have been moved, deleted, or never existed.",
      seePlans: "See our plans",
      backHome: "Back to home",
    },
    phishing: {
      alreadyHere: "You are already here",
      domainLabel: "Domain",
      holderLabel: "Holder",
      registrarLabel: "Registrar",
      registeredLabel: "Registered on",
      expiresLabel: "Expires on",
      statusLabel: "Status",
      dnsLabel: "DNS",
      hostingLabel: "Hosting",
      sslLabel: "SSL Certificate",
      historyLabel: "Content history",
      suspectLabel: "Suspicious infrastructure",
    },
    domainLegit: {
      badge: "Verified official domain",
      title: "aissabelkoussa.fr — you are in the right place.",
      subtitle: "This domain is the only one I own and control. This is my official space on the web.",
      ownership: {
        title: "Domain ownership",
        domain: "aissabelkoussa.fr",
        holder: "Aïssa BELKOUSSA (individual)",
        registrar: "OVHcloud (Roubaix, France)",
        createdOn: "2025",
        dns: "OVHcloud — CNAME to Vercel (f1f0ec239b0fc4a4.vercel-dns-017.com)",
        hosting: "Vercel Inc. (Global Edge Network, serverless)",
        ssl: "Automatic Vercel certificate — issued for aissabelkoussa.fr and www.aissabelkoussa.fr",
        ip: "216.198.79.1 (Vercel)",
        email: "contact@aissabelkoussa.fr — iCloud Mail (MX) + Resend (transactional, DKIM verified)",
        status: "Active — auto-deployed via GitHub → Vercel",
      },
      whyThisPage: {
        title: "Why this page exists",
        description: "A third party registered the domain aissabelkoussa.com without my authorization, displaying my personal information without consent. This page exists to clear any confusion: aissabelkoussa.fr is the only legitimate domain tied to my professional identity.",
      },
      verification: {
        title: "How to verify",
        items: [
          "The URL in your address bar shows aissabelkoussa.fr",
          "The SSL certificate is issued for aissabelkoussa.fr (padlock icon in your browser)",
          "The WHOIS record for the .fr domain is registered with OVHcloud by the legitimate owner",
          "This site is deployed via Vercel and DNS is managed by OVHcloud",
        ],
      },
      usurpation: {
        title: "Alert about aissabelkoussa.com",
        description: "The domain aissabelkoussa.com was registered by 'Team AG Internet' on May 26, 2025 without my consent. This registrant has since hidden their identity via WHOIS privacy. Reports have been filed.",
        cta: "View usurpation details",
      },
    },
    exitIntent: {
      badge: "Before you go",
      title: "Your free diagnostic\nin 2 minutes",
      subtitle: "Discover how many hours per week your business loses on automatable tasks.",
      cta: "Get my diagnostic",
      trust: "Personalized response within 48h",
    },
    whatsapp: {
      defaultMessage: "Hi Aïssa, I saw your website and would like to discuss a project.",
    },
    pricingTeaser: {
      stats: [
        { value: "100%", label: "Code delivered under your name" },
        { value: "48h", label: "Max response time" },
        { value: "0", label: "Middlemen" },
      ],
      then: "then",
      month: "/mo",
      allDetails: "All details and subscriptions",
    },
    ui: {
      diagnosticFree: "Free diagnostic",
      pricing: "Pricing",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      learnMore: "Learn more +",
      viewPricing: "View pricing",
      redirecting: "Redirecting...",
    },
    checkout: {
      verifying: "Verifying payment...",
      confirmed: "Payment confirmed",
      thanks: "Thank you",
      confirmedDesc: "Your order has been registered. You will receive a confirmation email within a few minutes.",
      thanksDesc: "Thank you for your trust. If the payment is being processed, you will receive a confirmation by email.",
      planKickoff: "Schedule the kick-off",
      backHome: "Back to home",
      reassurance: "Invoice sent by email \u2022 Support available 7/7",
    },
    calendly: {
      title: "Book a discovery call — Calendly",
      fallbackTitle: "Book a discovery call",
      fallbackDesc: "30 minutes to scope your project. Free, zero commitment.",
      fallbackCta: "Choose a slot",
    },
    blog: {
      badge: "Blog",
      title: "Expert articles: AI, automation & websites for SMBs",
      subtitle: "Practical guides, case studies and real-world feedback for tradespeople and B2B providers looking to go digital.",
      empty: "No articles published yet. Check back soon.",
      featured: "Featured",
      cta: "Want a system that runs for you?",
      viewOffers: "View offers",
    },
    article: {
      backToBlog: "Back to blog",
      helpful: "Was this article helpful?",
      share: "Share it with a tradesperson or entrepreneur who needs it.",
      viewOffers: "View offers",
      relatedArticles: "Related articles",
    },
    links: {
      subtitle: "Digital systems architect — Albi, France",
      portfolio: "Portfolio & Systems",
      portfolioDesc: "See my work and approach",
      pricing: "Pricing & Plans",
      pricingDesc: "Standalone · Accelerator · Partner",
      diagnostic: "Free diagnostic",
      diagnosticDesc: "Test your digital maturity in 2 min",
      contact: "Get in touch",
      contactDesc: "Receive my proposal within 48h",
      whatsapp: "WhatsApp",
      whatsappDesc: "Response within a few hours",
      blog: "Blog",
      blogDesc: "Expert articles on AI & automation",
      available: "Available for new projects",
    },
    availabilityBanner: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      slotSingular: "{month} {year} — {slots} project slot available",
      slotPlural: "{month} {year} — {slots} project slots available",
    },
    maintenanceGate: {
      title: "Under maintenance",
      description: "The website is under construction and will be available soon.",
      comeback: "Check back shortly.",
      passwordPlaceholder: "Password",
    },
    roi: {
      badge: "Calculate your ROI",
      title: "How much is each week\nwithout a system costing you?",
      tradeLabel: "Your trade",
      hoursLabel: (hours: number) => `Hours lost on admin per week: ${hours}h`,
      projection: "Your projection",
      savedPerWeek: "saved / week",
      valuePerWeek: "value / week",
      savedPerYear: "saved / year",
      weeksUnit: "wks",
      breakEven: "to break even",
      summary: (weeksToROI: number, weeklySaved: string) =>
        `In ${weeksToROI} weeks, your Accelerator system at €2,900 pays for itself. After that, it's €${weeklySaved} net value every week.`,
      placeholder: "Select your trade to see your ROI",
    },
    audit: {
      badge: "Express audit",
      title: "Does your website bring you clients?",
      subtitle: "A personalized report that identifies exactly what's broken in your digital system — and how to fix it.",
      cta: "Order my audit",
      price: "47",
      originalPrice: "197",
      guarantee: "Satisfied or refunded",
      delivery: "Delivered within 24h",
      deductible: "One-time payment. Deductible if you upgrade to a higher offer.",
      freeDiagnostic: "Prefer a free diagnostic first?",
      freeDiagnosticCta: "Take the free diagnostic",
    },
    upsell: {
      timerLabel: "Offer available",
      skip: "No thanks, see my confirmation",
    },
    unsubscribe: {
      title: "Unsubscription confirmed",
      subtitle: "You will no longer receive automated emails from us.",
      backHome: "Back to home",
    },
    leadMagnet: {
      submit: "Get the resource",
      ready: "Your resource is ready.",
      download: "Download",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved && (saved === "fr" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, dict: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
