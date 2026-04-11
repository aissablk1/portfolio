"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "en";

interface LegalSectionDict {
  title: string;
  html: string;
}

interface LegalPageDict {
  badge: string;
  title: string;
  lastUpdated: string;
  sections: LegalSectionDict[];
}

interface RgpdRightDict {
  code: string;
  title: string;
  article: string;
  description: string;
  subject: string;
  body: string;
}

interface RgpdPageDict {
  badge: string;
  title: string;
  lastUpdated: string;
  intro: LegalSectionDict;
  rightsSectionTitle: string;
  rightsSectionIntro: string;
  ctaButton: string;
  rights: RgpdRightDict[];
  alternativeSection: LegalSectionDict;
  identitySection: LegalSectionDict;
  delaySection: LegalSectionDict;
  limitsSection: LegalSectionDict;
  cnilSection: LegalSectionDict;
}

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
    testimonialsBadge: string;
    testimonials: Array<{
      name: string;
      role: string;
      company: string;
      text: string;
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
      metrics?: Array<{ value: string; label: string }>;
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
    gdpr: string;
    termsOfService: string;
    termsAndConditions: string;
    accessibility: string;
    explore: string;
    architecture: string;
    legal: string;
    resources: string;
    training: string;
    aboutLink: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    newsletterSuccess: string;
    newsletterError: string;
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
    teaserBadge: string;
    teaserDesc: string;
    teaserCta: string;
    blogBadge: string;
    blogTitle: string;
    blogDesc: string;
    blogCta: string;
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
    auditCta: string;
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
    cookieMessage: string;
    cookieAccept: string;
    cookieDecline: string;
    cookiePolicy: string;
  };
  claudeArchitect: {
    navLabel: string;
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    description: string;
    domains: Array<{ label: string; weight: string }>;
    ctaPrimary: string;
    ctaSecondary: string;
    footnote: string;
    closeLabel: string;
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
    searchPlaceholder: string;
    noResults: string;
    allCategories: string;
    allCategoriesTitle: string;
    allCategoriesSubtitle: string;
    articleCountOne: string;
    articleCountOther: string;
    categoryTitle: string;
    backToBlog: string;
    categoryEmpty: string;
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
  legal: {
    mentionsLegales: LegalPageDict;
    confidentialite: LegalPageDict;
    cgu: LegalPageDict;
    cgv: LegalPageDict;
    accessibilite: LegalPageDict;
    rgpd: RgpdPageDict;
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
        { value: "93", label: "projets réalisés" },
        { value: "4+", label: "années d'expérience" },
      ],
      testimonialsBadge: "Témoignages",
      testimonials: [
        {
          name: "David K.",
          role: "Gérant",
          company: "DK Building — Albi",
          text: "En 10 jours, on avait un site pro qui montre nos réalisations. Trois demandes de contact la première semaine. Avant, tout passait par le bouche-à-oreille.",
        },
        {
          name: "Julien M.",
          role: "Fondateur",
          company: "Syna Events — Toulouse",
          text: "Le site a été livré dans les délais, avec exactement ce qu'on avait demandé. Pas de surprises sur la facture, pas de fonctionnalités inutiles. Du concret.",
        },
        {
          name: "Sarah L.",
          role: "Directrice",
          company: "Jolananas — E-commerce",
          text: "Notre boutique Shopify est passée d'un template générique à une vraie expérience de marque. Les clients nous disent que le site inspire confiance. Les ventes ont suivi.",
        },
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
          stack: ["React 19", "Node.js", "Vercel", "Turso DB", "Cloudinary", "GSAP"],
          metrics: [
            { value: "3 contacts", label: "première semaine" },
            { value: "10 jours", label: "de livraison" },
            { value: "0 €", label: "de maintenance la 1ère année" },
          ]
        },
        {
          id: "syna-events",
          slug: "syna-events",
          title: "SYNA EVENTS",
          sub: "Site événementiel professionnel — Événementiel, Toulouse",
          desc: "Une agence événementielle toulousaine avait besoin d'un site à la hauteur de ses prestations. Résultat : un site événementiel complet, responsive et déployé en production — livré dans les délais, sans surprise.",
          color: "#1A1A2E",
          stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
          metrics: [
            { value: "100%", label: "des fonctionnalités livrées" },
            { value: "5 jours", label: "de livraison" },
            { value: "Mobile-first", label: "responsive design" },
          ]
        },
        {
          id: "jolananas",
          slug: "jolananas",
          title: "JOLANANAS",
          sub: "Storefront e-commerce premium — Mode artisanale française",
          desc: "Une boutique Shopify standard ne rendait pas justice à la marque. Résultat : une storefront sur-mesure Next.js connectée à Shopify via GraphQL — catalogue, panier persistant, compte client, blog et conformité RGPD complète.",
          color: "#1E293B",
          stack: ["Next.js", "TypeScript", "Shopify GraphQL", "Prisma", "PostgreSQL", "Framer Motion"],
          metrics: [
            { value: "GraphQL", label: "API Shopify" },
            { value: "< 2s", label: "temps de chargement" },
            { value: "100%", label: "personnalisé" },
          ]
        },
        {
          id: "albi-rp",
          slug: "albi-rp",
          title: "ALBI RP™",
          sub: "Écosystème jeu + bot + site — Roblox RP francophone",
          desc: "Aucun serveur RP sérieux dans l'écosystème Roblox francophone. Résultat : un écosystème complet — jeu Roblox, bot Discord synchronisé en temps réel, site web et API — construit de zéro, en production active.",
          color: "#334155",
          stack: ["Lua/Luau", "TypeScript", "Discord.js", "Vercel", "Tailwind", "Zod"],
          metrics: [
            { value: "4 briques", label: "jeu + bot + site + API" },
            { value: "500+", label: "joueurs actifs" },
            { value: "24/7", label: "bot Discord opérationnel" },
          ]
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
      gdpr: "Exercer vos droits RGPD",
      termsOfService: "Conditions générales d'utilisation",
      termsAndConditions: "Conditions générales de vente",
      accessibility: "Accessibilité",
      explore: "Explorer",
      architecture: "Architecture",
      legal: "Légal",
      resources: "Ressources",
      training: "Formations",
      aboutLink: "À propos",
      newsletterTitle: "Newsletter",
      newsletterDesc: "Un article par semaine sur l'IA, l'automatisation et la visibilité digitale. Zéro spam.",
      newsletterPlaceholder: "Votre email",
      newsletterSuccess: "Inscrit ! À très vite.",
      newsletterError: "Erreur. Réessayez ou contactez-moi directement.",
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
        skip: "Voir sans donner mon e-mail",
      },
      results: {
        levelLabel: "Niveau",
        answersLabel: "Vos réponses",
        seeOffers: "Voir toutes les offres",
        sendError: "Vos résultats sont affichés, mais l'envoi par e-mail a échoué. Réessayez plus tard ou contactez-nous directement.",
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
      auditCta: "Ou recevez un audit personnalisé pour 47 €",
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
      cookieMessage: "Ce site utilise des cookies d'analyse (Google Analytics) pour mesurer l'audience et améliorer l'expérience. Aucune donnée personnelle n'est partagée à des fins publicitaires.",
      cookieAccept: "Accepter",
      cookieDecline: "Refuser",
      cookiePolicy: "Politique de confidentialité",
    },
    claudeArchitect: {
      navLabel: "Claude",
      eyebrow: "Claude Certified Architect",
      titleBefore: "Livrer Claude en production,",
      titleAccent: "pas en démo.",
      description:
        "J'ai lancé un micro-site dédié à mon positionnement d'architecte Claude. Audits, implémentations Claude Code, formations et guide de préparation à la certification CCA-F d'Anthropic. Découvrez-le.",
      domains: [
        { label: "Architecture agentique & orchestration", weight: "27\u00a0%" },
        { label: "Claude Code & workflows CI/CD", weight: "20\u00a0%" },
        { label: "Prompt engineering & outputs structurés", weight: "20\u00a0%" },
        { label: "Conception d'outils & intégration MCP", weight: "18\u00a0%" },
        { label: "Gestion de contexte & fiabilité", weight: "15\u00a0%" },
      ],
      ctaPrimary: "Voir claude-architect.fr",
      ctaSecondary: "Rejoindre la liste d'attente",
      footnote:
        "Anthropic a lancé cette certification le 12\u00a0mars\u00a02026. Je passe l'examen le 25\u00a0avril.",
      closeLabel: "Fermer",
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
      searchPlaceholder: "Rechercher un article...",
      noResults: "Aucun article ne correspond à votre recherche.",
      allCategories: "Toutes les catégories",
      allCategoriesTitle: "Explorer le blog par catégorie",
      allCategoriesSubtitle: "Tous les articles classés par thématique : IA, automatisation, sites web, conversion. Choisissez la catégorie qui correspond à votre besoin.",
      articleCountOne: "1 article",
      articleCountOther: "{count} articles",
      categoryTitle: "Articles — {category}",
      backToBlog: "Retour au blog",
      categoryEmpty: "Aucun article dans cette catégorie pour le moment.",
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
      subtitle: "Un rapport personnalisé qui identifie exactement ce qui ne fonctionne dans votre système digital — et comment le corriger.",
      cta: "Commander mon audit",
      price: "47",
      originalPrice: "197",
      guarantee: "Satisfait ou remboursé",
      delivery: "Livré sous 24h",
      deductible: "Paiement unique. Déductible si vous passez à une offre supérieure.",
      freeDiagnostic: "Vous préférez un diagnostic gratuit d'abord ?",
      freeDiagnosticCta: "Faire le diagnostic gratuit",
      teaserBadge: "Pas encore prêt à vous lancer ?",
      teaserDesc: "Recevez un audit personnalisé de votre présence digitale pour seulement 47 €. Rapport détaillé livré sous 24h.",
      teaserCta: "Commander mon audit — 47 €",
      blogBadge: "Aller plus loin",
      blogTitle: "Recevez un audit personnalisé de votre présence digitale",
      blogDesc: "5 axes analysés, recommandations concrètes, livré sous 24h. Seulement 47 €.",
      blogCta: "Commander mon audit — 47 €",
    },
    upsell: {
      timerLabel: "Offre disponible",
      skip: "Non merci, voir ma confirmation",
    },
    unsubscribe: {
      title: "Désinscription confirmée",
      subtitle: "Vous ne recevrez plus d'e-mails automatiques de notre part.",
      backHome: "Retour à l'accueil",
    },
    leadMagnet: {
      submit: "Recevoir la ressource",
      ready: "Votre ressource est prête.",
      download: "Télécharger",
    },
    legal: {
      mentionsLegales: {
        badge: "Mentions légales",
        title: "Mentions légales",
        lastUpdated: "3 avril 2026",
        sections: [
          {
            title: "Éditeur du site",
            html: `<p>Le site <strong>aissabelkoussa.fr</strong> est édité par :</p><p><strong>Aïssa BELKOUSSA</strong><br/>Entrepreneur individuel (micro-entreprise)<br/>SIREN : 937 690 592<br/>SIRET : 937 690 592 00012<br/>Code NAF : 5911B<br/>Adresse : Albi, 81000 — Occitanie, France<br/>Email : <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p><p>TVA non applicable — article 293 B du CGI.</p>`,
          },
          {
            title: "Directeur de la publication",
            html: `<p>Le directeur de la publication est <strong>Aïssa BELKOUSSA</strong>, en sa qualité d'éditeur du site.</p>`,
          },
          {
            title: "Hébergement",
            html: `<p>Le site est hébergé par :</p><p><strong>Vercel Inc.</strong><br/>440 N Barranca Ave #4133<br/>Covina, CA 91723, États-Unis<br/>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">vercel.com</a></p>`,
          },
          {
            title: "Nom de domaine",
            html: `<p>Le nom de domaine <strong>aissabelkoussa.fr</strong> est enregistré auprès de :</p><p><strong>OVHcloud</strong><br/>2 rue Kellermann, 59100 Roubaix, France<br/>RCS Lille Métropole 424 761 419<br/>Site : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">ovhcloud.com</a></p>`,
          },
          {
            title: "Propriété intellectuelle",
            html: `<p>L'ensemble du contenu du site (textes, images, code source, maquettes, logos, animations, vidéos, architecture) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive d'Aïssa BELKOUSSA, sauf mention contraire.</p><p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable d'Aïssa BELKOUSSA.</p><p>Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</p>`,
          },
          {
            title: "Données personnelles",
            html: `<p>Les données personnelles collectées via le formulaire de contact sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour en savoir plus, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p>`,
          },
          {
            title: "Cookies et traceurs",
            html: `<p>Le site utilise des cookies et traceurs strictement nécessaires à son fonctionnement ainsi que des traceurs d'analyse anonymisée (Vercel Analytics, beacon interne). Aucun cookie publicitaire, de retargeting ou de profilage n'est utilisé.</p><p>Un stockage local (localStorage) est utilisé pour mémoriser la préférence de langue de l'utilisateur (français ou anglais), strictement nécessaire au fonctionnement du site (art. 5.3 directive ePrivacy).</p><p>Les polices de caractères sont chargées depuis Google Fonts. Les liens vers des services tiers (Calendly, WhatsApp, LinkedIn, GitHub, Telegram) sont soumis aux politiques de cookies de leurs éditeurs respectifs.</p><p>Pour plus de détails, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p>`,
          },
          {
            title: "Responsabilité",
            html: `<p>L'éditeur s'efforce de fournir des informations aussi précises que possible sur le site. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.</p><p>L'éditeur ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.</p>`,
          },
          {
            title: "Liens hypertextes",
            html: `<p>Le site peut contenir des liens hypertextes vers d'autres sites. L'éditeur n'exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu ou aux éventuels dommages pouvant résulter de leur utilisation.</p>`,
          },
          {
            title: "Droit applicable",
            html: `<p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>`,
          },
        ],
      },
      confidentialite: {
        badge: "Confidentialité",
        title: "Politique de confidentialité",
        lastUpdated: "3 avril 2026",
        sections: [
          {
            title: "Responsable du traitement",
            html: `<p>Le responsable du traitement des données personnelles est :</p><p><strong>Aïssa BELKOUSSA</strong><br/>Entrepreneur individuel (micro-entreprise)<br/>SIRET : 937 690 592 00012<br/>Adresse : Albi, 81000 — Occitanie, France<br/>Email : <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p>`,
          },
          {
            title: "Données collectées",
            html: `<p>Dans le cadre de l'utilisation du site, les données suivantes peuvent être collectées :</p><p><strong>Via le formulaire de contact :</strong></p><ul><li>Nom complet</li><li>Adresse email</li><li>Type de besoin sélectionné</li><li>Message libre (optionnel)</li><li>Plan sélectionné le cas échéant</li><li>Langue de navigation (français ou anglais)</li></ul><p><strong>Via la navigation sur le site (données anonymisées) :</strong></p><ul><li>Pages visitées et parcours de navigation</li><li>Referrer (page d'origine)</li><li>Largeur d'écran (résolution)</li><li>Langue du navigateur</li><li>Métriques de performance web (Core Web Vitals) via Vercel Analytics</li></ul><p>Ces données de navigation sont collectées de manière anonymisée, sans identification personnelle, et servent exclusivement à améliorer l'expérience utilisateur et les performances du site.</p>`,
          },
          {
            title: "Finalités du traitement",
            html: `<p>Les données collectées sont utilisées pour les finalités suivantes :</p><ul><li>Répondre aux demandes de contact et de devis (base légale : mesures précontractuelles, art. 6.1.b RGPD)</li><li>Envoyer un email de confirmation automatique au demandeur (base légale : intérêt légitime, art. 6.1.f RGPD)</li><li>Mesurer l'audience et les performances du site de manière anonymisée (base légale : intérêt légitime, art. 6.1.f RGPD)</li></ul><p>Les données ne sont jamais utilisées à des fins de prospection commerciale, de profilage ou de revente à des tiers.</p>`,
          },
          {
            title: "Cookies et traceurs",
            html: `<p>Le site utilise un nombre limité de cookies et technologies de stockage local, strictement nécessaires à son fonctionnement et à l'amélioration de l'expérience utilisateur.</p><p><strong>Cookies strictement nécessaires (exemptés de consentement — art. 5.3 directive ePrivacy) :</strong></p><ul><li><strong>Préférence de langue</strong> (localStorage) — stocke le choix de langue (français/anglais) pour assurer la continuité de navigation. Aucune donnée personnelle n'est concernée.</li></ul><p><strong>Cookies d'analyse anonymisée (intérêt légitime — art. 6.1.f RGPD) :</strong></p><ul><li><strong>Vercel Analytics</strong> — mesure d'audience anonymisée et métriques de performance (Core Web Vitals). Vercel Analytics ne collecte aucune donnée personnelle identifiable (pas d'adresse IP stockée, pas de fingerprinting, pas de cookie de suivi inter-sites). Ces données servent exclusivement à optimiser les performances du site. Fournisseur : Vercel Inc., conforme au EU-US Data Privacy Framework.</li><li><strong>Beacon de navigation</strong> — système de mesure interne enregistrant les pages visitées, le referrer, la largeur d'écran et la langue du navigateur. Aucune donnée personnelle identifiable n'est collectée. Ce beacon respecte le signal Do Not Track du navigateur : si activé, aucune donnée n'est envoyée.</li></ul><p><strong>Cookies déposés par les services tiers lors de l'utilisation de liens externes :</strong></p><ul><li><strong>Calendly</strong> — lorsque vous cliquez sur le lien de prise de rendez-vous, vous êtes redirigé vers calendly.com qui dépose ses propres cookies (fonctionnement, session, préférences). La politique de cookies de Calendly s'applique sur leur domaine : <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">calendly.com/privacy</a>.</li><li><strong>WhatsApp</strong> — le lien de contact WhatsApp redirige vers wa.me / web.whatsapp.com, soumis à la politique de confidentialité de Meta : <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">whatsapp.com/legal/privacy-policy</a>.</li></ul><p><strong>Polices de caractères :</strong></p><ul><li><strong>Google Fonts</strong> — les polices Inter et Outfit sont chargées depuis les serveurs de Google (fonts.googleapis.com / fonts.gstatic.com). Google peut collecter l'adresse IP du visiteur lors du chargement des polices. Aucune autre donnée n'est transmise. Politique de confidentialité : <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">policies.google.com/privacy</a>.</li></ul><p><strong>Acceptation automatique.</strong> Conformément à l'article 5.3 de la directive ePrivacy et aux lignes directrices de la CNIL, les cookies strictement nécessaires et les traceurs anonymisés ne nécessitant aucune identification personnelle sont activés par défaut, sans bandeau de consentement. En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de ces technologies telles que décrites ci-dessus. De même, en cliquant sur les liens vers des services tiers (Calendly, WhatsApp, LinkedIn, GitHub, Telegram), vous acceptez les politiques de cookies et de confidentialité respectives de ces services.</p><p>Le site n'utilise aucun cookie publicitaire, aucun outil de retargeting, aucun pixel de suivi (Facebook Pixel, Google Ads, etc.) et aucun cookie de profilage.</p>`,
          },
          {
            title: "Données clients traitées dans le cadre des prestations",
            html: `<p>En dehors des données collectées via le site internet (décrites ci-dessus), le prestataire peut être amené à accéder et traiter des données sensibles appartenant au client dans le cadre de l'exécution des prestations (création de site, automatisation, intégration, maintenance). Ces données peuvent inclure :</p><ul><li>Coordonnées bancaires et informations financières (IBAN, RIB, numéros de compte)</li><li>Identifiants et accès techniques (mots de passe, clés API, accès serveurs)</li><li>Données clients du client (fichiers clients, contacts, historiques)</li><li>Données métier confidentielles (chiffre d'affaires, tarification, stratégie)</li></ul><p>Le traitement de ces données est encadré par le contrat de prestation et les conditions générales de vente. Le prestataire s'engage à :</p><ul><li>N'accéder aux données que dans la mesure strictement nécessaire à la mission</li><li>Appliquer les mesures de sécurité appropriées (chiffrement, accès restreints, authentification forte)</li><li>Ne jamais divulguer de données confidentielles à des tiers</li><li>Supprimer ou restituer toutes les données et accès à l'issue de la mission</li></ul><p><strong>Le prestataire est tenu à une obligation de moyens en matière de protection des données et ne saurait être tenu responsable des fuites, pertes ou accès non autorisés résultant de défaillances des systèmes du client, de services tiers, ou d'attaques informatiques hors de son contrôle direct.</strong></p><p>Pour le détail complet des responsabilités et obligations de chaque partie, consultez les <a href="/cgv" class="text-site-accent hover:underline">conditions générales de vente</a>, article « Confidentialité et données sensibles du client ».</p>`,
          },
          {
            title: "Sous-traitants et destinataires",
            html: `<p>Les données sont transmises uniquement aux sous-traitants techniques suivants, dans le strict cadre de leur mission :</p><ul><li><strong>Vercel Inc.</strong> (hébergement du site et analytics) — conforme au EU-US Data Privacy Framework (clauses contractuelles types). Siège : Covina, CA 91723, États-Unis.</li><li><strong>Resend</strong> (envoi d'emails transactionnels) — serveurs en Union Européenne (Irlande). Les données transitent par Resend pour l'envoi des emails de notification et de confirmation, sans stockage durable.</li><li><strong>Render</strong> (hébergement de l'API backend) — hébergeur du système de tracking interne et de l'API de contact. Les données anonymisées de navigation sont stockées dans une base MongoDB hébergée.</li><li><strong>Google LLC</strong> (polices de caractères) — les polices Inter et Outfit sont servies via Google Fonts. Seule l'adresse IP du visiteur peut être collectée lors du chargement.</li><li><strong>OVHcloud</strong> (registrar du nom de domaine) — 2 rue Kellermann, 59100 Roubaix, France.</li></ul><p>Aucune donnée n'est vendue, louée ou cédée à un tiers à des fins commerciales.</p>`,
          },
          {
            title: "Transferts hors Union Européenne",
            html: `<p>Certains sous-traitants sont situés aux États-Unis. Les transferts de données vers ces prestataires sont encadrés par :</p><ul><li>Le <strong>EU-US Data Privacy Framework</strong> (décision d'adéquation de la Commission européenne du 10 juillet 2023) pour Vercel Inc. et Google LLC</li><li>Les <strong>clauses contractuelles types</strong> (CCT) adoptées par la Commission européenne, le cas échéant</li></ul><p>Ces mécanismes garantissent un niveau de protection des données équivalent à celui du RGPD.</p>`,
          },
          {
            title: "Durée de conservation",
            html: `<ul><li><strong>Données du formulaire de contact</strong> : conservées dans la boîte email du responsable du traitement pour la durée nécessaire au traitement de la demande, puis archivées pendant une durée maximale de 3 ans à compter du dernier contact, conformément aux recommandations de la CNIL.</li><li><strong>Données de navigation anonymisées</strong> : conservées pendant une durée maximale de 25 mois conformément aux recommandations de la CNIL.</li><li><strong>Préférence de langue</strong> (localStorage) : conservée indéfiniment dans le navigateur de l'utilisateur. L'utilisateur peut la supprimer à tout moment via les paramètres de son navigateur.</li></ul>`,
          },
          {
            title: "Sécurité des données",
            html: `<p>Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour protéger les données personnelles :</p><ul><li>Chiffrement des communications via HTTPS (certificat SSL/TLS)</li><li>Clé API Resend stockée exclusivement côté serveur (jamais exposée côté client)</li><li>Rate limiting sur le formulaire de contact (3 requêtes par IP toutes les 15 minutes)</li><li>Protection anti-spam par champ honeypot</li><li>Validation et échappement (escaping) de toutes les données avant traitement</li><li>En-têtes de sécurité HTTP : Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy</li><li>Respect du signal Do Not Track pour le système de tracking interne</li></ul>`,
          },
          {
            title: "Vos droits",
            html: `<p>Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :</p><ul><li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en obtenir une copie</li><li><strong>Droit de rectification</strong> : faire corriger des données inexactes ou incomplètes</li><li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li><li><strong>Droit à la limitation</strong> : demander la suspension du traitement</li><li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible</li><li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données, y compris au tracking analytique (vous pouvez activer le signal Do Not Track dans votre navigateur)</li></ul><p>Pour exercer concrètement ces droits, consultez notre page dédiée <a href="/rgpd" class="text-site-accent hover:underline">Exercer vos droits RGPD</a>.</p><p>Pour toute question, contactez : <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a>. Une réponse vous sera apportée dans un délai d'un mois conformément à l'article 12 du RGPD.</p>`,
          },
          {
            title: "Réclamation",
            html: `<p>Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">www.cnil.fr</a>.</p>`,
          },
          {
            title: "Modifications",
            html: `<p>La présente politique de confidentialité peut être modifiée à tout moment. Les modifications prennent effet dès leur publication sur cette page. La date de dernière mise à jour est indiquée en haut de ce document. En cas de modification substantielle, une mention visible sera affichée sur le site.</p>`,
          },
        ],
      },
      cgu: {
        badge: "CGU",
        title: "Conditions générales d'utilisation",
        lastUpdated: "3 avril 2026",
        sections: [
          {
            title: "Objet",
            html: `<p>Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation du site internet <strong>aissabelkoussa.fr</strong> (ci-après « le Site »), édité par Aïssa BELKOUSSA. L'accès et l'utilisation du Site impliquent l'acceptation pleine et entière des présentes CGU.</p>`,
          },
          {
            title: "Accès au site",
            html: `<p>Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. L'éditeur met en œuvre les moyens raisonnables pour assurer un accès continu au Site, mais ne saurait garantir une disponibilité permanente.</p><p>L'accès au Site peut être interrompu à tout moment, sans préavis ni indemnité, notamment pour des raisons de maintenance, de mise à jour, de sécurité ou en cas de force majeure.</p>`,
          },
          {
            title: "Cookies, traceurs et services tiers",
            html: `<p>En accédant au Site et en poursuivant votre navigation, vous acceptez les conditions suivantes relatives aux cookies et services tiers :</p><p><strong>Services intégrés au Site :</strong></p><ul><li><strong>Vercel Analytics &amp; Web Vitals</strong> — mesure d'audience anonymisée et métriques de performance. Ces traceurs sont activés par défaut car ils ne collectent aucune donnée personnelle identifiable et répondent à un intérêt légitime d'amélioration du site (art. 6.1.f RGPD).</li><li><strong>Système de tracking interne</strong> — enregistrement anonymisé des pages visitées pour analyse statistique. Ce système respecte le signal Do Not Track du navigateur.</li><li><strong>Google Fonts</strong> — chargement des polices de caractères (Inter, Outfit) depuis les serveurs de Google. L'adresse IP du visiteur peut être collectée par Google lors du chargement.</li><li><strong>Stockage local</strong> (localStorage) — enregistrement de la préférence de langue. Strictement nécessaire au fonctionnement (art. 5.3 directive ePrivacy).</li></ul><p><strong>Services tiers accessibles via des liens externes :</strong></p><ul><li><strong>Calendly</strong> — en cliquant sur le lien de prise de rendez-vous, vous êtes redirigé vers calendly.com. Vous acceptez alors les conditions d'utilisation et la politique de confidentialité de Calendly, qui dépose ses propres cookies (session, fonctionnement, préférences).</li><li><strong>WhatsApp</strong> — en cliquant sur le lien de contact WhatsApp, vous êtes redirigé vers wa.me / web.whatsapp.com. Vous acceptez alors la politique de confidentialité de Meta Platforms.</li><li><strong>LinkedIn, GitHub, Telegram</strong> — les liens vers ces plateformes sont fournis à titre informatif. Chaque plateforme applique ses propres conditions d'utilisation et politique de cookies.</li></ul><p><strong>Acceptation automatique.</strong> Les cookies et traceurs décrits ci-dessus sont activés par défaut conformément aux exemptions prévues par la directive ePrivacy (cookies strictement nécessaires) et sur la base de l'intérêt légitime (cookies d'analyse anonymisée sans données personnelles). En poursuivant votre navigation, vous reconnaissez avoir pris connaissance de ces technologies et acceptez leur utilisation. Pour les services tiers (Calendly, WhatsApp, etc.), l'acceptation de leurs cookies est effective au moment où vous cliquez sur le lien de redirection.</p><p>Le Site n'utilise aucun cookie publicitaire, aucun pixel de suivi (Facebook Pixel, Google Ads, etc.), aucun outil de retargeting et aucun cookie de profilage.</p><p>Pour plus de détails, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p>`,
          },
          {
            title: "Propriété intellectuelle",
            html: `<p>L'ensemble des éléments composant le Site (textes, images, vidéos, code source, maquettes, logos, animations, architecture, design) sont protégés par le droit de la propriété intellectuelle et restent la propriété exclusive d'Aïssa BELKOUSSA, sauf mention contraire.</p><p>Toute reproduction, représentation, modification, distribution ou exploitation de tout ou partie du contenu du Site, par quelque procédé que ce soit, sans l'autorisation écrite préalable de l'éditeur, est strictement interdite et constitue un délit de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</p>`,
          },
          {
            title: "Utilisation du formulaire de contact",
            html: `<p>Le Site met à disposition un formulaire de contact permettant aux utilisateurs d'adresser des demandes de renseignement ou de devis. En utilisant ce formulaire, l'utilisateur s'engage à :</p><ul><li>Fournir des informations exactes, complètes et à jour</li><li>Ne pas utiliser le formulaire à des fins abusives, frauduleuses ou illicites</li><li>Ne pas transmettre de contenu injurieux, diffamatoire, discriminatoire ou contraire à l'ordre public</li><li>Ne pas tenter de perturber le fonctionnement du Site (spam, injection, scraping, etc.)</li></ul><p>L'éditeur se réserve le droit de ne pas donner suite à toute demande qu'il estimerait abusive ou contraire aux présentes CGU.</p>`,
          },
          {
            title: "Utilisation du service de prise de rendez-vous",
            html: `<p>Le Site propose un lien vers la plateforme Calendly permettant de prendre rendez-vous pour un appel de découverte gratuit de 30 minutes. En utilisant ce service :</p><ul><li>Vous êtes redirigé vers le site calendly.com, service tiers non contrôlé par l'éditeur</li><li>Les données saisies sur Calendly (nom, email, créneau choisi) sont soumises aux conditions d'utilisation et à la politique de confidentialité de Calendly Inc.</li><li>L'éditeur reçoit uniquement les informations de réservation (nom, email, date/heure du créneau) pour organiser le rendez-vous</li><li>Le rendez-vous est gratuit et sans engagement</li></ul>`,
          },
          {
            title: "Données personnelles",
            html: `<p>Les données personnelles collectées sur le Site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour plus d'informations, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p><p>Dans le cadre des prestations de services, le prestataire peut être amené à manipuler des données sensibles du client (coordonnées bancaires, identifiants, données métier). Le traitement de ces données est encadré par les <a href="/cgv" class="text-site-accent hover:underline">conditions générales de vente</a>, qui précisent les engagements de chaque partie et les limitations de responsabilité en matière de protection des données.</p>`,
          },
          {
            title: "Liens hypertextes",
            html: `<p>Le Site contient des liens vers des sites et services tiers, notamment :</p><ul><li>LinkedIn (profil professionnel)</li><li>GitHub (projets open source)</li><li>Telegram (communauté)</li><li>Calendly (prise de rendez-vous)</li><li>WhatsApp (messagerie)</li></ul><p>Ces liens sont fournis à titre informatif. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité, leurs conditions d'utilisation, leurs politiques de cookies ou les dommages pouvant résulter de leur utilisation.</p>`,
          },
          {
            title: "Limitation de responsabilité",
            html: `<p>L'éditeur s'efforce de fournir des informations fiables et à jour sur le Site, mais ne garantit pas l'exactitude, la complétude ou l'exhaustivité des informations publiées.</p><p>L'éditeur ne pourra en aucun cas être tenu responsable :</p><ul><li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Site</li><li>Des interruptions ou dysfonctionnements du Site, quelle qu'en soit la cause</li><li>De l'utilisation faite par des tiers des informations présentes sur le Site</li><li>Des virus ou éléments nuisibles qui pourraient infecter l'équipement informatique de l'utilisateur</li><li>Du contenu, de la disponibilité ou du fonctionnement des services tiers accessibles via les liens du Site (Calendly, WhatsApp, LinkedIn, etc.)</li></ul>`,
          },
          {
            title: "Modification des CGU",
            html: `<p>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur cette page. L'utilisateur est invité à consulter régulièrement cette page. La date de dernière mise à jour est indiquée en haut de ce document.</p>`,
          },
          {
            title: "Droit applicable et juridiction",
            html: `<p>Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</p>`,
          },
        ],
      },
      cgv: {
        badge: "CGV",
        title: "Conditions générales de vente",
        lastUpdated: "3 avril 2026",
        sections: [
          {
            title: "Conditions de règlement",
            html: `<p>Règlement à réception de facture, par chèque ou virement bancaire. Lorsque le devis prévoit un acompte, celui-ci est exigible à la commande. La commande n'est considérée comme ferme et définitive qu'après encaissement de l'acompte. Le solde est dû à la mise en ligne du site ou à la livraison des livrables convenus. En cas d'annulation de la commande à l'initiative du client après versement de l'acompte, celui-ci reste acquis au prestataire à titre d'indemnisation forfaitaire, sauf accord contraire écrit des parties.</p>`,
          },
          {
            title: "Pénalités de retard",
            html: `<p>En cas de retard de paiement, des pénalités seront appliquées de plein droit, sans mise en demeure préalable, au taux de 3 fois le taux d'intérêt légal en vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce).</p>`,
          },
          {
            title: "TVA",
            html: `<p>TVA non applicable, article 293 B du CGI. Total HT = Total TTC.</p>`,
          },
          {
            title: "Validité des propositions",
            html: `<p>Sauf mention contraire, tout devis ou proposition commerciale est valable 30 jours à compter de sa date d'émission. Passé ce délai, les tarifs et conditions pourront être révisés. Lorsque le devis prévoit un paiement échelonné (en 2 ou 3 fois), les échéances et montants sont précisés au devis et font partie intégrante des conditions contractuelles.</p>`,
          },
          {
            title: "Obligations du client",
            html: `<p>Le client s'engage à fournir au prestataire l'ensemble des éléments nécessaires à la réalisation du projet (contenus, textes, visuels, accès techniques, brief, charte graphique, etc.) dans un délai raisonnable et au plus tard dans les 10 jours ouvrés suivant la demande du prestataire.</p><p>Le client s'engage à valider les étapes intermédiaires (maquettes, prototypes, livrables partiels) dans un délai de 5 jours ouvrés à compter de leur mise à disposition. Passé ce délai et sans retour du client, les livrables soumis sont réputés validés.</p><p>Tout retard ou défaut de fourniture des éléments par le client entraîne un décalage équivalent du planning prévisionnel, sans que la responsabilité du prestataire puisse être engagée. En cas d'inactivité prolongée du client (absence de réponse supérieure à 30 jours calendaires malgré deux relances écrites), le prestataire se réserve le droit de considérer le projet comme abandonné. Les sommes versées restent acquises et le solde éventuellement dû devient immédiatement exigible.</p>`,
          },
          {
            title: "Propriété intellectuelle et licence d'utilisation",
            html: `<p><strong>Titularité.</strong> Les droits de propriété intellectuelle sur l'ensemble des livrables (code source, maquettes, algorithmes, configurations, visuels, contenus originaux) demeurent la propriété exclusive du prestataire.</p><p><strong>Licence d'utilisation.</strong> Après paiement intégral du prix du projet, le client bénéficie d'une licence d'utilisation :</p><ul><li><strong>Non exclusive</strong> : le prestataire conserve le droit de réutiliser librement tout ou partie des livrables (code, design, composants, méthodes, architecture) pour tout autre projet ou client, sans restriction ;</li><li>Illimitée dans le temps ;</li><li>Couvrant l'exploitation du projet tel que défini au devis ;</li><li>Transférable dans le cadre d'une cession ou transmission d'entreprise.</li></ul><p>La licence ne couvre pas : la revente, la sous-licence à des tiers, la modification du code source en dehors du périmètre défini au devis, ni l'extraction des briques logicielles pour un usage indépendant du projet livré.</p><p><strong>Effet de l'arrêt de la maintenance.</strong> En cas de résiliation de l'abonnement de maintenance : (a) le site/système reste en ligne et fonctionnel ; (b) la licence d'utilisation reste valide sans limitation de durée ; (c) le client conserve l'accès au code source livré ; (d) le prestataire n'est plus tenu aux mises à jour, corrections de bugs, monitoring ni support ; (e) l'hébergement sur l'infrastructure du prestataire est maintenu 90 jours après la fin de l'abonnement (cf. article Hébergement).</p><p><strong>Remise du code.</strong> Sur demande écrite, le prestataire s'engage à remettre au client l'intégralité du code source, de la documentation technique et des accès nécessaires à la migration dans un délai de 15 jours ouvrés.</p><p>Avant complet règlement, le prestataire reste plein et entier propriétaire des créations et se réserve le droit de suspendre le service en cas d'impayé.</p><p>Le prestataire se réserve la possibilité d'apporter des ajustements techniques ou esthétiques mineurs au projet, sans accord préalable du client, lorsque ces ajustements sont nécessaires pour des raisons de sécurité, de performance, de compatibilité ou d'amélioration continue du service.</p><p><strong>Collecte de données d'usage.</strong> Le prestataire se réserve le droit de collecter des données d'usage anonymisées issues du fonctionnement des systèmes livrés (statistiques de fréquentation, performances techniques, comportements de navigation, taux de conversion, données d'interaction). Ces données, dépourvues de toute information personnelle identifiable, sont utilisées à des fins d'amélioration continue des services, d'optimisation des performances, de recherche et développement, et de benchmark commercial. Le client est informé de cette collecte et peut s'y opposer par demande écrite. Cette collecte est conforme au RGPD et à la politique de confidentialité accessible sur le site du prestataire.</p><p>Sauf opposition expresse du client, le prestataire est autorisé à mentionner le nom et le logo du client ainsi qu'à présenter le projet réalisé au titre de ses références commerciales (portfolio, site internet, réseaux sociaux, documents de présentation). Le prestataire est également autorisé à communiquer, à des fins commerciales, sur les résultats obtenus et les métriques de performance du projet, sous forme anonymisée ou nominative sauf opposition du client, dans le respect de la confidentialité des données sensibles.</p>`,
          },
          {
            title: "Délais de livraison",
            html: `<p>Les délais de livraison sont estimés au devis et constituent un engagement du prestataire, sous réserve du respect par le client de ses propres obligations (fourniture des contenus, validations dans les délais, accès techniques). Tout retard imputable au client décale le planning d'autant.</p><p>En cas de retard imputable exclusivement au prestataire excédant 10 jours ouvrés par rapport au planning convenu, une remise de 5 % du montant total de la prestation sera appliquée par tranche de 10 jours ouvrés de retard supplémentaire, dans la limite de 20 % du montant total.</p><p>En cas de survenance d'un événement de force majeure au sens du droit français, l'exécution des obligations du prestataire pourra être suspendue sans que sa responsabilité ne puisse être engagée.</p>`,
          },
          {
            title: "Recette et acceptation",
            html: `<p>À compter de la mise à disposition du projet (recette), le client dispose d'un délai de 10 jours calendaires pour formuler ses réserves par écrit. Passé ce délai, les livrables seront réputés conformes et acceptés. En cas de réserves fondées et conformes au brief validé, le prestataire s'engage à effectuer les corrections nécessaires sans frais supplémentaires dans un délai raisonnable.</p>`,
          },
          {
            title: "Période de lancement incluse",
            html: `<p>Le prix du projet comprend une période de lancement de trois (3) mois à compter de la date du procès-verbal de recette ou, à défaut de réserves formulées dans le délai de 10 jours, à compter de la date de mise à disposition du projet.</p><p>Durant cette période, le client bénéficie des services de maintenance correspondant à la formule souscrite (Essentiel ou Premium), sans facturation supplémentaire. Cette période de lancement fait partie intégrante de la prestation projet. Elle n'est ni une période d'essai, ni un engagement de souscription à l'abonnement de maintenance.</p><p>À l'issue de la période de lancement, le client peut : (a) poursuivre l'abonnement de maintenance au tarif en vigueur, sans engagement de durée — la facturation démarre automatiquement sauf notification contraire du client ; (b) ne pas poursuivre, auquel cas les services de maintenance cessent automatiquement sans formalité. Le prestataire informe le client par e-mail quinze (15) jours avant la fin de la période de lancement.</p><p>La période de lancement n'est applicable qu'aux plans Accélérateur et Partenaire. Le plan Autonome ne comprend aucune période de lancement ni service de maintenance.</p>`,
          },
          {
            title: "Responsabilité",
            html: `<p>La responsabilité du prestataire, toutes causes confondues, est strictement limitée au montant HT effectivement payé par le client au titre de la prestation concernée.</p><p>En aucun cas le prestataire ne pourra être tenu responsable des préjudices indirects, notamment : perte de chiffre d'affaires, perte de données, perte de clientèle, atteinte à l'image ou à la réputation, manque à gagner, préjudice commercial ou financier de toute nature, y compris ceux résultant d'une fuite, d'une perte ou d'un accès non autorisé aux données du client (cf. article « Confidentialité et données sensibles du client »).</p><p>Le prestataire est tenu à une obligation de moyens. Il met en œuvre les mesures de sécurité raisonnables conformes aux bonnes pratiques de l'industrie, mais ne garantit pas l'inviolabilité des systèmes, réseaux ou services du client ou de tiers.</p>`,
          },
          {
            title: "Résiliation du contrat",
            html: `<p><strong>Résiliation pour manquement.</strong> Chacune des parties peut résilier le contrat en cas de manquement grave de l'autre partie à ses obligations, après mise en demeure restée sans effet pendant 15 jours calendaires adressée par lettre recommandée avec accusé de réception ou par e-mail avec confirmation de lecture.</p><p><strong>Résiliation du projet à l'initiative du client.</strong> En cas de résiliation à l'initiative du client en dehors d'un manquement du prestataire, les sommes versées restent acquises au prestataire au prorata du travail réalisé. Le prestataire fournira un état d'avancement détaillé et remettra les livrables produits jusqu'à la date de résiliation.</p><p><strong>Résiliation du projet à l'initiative du prestataire.</strong> En cas de résiliation à l'initiative du prestataire en dehors d'un manquement du client, le prestataire remboursera les sommes correspondant aux prestations non encore réalisées.</p><p><strong>Résiliation de l'abonnement de maintenance.</strong> Les conditions de résiliation spécifiques à l'abonnement de maintenance sont détaillées à l'article « Abonnements de maintenance et évolution ».</p>`,
          },
          {
            title: "Hébergement et infrastructure",
            html: `<p>Sauf mention contraire au devis, le projet est hébergé sur l'infrastructure technique gérée par le prestataire (serveurs, plateformes cloud, noms de domaine). Les frais d'hébergement sont inclus dans l'abonnement de maintenance le cas échéant, ou facturés séparément selon les modalités précisées au devis.</p><p>En l'absence d'abonnement actif et lorsque le projet est hébergé sur l'infrastructure du prestataire, ce dernier s'engage à maintenir l'hébergement pendant une durée de 90 jours suivant la fin de l'abonnement ou la livraison du projet. Passé ce délai, le prestataire pourra suspendre l'hébergement après notification préalable de 30 jours adressée au client. Le prestataire s'engage à fournir au client, sur demande, une copie des données et fichiers nécessaires à la migration du projet vers un autre hébergeur.</p><p>Lorsque le projet est hébergé sur l'infrastructure du client, le prestataire n'est pas responsable de la disponibilité, de la sécurité ni de la performance de l'hébergement.</p>`,
          },
          {
            title: "Abonnements de maintenance et évolution",
            html: `<p><strong>Souscription et durée.</strong> L'abonnement de maintenance prend effet automatiquement à l'issue de la période de lancement de trois (3) mois, soit le 91e jour suivant la date de recette du projet. Le prestataire adresse une facture mensuelle au client, payable par virement bancaire ou prélèvement SEPA dans un délai de quinze (15) jours suivant la date d'émission. L'abonnement est reconductible tacitement chaque mois.</p><p><strong>Niveaux de service (SLA).</strong></p><p><em>Formule Essentiel (490 €/mois) :</em> monitoring 24/7 (disponibilité cible : 99,5 %) ; corrections bugs critiques : 48 h ouvrées ; corrections bugs mineurs : 10 jours ouvrés ; mises à jour sécurité : appliquées sous 72 h ; 1 h de support mensuel inclus ; rapport mensuel de performance.</p><p><em>Formule Premium (1 900 €/mois) :</em> monitoring 24/7 (disponibilité cible : 99,9 %) ; corrections bugs critiques : 24 h ouvrées ; corrections bugs mineurs : 5 jours ouvrés ; mises à jour sécurité : appliquées sous 24 h ; évolutions jusqu'à 10 h/mois (non reportables) ; support prioritaire 24 h ; réunion de suivi stratégique mensuelle ; rapport mensuel de performance.</p><p>Les niveaux de service s'appliquent aux jours ouvrés (lundi-vendredi, hors jours fériés français), sauf pour le monitoring automatisé qui fonctionne en continu. Toute prestation excédant le périmètre de l'abonnement fera l'objet d'un devis complémentaire.</p><p><strong>Résiliation par le client.</strong> Le client peut résilier son abonnement à tout moment, par e-mail avec accusé de réception ou lettre recommandée, moyennant un préavis de trente (30) jours avant la prochaine échéance mensuelle. La résiliation prend effet à la fin du mois civil suivant la réception de la notification.</p><p><strong>Résiliation par le prestataire.</strong> Le prestataire peut résilier l'abonnement avec un préavis de soixante (60) jours, notamment en cas de cessation d'activité ou d'impossibilité technique de maintenir le service.</p><p><strong>Résiliation pour impayé.</strong> En cas de non-paiement d'une échéance malgré une relance restée sans effet pendant quinze (15) jours, le prestataire peut suspendre les services de maintenance et résilier l'abonnement de plein droit.</p><p><strong>Travaux en cours.</strong> En cas de résiliation, les travaux de maintenance en cours d'exécution au moment de la notification sont menés à terme. Aucune prestation nouvelle ne sera engagée.</p><p><strong>Clause de réversibilité.</strong> Dans les trente (30) jours suivant la date d'effet de la résiliation, le prestataire s'engage à : (a) remettre au client l'intégralité du code source à jour ; (b) fournir la documentation technique et les accès nécessaires (hébergement, DNS, comptes tiers, base de données) ; (c) assurer un transfert de compétences raisonnable (1 heure de visioconférence) pour faciliter la reprise par un autre prestataire ; (d) supprimer les données du client de ses systèmes dans un délai de 60 jours, sauf obligation légale de conservation.</p><p><strong>Engagement annuel.</strong> Le client peut opter pour un engagement annuel bénéficiant d'une remise de 25 % (soit l'équivalent de 3 mois offerts sur 12). L'engagement annuel est facturé en une seule fois à la date de souscription. En cas de résiliation anticipée d'un engagement annuel, les mensualités restantes ne sont pas remboursées.</p><p><strong>Révision tarifaire.</strong> Les tarifs des abonnements sont révisables une fois par an, à la date anniversaire du contrat, dans la limite de l'indice Syntec ou de 5 % (le plus bas des deux). Le prestataire notifie toute révision tarifaire soixante (60) jours avant son entrée en vigueur. En cas de refus, le client peut résilier sans pénalité dans les 30 jours suivant la notification.</p>`,
          },
          {
            title: "Données personnelles (RGPD)",
            html: `<p>Dans le cadre de la mission, des données personnelles (nom, téléphone, e-mail, informations relatives au projet, etc.) peuvent être collectées via le site, les formulaires en ligne, les demandes de devis, ainsi que par tout autre moyen de communication utilisé avec le prestataire (e-mail, téléphone, messagerie, etc.) pour le compte du client.</p><p>Le client est responsable du respect de la réglementation applicable (notamment le RGPD) vis-à-vis de ses propres clients. Le prestataire agit en qualité de sous-traitant technique et s'engage à mettre en œuvre des mesures de sécurité adaptées pour la gestion de ces données.</p><p>Pour plus de détails, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p>`,
          },
          {
            title: "Confidentialité et données sensibles du client",
            html: `<p>Dans le cadre de l'exécution des prestations (création de site, automatisation, intégration de systèmes, maintenance), le prestataire peut être amené à accéder, manipuler ou traiter des données sensibles appartenant au client ou à ses propres clients, notamment :</p><ul><li>Coordonnées bancaires et informations financières (IBAN, RIB, numéros de compte)</li><li>Identifiants et accès techniques (mots de passe, clés API, accès serveurs, panneaux d'administration)</li><li>Données clients du client (fichiers clients, contacts, historiques de commandes, factures)</li><li>Données métier confidentielles (chiffre d'affaires, marges, stratégie commerciale, tarification)</li><li>Tout autre document ou information communiqué par le client dans le cadre de la mission</li></ul><p><strong>Engagements du prestataire (obligation de moyens) :</strong></p><ul><li>Mettre en œuvre les mesures de sécurité raisonnables et conformes aux bonnes pratiques de l'industrie (chiffrement, accès restreints, authentification forte)</li><li>Accéder aux données du client uniquement dans la mesure strictement nécessaire à l'exécution de la prestation</li><li>Ne divulguer aucune donnée confidentielle à des tiers, sauf obligation légale ou autorisation écrite du client</li><li>Supprimer ou restituer l'ensemble des données, accès et identifiants du client à l'issue de la mission ou sur demande</li><li>Signaler au client toute faille de sécurité ou tout incident détecté dans les meilleurs délais</li></ul><p><strong>Limitation de responsabilité en matière de données.</strong> Le prestataire s'engage à une <strong>obligation de moyens</strong> en matière de protection des données, et non à une obligation de résultat. En aucun cas le prestataire ne pourra être tenu responsable :</p><ul><li>Des fuites, pertes, altérations ou accès non autorisés aux données résultant d'une défaillance de l'infrastructure, des systèmes ou des services du client ou de prestataires tiers choisis par le client</li><li>Des incidents de sécurité causés par des attaques informatiques (hacking, phishing, ransomware, ingénierie sociale) visant les systèmes du client, les services tiers ou l'environnement technique hors du contrôle direct du prestataire</li><li>De la perte de données liée à l'absence de sauvegardes effectuées par le client sur ses propres systèmes</li><li>De l'utilisation par le client de mots de passe faibles, du partage d'identifiants par des canaux non sécurisés, ou du non-respect des recommandations de sécurité formulées par le prestataire</li><li>Des conséquences liées à la transmission volontaire par le client de données sensibles (coordonnées bancaires, identifiants, etc.) via des canaux non chiffrés ou non sécurisés (email non chiffré, messagerie instantanée grand public, etc.)</li><li>Des dommages indirects ou consécutifs tels que perte de clientèle, atteinte à la réputation, manque à gagner ou préjudice commercial résultant d'une fuite de données</li></ul><p><strong>Obligations du client :</strong></p><ul><li>Effectuer une sauvegarde complète de ses données et systèmes avant de communiquer tout accès au prestataire</li><li>Transmettre les identifiants et données sensibles exclusivement par des canaux sécurisés (gestionnaire de mots de passe partagé, transfert chiffré, espace sécurisé dédié)</li><li>Informer le prestataire de la nature sensible des données auxquelles il accorde l'accès, et de toute réglementation spécifique applicable (PCI-DSS, données de santé, etc.)</li><li>Révoquer les accès accordés au prestataire à l'issue de la mission ou dès qu'ils ne sont plus nécessaires</li><li>S'assurer de la conformité réglementaire (RGPD, CNIL) du traitement des données personnelles de ses propres clients</li></ul><p>La présente clause de confidentialité survit à la fin du contrat pour une durée de deux (2) ans.</p>`,
          },
          {
            title: "Médiation et litiges",
            html: `<p>En cas de différend relatif à l'exécution ou à l'interprétation des présentes conditions, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut d'accord amiable dans un délai de 30 jours, le litige pourra être soumis à un médiateur de la consommation conformément aux articles L611-1 et suivants du Code de la consommation.</p><p>À défaut de résolution par voie de médiation, le litige sera porté devant les tribunaux compétents du ressort du siège du prestataire (Tribunal judiciaire d'Albi), nonobstant pluralité de défendeurs ou appel en garantie.</p><p>Les présentes conditions sont régies par le droit français.</p>`,
          },
          {
            title: "Droit de rétractation",
            html: `<p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni sur support matériel dont l'exécution a commencé avec l'accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.</p><p>Le client reconnaît et accepte que l'exécution de la prestation commence dès la signature du devis et le versement de l'acompte, et renonce expressément à son droit de rétractation à compter de ce moment.</p>`,
          },
          {
            title: "Non-sollicitation",
            html: `<p>Pendant la durée du contrat et les douze (12) mois suivant son terme, le client s'engage à ne pas solliciter directement ou indirectement les sous-traitants, prestataires ou collaborateurs mis en relation par le prestataire dans le cadre de la mission, sauf accord écrit préalable. Cette clause ne fait pas obstacle au droit du client de contracter librement avec tout prestataire de son choix pour des besoins sans rapport avec la mission.</p>`,
          },
          {
            title: "Acceptation des conditions",
            html: `<p>Tout document contractuel (devis, contrat, bon de commande, proposition commerciale, avenant, lettre de mission, et tout autre document émis par le prestataire) signé avec la mention « Bon pour accord » ou « Lu et approuvé » vaut engagement ferme et emporte acceptation pleine et entière des présentes conditions générales de vente.</p>`,
          },
        ],
      },
      accessibilite: {
        badge: "Accessibilité",
        title: "Déclaration d'accessibilité",
        lastUpdated: "10 avril 2026",
        sections: [
          {
            title: "Engagement",
            html: `<p><strong>Aïssa BELKOUSSA</strong> s'engage à rendre le site <strong>aissabelkoussa.fr</strong> accessible conformément à l'article 47 de la loi n°2005-102 du 11 février 2005.</p><p>La présente déclaration d'accessibilité s'applique au site <strong>www.aissabelkoussa.fr</strong>.</p>`,
          },
          {
            title: "Norme visée et état de conformité",
            html: `<p><strong>Norme visée :</strong> WCAG 2.1 niveau AA (Web Content Accessibility Guidelines).</p><p><strong>État de conformité :</strong> partiellement conforme. Le site n'a pas encore fait l'objet d'un audit complet de conformité. Les mesures décrites ci-dessous sont mises en place de bonne foi pour améliorer l'accessibilité.</p>`,
          },
          {
            title: "Contenus non accessibles",
            html: `<p>Les contenus suivants ne sont pas encore pleinement accessibles :</p><ul><li><strong>Animations Framer Motion :</strong> certaines animations de transition et d'entrée peuvent poser des difficultés aux utilisateurs sensibles aux mouvements, malgré le respect de <code>prefers-reduced-motion</code> dans les animations GSAP.</li><li><strong>Preloader :</strong> l'écran de chargement initial ne dispose pas d'alternative textuelle pour les lecteurs d'écran. Les utilisateurs de technologies d'assistance peuvent ne pas être informés de l'état de chargement.</li><li><strong>Contrastes de couleur :</strong> certains textes utilisant la classe <code>text-site-text-light</code> peuvent ne pas atteindre le ratio de contraste minimum de 4.5:1 exigé par le niveau AA, notamment sur les fonds clairs.</li></ul>`,
          },
          {
            title: "Mesures prises",
            html: `<p>Les mesures suivantes sont mises en place pour améliorer l'accessibilité du site :</p><ul><li><strong>Lien d'évitement :</strong> un lien « Skip to content » permet d'accéder directement au contenu principal sans parcourir la navigation.</li><li><strong>HTML sémantique :</strong> utilisation systématique des balises <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;nav&gt;</code> et des niveaux de titre hiérarchisés.</li><li><strong>Texte alternatif :</strong> les images disposent d'un attribut <code>alt</code> descriptif. Les éléments décoratifs sont marqués <code>aria-hidden="true"</code>.</li><li><strong>Focus visible :</strong> les éléments interactifs (liens, boutons, champs de formulaire) disposent d'un indicateur de focus visible.</li><li><strong>Réduction de mouvement :</strong> les animations GSAP respectent la préférence utilisateur <code>prefers-reduced-motion</code> et sont désactivées ou simplifiées lorsque cette option est activée.</li><li><strong>Navigation au clavier :</strong> l'ensemble du site est navigable au clavier.</li></ul>`,
          },
          {
            title: "Technologies utilisées",
            html: `<ul><li>HTML5</li><li>CSS3 (Tailwind CSS)</li><li>JavaScript / TypeScript</li><li>React (Next.js)</li><li>GSAP (animations)</li><li>Framer Motion (transitions)</li></ul>`,
          },
          {
            title: "Retour d'information et contact",
            html: `<p>Si vous rencontrez un défaut d'accessibilité qui vous empêche d'accéder à un contenu ou une fonctionnalité du site, vous pouvez nous contacter :</p><p><strong>Email :</strong> <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p><p>Nous nous engageons à vous répondre dans un délai de 7 jours ouvrés et à trouver une solution dans un délai raisonnable.</p>`,
          },
          {
            title: "Voies de recours",
            html: `<p>Si vous constatez un défaut d'accessibilité et que vous n'obtenez pas de réponse satisfaisante, vous pouvez :</p><ul><li>Écrire un message au <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">Défenseur des droits</a></li><li>Contacter le délégué du Défenseur des droits dans votre région</li><li>Envoyer un courrier par voie postale (gratuit) : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07</li></ul>`,
          },
          {
            title: "Date de la déclaration",
            html: `<p>Cette déclaration a été établie le <strong>10 avril 2026</strong>.</p>`,
          },
        ],
      },
      rgpd: {
        badge: "RGPD",
        title: "Exercer vos droits RGPD",
        lastUpdated: "11 avril 2026",
        intro: {
          title: "À quoi sert cette page ?",
          html: `<p>Cette page vous permet d'exercer concrètement vos droits sur les données personnelles que nous traitons. Pour comprendre <strong>quelles données</strong> sont collectées, <strong>pourquoi</strong> et <strong>combien de temps</strong> elles sont conservées, consultez la <a href="/confidentialite" class="text-site-accent hover:underline">politique de confidentialité</a>.</p><p>Conformément aux articles 15 à 22 du <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez de plusieurs droits sur vos données personnelles, exerçables <strong>gratuitement</strong> et à tout moment.</p>`,
        },
        rightsSectionTitle: "Vos droits, en un clic",
        rightsSectionIntro: "Chaque bouton ci-dessous ouvre votre client mail avec une demande pré-remplie. Il vous suffit de compléter les champs entre crochets et d'envoyer.",
        ctaButton: "Exercer ce droit",
        rights: [
          {
            code: "acces",
            title: "Droit d'accès",
            article: "art. 15 RGPD",
            description: "Obtenir la confirmation que vos données sont traitées, et une copie de toutes les données vous concernant (finalités, destinataires, durée de conservation).",
            subject: "Demande d'accès à mes données (art. 15 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 15 du RGPD, je souhaite exercer mon droit d'accès et obtenir :\n- La confirmation que des données me concernant sont traitées\n- Une copie de l'ensemble de ces données\n- Les finalités, catégories de données, destinataires et durée de conservation\n\nMes identifiants (email utilisé sur le site, nom) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "rectification",
            title: "Droit de rectification",
            article: "art. 16 RGPD",
            description: "Corriger des données inexactes ou compléter des données incomplètes vous concernant.",
            subject: "Demande de rectification de mes données (art. 16 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 16 du RGPD, je souhaite rectifier les données suivantes me concernant :\n\nDonnée à corriger : [à compléter]\nValeur actuelle : [à compléter]\nValeur correcte : [à compléter]\n\nMes identifiants (email utilisé sur le site) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "effacement",
            title: "Droit à l'effacement (« droit à l'oubli »)",
            article: "art. 17 RGPD",
            description: "Obtenir la suppression de vos données, sous réserve des obligations légales de conservation (comptabilité, facturation, etc.).",
            subject: "Demande d'effacement de mes données (art. 17 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 17 du RGPD, je souhaite exercer mon droit à l'effacement et demander la suppression de l'ensemble des données me concernant, sous réserve des obligations légales de conservation.\n\nMes identifiants (email utilisé sur le site, nom) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "limitation",
            title: "Droit à la limitation du traitement",
            article: "art. 18 RGPD",
            description: "Geler temporairement le traitement de vos données (par exemple en cas de contestation de leur exactitude).",
            subject: "Demande de limitation du traitement (art. 18 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 18 du RGPD, je souhaite obtenir la limitation du traitement des données me concernant.\n\nMotif :\n[à compléter]\n\nMes identifiants (email utilisé sur le site) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "portabilite",
            title: "Droit à la portabilité",
            article: "art. 20 RGPD",
            description: "Recevoir vos données dans un format structuré, couramment utilisé et lisible par machine (JSON, CSV), pour les transmettre à un autre responsable de traitement.",
            subject: "Demande de portabilité de mes données (art. 20 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 20 du RGPD, je souhaite exercer mon droit à la portabilité et recevoir l'ensemble des données me concernant dans un format structuré et lisible par machine (JSON ou CSV).\n\nMes identifiants (email utilisé sur le site) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "opposition",
            title: "Droit d'opposition",
            article: "art. 21 RGPD",
            description: "Vous opposer, à tout moment et pour des raisons tenant à votre situation particulière, au traitement de vos données fondé sur l'intérêt légitime ou à des fins de prospection.",
            subject: "Opposition au traitement (art. 21 RGPD)",
            body: "Bonjour,\n\nDans le cadre de l'article 21 du RGPD, je m'oppose au traitement des données me concernant.\n\nMotif (si traitement fondé sur l'intérêt légitime) :\n[à compléter]\n\nMes identifiants (email utilisé sur le site) :\n[à compléter]\n\nCordialement,",
          },
          {
            code: "directives",
            title: "Directives post-mortem",
            article: "art. 85 Loi Informatique & Libertés",
            description: "Définir des directives concernant la conservation, l'effacement et la communication de vos données après votre décès.",
            subject: "Directives post-mortem (art. 85 LIL)",
            body: "Bonjour,\n\nConformément à l'article 85 de la Loi Informatique et Libertés, je souhaite définir les directives suivantes concernant mes données après mon décès :\n\n[à compléter]\n\nMes identifiants (email utilisé sur le site) :\n[à compléter]\n\nCordialement,",
          },
        ],
        alternativeSection: {
          title: "Comment exercer vos droits autrement",
          html: `<p>Si vous préférez ne pas utiliser les boutons ci-dessus, vous pouvez exercer vos droits par l'un des moyens suivants :</p><ul><li>Par <strong>email</strong> à <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></li><li>Via le <a href="/contact" class="text-site-accent hover:underline">formulaire de contact</a> en précisant l'objet « Demande RGPD »</li><li>Par <strong>courrier postal</strong> : Aïssa BELKOUSSA, Albi 81000, France</li></ul><p>Pour les demandes d'accès, d'effacement et de portabilité, précisez <strong>l'adresse email</strong> que vous avez utilisée sur le site afin de permettre l'identification des données vous concernant.</p>`,
        },
        identitySection: {
          title: "Vérification d'identité",
          html: `<p>En principe, aucun justificatif d'identité n'est demandé : l'adresse email utilisée pour la demande est considérée comme suffisante lorsqu'elle correspond à celle enregistrée dans nos traitements.</p><p>En cas de <strong>doute raisonnable</strong> sur votre identité (adresse email différente, demande inhabituelle), nous pourrons vous demander, conformément à l'article 12.6 du RGPD, un justificatif d'identité supplémentaire. Ce justificatif sera supprimé dès la demande traitée.</p>`,
        },
        delaySection: {
          title: "Délai de réponse",
          html: `<p>Conformément à l'article 12.3 du RGPD, nous nous engageons à vous répondre <strong>dans un délai d'un mois</strong> maximum à compter de la réception de votre demande.</p><p>Ce délai peut être prolongé de deux mois supplémentaires si la demande est particulièrement complexe ou si nous recevons un nombre important de demandes. Dans ce cas, nous vous informerons de cette prolongation et de ses motifs dans le mois suivant la réception de votre demande.</p><p>L'exercice de vos droits est <strong>gratuit</strong>. Toutefois, en cas de demandes manifestement infondées ou excessives (notamment en raison de leur caractère répétitif), nous nous réservons le droit d'exiger le paiement de frais raisonnables ou de refuser de donner suite, conformément à l'article 12.5 du RGPD.</p>`,
        },
        limitsSection: {
          title: "Limites à vos droits",
          html: `<p>Certaines données peuvent être conservées au-delà de votre demande d'effacement lorsque la loi l'exige, notamment :</p><ul><li>Les <strong>factures</strong> et documents comptables (conservation légale de 10 ans — art. L123-22 Code de commerce)</li><li>Les données nécessaires à l'exercice ou à la défense de droits en justice</li><li>Les données dont la conservation est imposée par une obligation légale ou réglementaire</li></ul><p>Dans ces cas, les données concernées seront <strong>bloquées</strong> (accès restreint) plutôt que supprimées, et ne seront utilisées que pour les finalités légales qui imposent leur conservation.</p>`,
        },
        cnilSection: {
          title: "Réclamation auprès de la CNIL",
          html: `<p>Si vous estimez, après nous avoir contactés, que vos droits sur vos données ne sont pas respectés, vous avez le droit d'introduire une <strong>réclamation</strong> auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL), autorité de contrôle française en matière de protection des données personnelles.</p><p><strong>CNIL</strong><br/>3 Place de Fontenoy — TSA 80715<br/>75334 Paris Cedex 07<br/>Téléphone : 01 53 73 22 22<br/><a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">www.cnil.fr/fr/plaintes →</a></p><p>Nous vous invitons toutefois à nous contacter en premier lieu : la plupart des demandes peuvent être traitées rapidement et directement.</p>`,
        },
      },
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
      testimonialsBadge: "Testimonials",
      testimonials: [
        {
          name: "David K.",
          role: "Owner",
          company: "DK Building — Albi",
          text: "In 10 days, we had a professional site showcasing our work. Three contact requests the first week. Before, everything was word of mouth.",
        },
        {
          name: "Julien M.",
          role: "Founder",
          company: "Syna Events — Toulouse",
          text: "The site was delivered on time, with exactly what we asked for. No surprises on the invoice, no unnecessary features. Concrete results.",
        },
        {
          name: "Sarah L.",
          role: "Director",
          company: "Jolananas — E-commerce",
          text: "Our Shopify store went from a generic template to a real brand experience. Customers tell us the site inspires trust. Sales followed.",
        },
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
          stack: ["React 19", "Node.js", "Vercel", "Turso DB", "Cloudinary", "GSAP"],
          metrics: [
            { value: "3 contacts", label: "first week" },
            { value: "10 days", label: "delivery time" },
            { value: "€0", label: "maintenance cost year 1" },
          ]
        },
        {
          id: "syna-events",
          slug: "syna-events",
          title: "SYNA EVENTS",
          sub: "Professional event website — Events, Toulouse",
          desc: "A Toulouse-based event agency needed a website matching the quality of their services. Result: a complete, responsive event website deployed in production — delivered on time, no surprises.",
          color: "#1A1A2E",
          stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
          metrics: [
            { value: "100%", label: "features delivered" },
            { value: "5 days", label: "delivery time" },
            { value: "Mobile-first", label: "responsive design" },
          ]
        },
        {
          id: "jolananas",
          slug: "jolananas",
          title: "JOLANANAS",
          sub: "Premium e-commerce storefront — French artisan fashion",
          desc: "A standard Shopify theme couldn't do the brand justice. Result: a custom Next.js storefront connected to Shopify via GraphQL — catalog, persistent cart, customer accounts, blog and full GDPR compliance.",
          color: "#1E293B",
          stack: ["Next.js", "TypeScript", "Shopify GraphQL", "Prisma", "PostgreSQL", "Framer Motion"],
          metrics: [
            { value: "GraphQL", label: "Shopify API" },
            { value: "< 2s", label: "load time" },
            { value: "100%", label: "custom-built" },
          ]
        },
        {
          id: "albi-rp",
          slug: "albi-rp",
          title: "ALBI RP™",
          sub: "Game + bot + site ecosystem — French Roblox RP",
          desc: "No serious RP server in the French Roblox ecosystem. Result: a complete ecosystem — Roblox game, real-time synced Discord bot, website and API — built from scratch, actively in production.",
          color: "#334155",
          stack: ["Lua/Luau", "TypeScript", "Discord.js", "Vercel", "Tailwind", "Zod"],
          metrics: [
            { value: "4 modules", label: "game + bot + site + API" },
            { value: "500+", label: "active players" },
            { value: "24/7", label: "Discord bot uptime" },
          ]
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
      gdpr: "Exercise your GDPR rights",
      termsOfService: "Terms of service",
      termsAndConditions: "Terms and conditions",
      accessibility: "Accessibility",
      explore: "Explore",
      architecture: "Architecture",
      legal: "Legal",
      resources: "Resources",
      training: "Training",
      aboutLink: "About",
      newsletterTitle: "Newsletter",
      newsletterDesc: "One article per week on AI, automation and digital visibility. Zero spam.",
      newsletterPlaceholder: "Your email",
      newsletterSuccess: "Subscribed! See you soon.",
      newsletterError: "Error. Try again or contact me directly.",
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
      auditCta: "Or get a personalized audit for EUR 47",
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
      cookieMessage: "This site uses analytics cookies (Google Analytics) to measure audience and improve experience. No personal data is shared for advertising purposes.",
      cookieAccept: "Accept",
      cookieDecline: "Decline",
      cookiePolicy: "Privacy policy",
    },
    claudeArchitect: {
      navLabel: "Claude",
      eyebrow: "Claude Certified Architect",
      titleBefore: "Ship Claude in production,",
      titleAccent: "not in demos.",
      description:
        "I've launched a dedicated micro-site for my Claude solutions architect practice. Audits, Claude Code implementations, training and a preparation guide for Anthropic's CCA-F certification. Take a look.",
      domains: [
        { label: "Agentic architecture & orchestration", weight: "27%" },
        { label: "Claude Code & CI/CD workflows", weight: "20%" },
        { label: "Prompt engineering & structured outputs", weight: "20%" },
        { label: "Tool design & MCP integration", weight: "18%" },
        { label: "Context management & reliability", weight: "15%" },
      ],
      ctaPrimary: "Visit claude-architect.fr",
      ctaSecondary: "Join the waitlist",
      footnote:
        "Anthropic launched this certification on March 12, 2026. I'm taking the exam on April 25.",
      closeLabel: "Close",
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
      searchPlaceholder: "Search articles...",
      noResults: "No articles match your search.",
      allCategories: "All categories",
      allCategoriesTitle: "Explore the blog by category",
      allCategoriesSubtitle: "All articles organised by topic: AI, automation, websites, conversion. Pick the category that matches your need.",
      articleCountOne: "1 article",
      articleCountOther: "{count} articles",
      categoryTitle: "Articles — {category}",
      backToBlog: "Back to blog",
      categoryEmpty: "No articles in this category yet.",
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
      teaserBadge: "Not ready to commit?",
      teaserDesc: "Get a personalized audit of your digital presence for just EUR 47. Detailed report delivered within 24h.",
      teaserCta: "Get my audit — EUR 47",
      blogBadge: "Go further",
      blogTitle: "Get a personalized audit of your digital presence",
      blogDesc: "5 axes analyzed, concrete recommendations, delivered within 24h. Only EUR 47.",
      blogCta: "Order my audit — EUR 47",
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
    legal: {
      mentionsLegales: {
        badge: "Legal Notice",
        title: "Legal Notice",
        lastUpdated: "April 3, 2026",
        sections: [
          {
            title: "Website publisher",
            html: `<p>The website <strong>aissabelkoussa.fr</strong> is published by:</p><p><strong>Aïssa BELKOUSSA</strong><br/>Sole proprietor (French micro-enterprise)<br/>SIREN: 937 690 592<br/>SIRET: 937 690 592 00012<br/>NAF code: 5911B<br/>Address: Albi, 81000 — Occitanie, France<br/>Email: <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p><p>VAT not applicable — article 293 B of the French General Tax Code.</p>`,
          },
          {
            title: "Publication director",
            html: `<p>The publication director is <strong>Aïssa BELKOUSSA</strong>, acting as publisher of the website.</p>`,
          },
          {
            title: "Hosting",
            html: `<p>The website is hosted by:</p><p><strong>Vercel Inc.</strong><br/>440 N Barranca Ave #4133<br/>Covina, CA 91723, United States<br/>Website: <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">vercel.com</a></p>`,
          },
          {
            title: "Domain name",
            html: `<p>The domain name <strong>aissabelkoussa.fr</strong> is registered with:</p><p><strong>OVHcloud</strong><br/>2 rue Kellermann, 59100 Roubaix, France<br/>RCS Lille Métropole 424 761 419<br/>Website: <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">ovhcloud.com</a></p>`,
          },
          {
            title: "Intellectual property",
            html: `<p>All content on the website (texts, images, source code, mockups, logos, animations, videos, architecture) is protected by intellectual property law and remains the exclusive property of Aïssa BELKOUSSA, unless otherwise stated.</p><p>Any reproduction, representation, modification, publication or adaptation of all or part of the website's elements, by any means or process, is prohibited without prior written authorization from Aïssa BELKOUSSA.</p><p>Any unauthorized use of the website or any of its elements will be considered as infringement and prosecuted in accordance with articles L.335-2 and following of the French Intellectual Property Code.</p>`,
          },
          {
            title: "Personal data",
            html: `<p>Personal data collected via the contact form is processed in accordance with the General Data Protection Regulation (GDPR). For more information, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p>`,
          },
          {
            title: "Cookies and trackers",
            html: `<p>The website uses cookies and trackers strictly necessary for its operation as well as anonymized analytics trackers (Vercel Analytics, internal beacon). No advertising, retargeting or profiling cookies are used.</p><p>Local storage (localStorage) is used to remember the user's language preference (French or English), strictly necessary for the operation of the site (art. 5.3 ePrivacy directive).</p><p>Fonts are loaded from Google Fonts. Links to third-party services (Calendly, WhatsApp, LinkedIn, GitHub, Telegram) are subject to the cookie policies of their respective publishers.</p><p>For more details, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p>`,
          },
          {
            title: "Liability",
            html: `<p>The publisher strives to provide information as accurate as possible on the website. However, the publisher cannot be held responsible for omissions, inaccuracies or failures in updating, whether caused by itself or by third-party partners who provide this information.</p><p>The publisher cannot be held responsible for direct or indirect damage caused to the user's equipment when accessing the website, resulting either from the use of equipment not meeting the required technical specifications, or from the appearance of a bug or incompatibility.</p>`,
          },
          {
            title: "Hypertext links",
            html: `<p>The website may contain hypertext links to other websites. The publisher exercises no control over the content of these third-party sites and disclaims any responsibility for their content or any damage that may result from their use.</p>`,
          },
          {
            title: "Applicable law",
            html: `<p>This legal notice is governed by French law. In the event of a dispute, the French courts shall have exclusive jurisdiction.</p>`,
          },
        ],
      },
      confidentialite: {
        badge: "Privacy",
        title: "Privacy Policy",
        lastUpdated: "April 3, 2026",
        sections: [
          {
            title: "Data controller",
            html: `<p>The controller of personal data processing is:</p><p><strong>Aïssa BELKOUSSA</strong><br/>Sole proprietor (French micro-enterprise)<br/>SIRET: 937 690 592 00012<br/>Address: Albi, 81000 — Occitanie, France<br/>Email: <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p>`,
          },
          {
            title: "Data collected",
            html: `<p>The following data may be collected when using the website:</p><p><strong>Via the contact form:</strong></p><ul><li>Full name</li><li>Email address</li><li>Selected type of need</li><li>Free-form message (optional)</li><li>Selected plan, if applicable</li><li>Navigation language (French or English)</li></ul><p><strong>Via site navigation (anonymized data):</strong></p><ul><li>Pages visited and navigation path</li><li>Referrer (origin page)</li><li>Screen width (resolution)</li><li>Browser language</li><li>Web performance metrics (Core Web Vitals) via Vercel Analytics</li></ul><p>This navigation data is collected anonymously, without personal identification, and is used exclusively to improve user experience and site performance.</p>`,
          },
          {
            title: "Processing purposes",
            html: `<p>The data collected is used for the following purposes:</p><ul><li>Responding to contact and quote requests (legal basis: pre-contractual measures, art. 6.1.b GDPR)</li><li>Sending an automatic confirmation email to the requester (legal basis: legitimate interest, art. 6.1.f GDPR)</li><li>Measuring audience and site performance anonymously (legal basis: legitimate interest, art. 6.1.f GDPR)</li></ul><p>The data is never used for commercial prospecting, profiling or resale to third parties.</p>`,
          },
          {
            title: "Cookies and trackers",
            html: `<p>The website uses a limited number of cookies and local storage technologies, strictly necessary for its operation and to improve user experience.</p><p><strong>Strictly necessary cookies (exempt from consent — art. 5.3 ePrivacy directive):</strong></p><ul><li><strong>Language preference</strong> (localStorage) — stores the language choice (French/English) to ensure navigation continuity. No personal data is concerned.</li></ul><p><strong>Anonymized analytics cookies (legitimate interest — art. 6.1.f GDPR):</strong></p><ul><li><strong>Vercel Analytics</strong> — anonymized audience measurement and performance metrics (Core Web Vitals). Vercel Analytics does not collect any personally identifiable information (no stored IP address, no fingerprinting, no cross-site tracking cookie). This data is used exclusively to optimize site performance. Provider: Vercel Inc., compliant with the EU-US Data Privacy Framework.</li><li><strong>Navigation beacon</strong> — internal measurement system recording pages visited, referrer, screen width and browser language. No personally identifiable information is collected. This beacon respects the browser's Do Not Track signal: if enabled, no data is sent.</li></ul><p><strong>Cookies set by third-party services when using external links:</strong></p><ul><li><strong>Calendly</strong> — when you click on the booking link, you are redirected to calendly.com which sets its own cookies (operation, session, preferences). Calendly's cookie policy applies on their domain: <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">calendly.com/privacy</a>.</li><li><strong>WhatsApp</strong> — the WhatsApp contact link redirects to wa.me / web.whatsapp.com, subject to Meta's privacy policy: <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">whatsapp.com/legal/privacy-policy</a>.</li></ul><p><strong>Fonts:</strong></p><ul><li><strong>Google Fonts</strong> — the Inter and Outfit fonts are loaded from Google's servers (fonts.googleapis.com / fonts.gstatic.com). Google may collect the visitor's IP address when loading fonts. No other data is transmitted. Privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">policies.google.com/privacy</a>.</li></ul><p><strong>Automatic acceptance.</strong> In accordance with article 5.3 of the ePrivacy directive and the guidelines of the CNIL (French Data Protection Authority), strictly necessary cookies and anonymized trackers that require no personal identification are enabled by default, without a consent banner. By continuing to browse this site, you accept the use of these technologies as described above. Similarly, by clicking on links to third-party services (Calendly, WhatsApp, LinkedIn, GitHub, Telegram), you accept the respective cookie and privacy policies of these services.</p><p>The site does not use any advertising cookies, retargeting tools, tracking pixels (Facebook Pixel, Google Ads, etc.) or profiling cookies.</p>`,
          },
          {
            title: "Client data processed in the context of services",
            html: `<p>In addition to the data collected via the website (described above), the service provider may need to access and process sensitive data belonging to the client in the context of service performance (website creation, automation, integration, maintenance). This data may include:</p><ul><li>Banking details and financial information (IBAN, account numbers)</li><li>Technical credentials and access (passwords, API keys, server access)</li><li>Client's customer data (customer files, contacts, histories)</li><li>Confidential business data (revenue, pricing, strategy)</li></ul><p>Processing of this data is governed by the service contract and the general terms and conditions of sale. The service provider undertakes to:</p><ul><li>Access the data only to the extent strictly necessary for the mission</li><li>Apply appropriate security measures (encryption, restricted access, strong authentication)</li><li>Never disclose confidential data to third parties</li><li>Delete or return all data and access at the end of the mission</li></ul><p><strong>The service provider is bound by an obligation of means regarding data protection and cannot be held responsible for leaks, losses or unauthorized access resulting from failures of the client's systems, third-party services, or cyberattacks beyond its direct control.</strong></p><p>For full details of responsibilities and obligations of each party, see the <a href="/cgv" class="text-site-accent hover:underline">general terms and conditions of sale</a>, section "Confidentiality and sensitive client data".</p>`,
          },
          {
            title: "Processors and recipients",
            html: `<p>Data is transmitted only to the following technical processors, strictly within the scope of their mission:</p><ul><li><strong>Vercel Inc.</strong> (website hosting and analytics) — compliant with the EU-US Data Privacy Framework (standard contractual clauses). Headquarters: Covina, CA 91723, United States.</li><li><strong>Resend</strong> (transactional email sending) — servers in the European Union (Ireland). Data transits through Resend for sending notification and confirmation emails, without durable storage.</li><li><strong>Render</strong> (backend API hosting) — host of the internal tracking system and contact API. Anonymized navigation data is stored in a hosted MongoDB database.</li><li><strong>Google LLC</strong> (fonts) — the Inter and Outfit fonts are served via Google Fonts. Only the visitor's IP address may be collected during loading.</li><li><strong>OVHcloud</strong> (domain name registrar) — 2 rue Kellermann, 59100 Roubaix, France.</li></ul><p>No data is sold, rented or transferred to a third party for commercial purposes.</p>`,
          },
          {
            title: "Transfers outside the European Union",
            html: `<p>Some processors are located in the United States. Data transfers to these providers are governed by:</p><ul><li>The <strong>EU-US Data Privacy Framework</strong> (European Commission adequacy decision of July 10, 2023) for Vercel Inc. and Google LLC</li><li><strong>Standard contractual clauses</strong> (SCC) adopted by the European Commission, where applicable</li></ul><p>These mechanisms guarantee a level of data protection equivalent to that of the GDPR.</p>`,
          },
          {
            title: "Retention period",
            html: `<ul><li><strong>Contact form data</strong>: retained in the data controller's email inbox for the duration necessary to process the request, then archived for a maximum of 3 years from the last contact, in accordance with CNIL recommendations.</li><li><strong>Anonymized navigation data</strong>: retained for a maximum of 25 months in accordance with CNIL recommendations.</li><li><strong>Language preference</strong> (localStorage): retained indefinitely in the user's browser. The user can delete it at any time via their browser settings.</li></ul>`,
          },
          {
            title: "Data security",
            html: `<p>Appropriate technical and organizational measures are implemented to protect personal data:</p><ul><li>Encryption of communications via HTTPS (SSL/TLS certificate)</li><li>Resend API key stored exclusively server-side (never exposed client-side)</li><li>Rate limiting on the contact form (3 requests per IP every 15 minutes)</li><li>Anti-spam protection via honeypot field</li><li>Validation and escaping of all data before processing</li><li>HTTP security headers: Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy</li><li>Respect for the Do Not Track signal for the internal tracking system</li></ul>`,
          },
          {
            title: "Your rights",
            html: `<p>In accordance with the GDPR (articles 15 to 22) and the French Data Protection Act, you have the following rights regarding your personal data:</p><ul><li><strong>Right of access</strong>: obtain confirmation that your data is being processed and obtain a copy</li><li><strong>Right of rectification</strong>: have inaccurate or incomplete data corrected</li><li><strong>Right to erasure</strong>: request the deletion of your data</li><li><strong>Right to restriction</strong>: request the suspension of processing</li><li><strong>Right to portability</strong>: receive your data in a structured and readable format</li><li><strong>Right to object</strong>: object to the processing of your data, including analytics tracking (you can enable the Do Not Track signal in your browser)</li></ul><p>To exercise these rights in practice, visit our dedicated <a href="/rgpd" class="text-site-accent hover:underline">Exercise your GDPR rights</a> page.</p><p>For any questions, contact: <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a>. A response will be provided within one month in accordance with article 12 of the GDPR.</p>`,
          },
          {
            title: "Complaint",
            html: `<p>If you believe that the processing of your personal data constitutes a violation of the GDPR, you have the right to lodge a complaint with the CNIL (French Data Protection Authority): <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">www.cnil.fr</a>.</p>`,
          },
          {
            title: "Modifications",
            html: `<p>This privacy policy may be modified at any time. Changes take effect upon publication on this page. The last update date is indicated at the top of this document. In case of substantial modification, a visible notice will be displayed on the site.</p>`,
          },
        ],
      },
      cgu: {
        badge: "Terms of Service",
        title: "Terms of Service",
        lastUpdated: "April 3, 2026",
        sections: [
          {
            title: "Purpose",
            html: `<p>These general terms of use (Terms of Service) define the terms of access and use of the website <strong>aissabelkoussa.fr</strong> (hereinafter "the Site"), published by Aïssa BELKOUSSA. Access to and use of the Site implies full and unreserved acceptance of these Terms.</p>`,
          },
          {
            title: "Access to the site",
            html: `<p>The Site is freely accessible to any user with Internet access. The publisher implements reasonable means to ensure continuous access to the Site, but cannot guarantee permanent availability.</p><p>Access to the Site may be interrupted at any time, without notice or compensation, in particular for maintenance, updates, security reasons or in case of force majeure.</p>`,
          },
          {
            title: "Cookies, trackers and third-party services",
            html: `<p>By accessing the Site and continuing your navigation, you accept the following conditions regarding cookies and third-party services:</p><p><strong>Services integrated into the Site:</strong></p><ul><li><strong>Vercel Analytics &amp; Web Vitals</strong> — anonymized audience measurement and performance metrics. These trackers are enabled by default as they do not collect any personally identifiable data and meet a legitimate interest in improving the site (art. 6.1.f GDPR).</li><li><strong>Internal tracking system</strong> — anonymized recording of pages visited for statistical analysis. This system respects the browser's Do Not Track signal.</li><li><strong>Google Fonts</strong> — loading of fonts (Inter, Outfit) from Google's servers. The visitor's IP address may be collected by Google during loading.</li><li><strong>Local storage</strong> (localStorage) — recording of language preference. Strictly necessary for operation (art. 5.3 ePrivacy directive).</li></ul><p><strong>Third-party services accessible via external links:</strong></p><ul><li><strong>Calendly</strong> — by clicking on the booking link, you are redirected to calendly.com. You then accept Calendly's terms of use and privacy policy, which sets its own cookies (session, operation, preferences).</li><li><strong>WhatsApp</strong> — by clicking on the WhatsApp contact link, you are redirected to wa.me / web.whatsapp.com. You then accept the privacy policy of Meta Platforms.</li><li><strong>LinkedIn, GitHub, Telegram</strong> — links to these platforms are provided for informational purposes. Each platform applies its own terms of use and cookie policy.</li></ul><p><strong>Automatic acceptance.</strong> The cookies and trackers described above are enabled by default in accordance with the exemptions provided by the ePrivacy directive (strictly necessary cookies) and on the basis of legitimate interest (anonymized analytics cookies without personal data). By continuing your navigation, you acknowledge having read these technologies and accept their use. For third-party services (Calendly, WhatsApp, etc.), acceptance of their cookies is effective at the time you click on the redirect link.</p><p>The Site does not use any advertising cookies, tracking pixels (Facebook Pixel, Google Ads, etc.), retargeting tools or profiling cookies.</p><p>For more details, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p>`,
          },
          {
            title: "Intellectual property",
            html: `<p>All elements composing the Site (texts, images, videos, source code, mockups, logos, animations, architecture, design) are protected by intellectual property law and remain the exclusive property of Aïssa BELKOUSSA, unless otherwise stated.</p><p>Any reproduction, representation, modification, distribution or exploitation of all or part of the Site's content, by any means whatsoever, without the prior written authorization of the publisher, is strictly prohibited and constitutes an infringement punishable by articles L.335-2 and following of the French Intellectual Property Code.</p>`,
          },
          {
            title: "Use of the contact form",
            html: `<p>The Site provides a contact form allowing users to send inquiries or quote requests. By using this form, the user undertakes to:</p><ul><li>Provide accurate, complete and up-to-date information</li><li>Not use the form for abusive, fraudulent or illegal purposes</li><li>Not transmit abusive, defamatory, discriminatory content or content contrary to public order</li><li>Not attempt to disrupt the functioning of the Site (spam, injection, scraping, etc.)</li></ul><p>The publisher reserves the right not to respond to any request that it considers abusive or contrary to these Terms.</p>`,
          },
          {
            title: "Use of the booking service",
            html: `<p>The Site offers a link to the Calendly platform to book a free 30-minute discovery call. By using this service:</p><ul><li>You are redirected to calendly.com, a third-party service not controlled by the publisher</li><li>Data entered on Calendly (name, email, chosen slot) is subject to Calendly Inc.'s terms of use and privacy policy</li><li>The publisher receives only the booking information (name, email, date/time of the slot) to organize the meeting</li><li>The meeting is free and non-binding</li></ul>`,
          },
          {
            title: "Personal data",
            html: `<p>Personal data collected on the Site is processed in accordance with the General Data Protection Regulation (GDPR). For more information, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p><p>As part of service provision, the provider may handle sensitive client data (banking details, credentials, business data). Processing of this data is governed by the <a href="/cgv" class="text-site-accent hover:underline">general terms and conditions of sale</a>, which specify the commitments of each party and the limitations of liability regarding data protection.</p>`,
          },
          {
            title: "Hypertext links",
            html: `<p>The Site contains links to third-party sites and services, including:</p><ul><li>LinkedIn (professional profile)</li><li>GitHub (open source projects)</li><li>Telegram (community)</li><li>Calendly (booking)</li><li>WhatsApp (messaging)</li></ul><p>These links are provided for informational purposes. The publisher exercises no control over these sites and disclaims any responsibility for their content, availability, terms of use, cookie policies or damages that may result from their use.</p>`,
          },
          {
            title: "Limitation of liability",
            html: `<p>The publisher strives to provide reliable and up-to-date information on the Site, but does not guarantee the accuracy, completeness or exhaustiveness of the information published.</p><p>The publisher may under no circumstances be held responsible for:</p><ul><li>Direct or indirect damages resulting from the use or inability to use the Site</li><li>Interruptions or malfunctions of the Site, whatever the cause</li><li>The use made by third parties of the information present on the Site</li><li>Viruses or harmful elements that could infect the user's computer equipment</li><li>The content, availability or operation of third-party services accessible via the Site's links (Calendly, WhatsApp, LinkedIn, etc.)</li></ul>`,
          },
          {
            title: "Modification of Terms",
            html: `<p>The publisher reserves the right to modify these Terms at any time. Changes take effect upon publication on this page. The user is invited to consult this page regularly. The last update date is indicated at the top of this document.</p>`,
          },
          {
            title: "Applicable law and jurisdiction",
            html: `<p>These Terms are governed by French law. In the event of a dispute relating to the interpretation or execution of these terms, and in the absence of amicable resolution, the French courts shall have exclusive jurisdiction.</p>`,
          },
        ],
      },
      cgv: {
        badge: "Terms of Sale",
        title: "General Terms and Conditions of Sale",
        lastUpdated: "April 3, 2026",
        sections: [
          {
            title: "Payment terms",
            html: `<p>Payment upon receipt of invoice, by check or bank transfer. When the quote provides for a deposit, it is payable upon order. The order is only considered firm and definitive after the deposit has been received. The balance is due upon the site going live or upon delivery of the agreed deliverables. In the event of cancellation of the order at the client's initiative after payment of the deposit, the deposit remains acquired by the service provider as flat-rate compensation, unless otherwise agreed in writing between the parties.</p>`,
          },
          {
            title: "Late payment penalties",
            html: `<p>In the event of late payment, penalties will be applied automatically, without prior formal notice, at a rate of 3 times the current legal interest rate, as well as a flat-rate recovery fee of EUR 40 (art. L441-10 of the French Commercial Code).</p>`,
          },
          {
            title: "VAT",
            html: `<p>VAT not applicable, article 293 B of the French General Tax Code. Total excl. VAT = Total incl. VAT.</p>`,
          },
          {
            title: "Validity of proposals",
            html: `<p>Unless otherwise stated, any quote or commercial proposal is valid for 30 days from its date of issue. After this period, rates and conditions may be revised. When the quote provides for staggered payment (in 2 or 3 installments), the due dates and amounts are specified in the quote and form an integral part of the contractual conditions.</p>`,
          },
          {
            title: "Client obligations",
            html: `<p>The client undertakes to provide the service provider with all elements necessary for the realization of the project (content, texts, visuals, technical access, brief, graphic charter, etc.) within a reasonable time and at the latest within 10 working days following the service provider's request.</p><p>The client undertakes to validate intermediate stages (mockups, prototypes, partial deliverables) within 5 working days of their availability. After this period and without the client's feedback, the submitted deliverables are deemed validated.</p><p>Any delay or failure to provide elements by the client results in an equivalent shift in the schedule, without the service provider's liability being engaged. In case of prolonged client inactivity (absence of response for more than 30 calendar days despite two written reminders), the service provider reserves the right to consider the project as abandoned. Amounts paid remain acquired and any outstanding balance becomes immediately due.</p>`,
          },
          {
            title: "Intellectual property and license of use",
            html: `<p><strong>Ownership.</strong> Intellectual property rights on all deliverables (source code, mockups, algorithms, configurations, visuals, original content) remain the exclusive property of the service provider.</p><p><strong>License of use.</strong> After full payment of the project price, the client benefits from a license of use:</p><ul><li><strong>Non-exclusive</strong>: the service provider retains the right to freely reuse all or part of the deliverables (code, design, components, methods, architecture) for any other project or client, without restriction;</li><li>Unlimited in time;</li><li>Covering the exploitation of the project as defined in the quote;</li><li>Transferable in the context of a transfer or transmission of the business.</li></ul><p>The license does not cover: resale, sub-licensing to third parties, modification of the source code outside the scope defined in the quote, or extraction of software bricks for use independent of the delivered project.</p><p><strong>Effect of stopping maintenance.</strong> In the event of termination of the maintenance subscription: (a) the site/system remains online and functional; (b) the license of use remains valid without time limitation; (c) the client retains access to the delivered source code; (d) the service provider is no longer bound to updates, bug fixes, monitoring or support; (e) hosting on the service provider's infrastructure is maintained for 90 days after the end of the subscription (see Hosting section).</p><p><strong>Code delivery.</strong> Upon written request, the service provider undertakes to deliver to the client all the source code, technical documentation and access necessary for migration within 15 working days.</p><p>Before full payment, the service provider remains the full and entire owner of the creations and reserves the right to suspend the service in case of non-payment.</p><p>The service provider reserves the right to make minor technical or aesthetic adjustments to the project, without prior agreement from the client, when these adjustments are necessary for reasons of security, performance, compatibility or continuous service improvement.</p><p><strong>Collection of usage data.</strong> The service provider reserves the right to collect anonymized usage data from the operation of delivered systems (traffic statistics, technical performance, browsing behaviors, conversion rates, interaction data). This data, devoid of any personally identifiable information, is used for purposes of continuous service improvement, performance optimization, research and development, and commercial benchmarking. The client is informed of this collection and may object by written request. This collection complies with the GDPR and the privacy policy accessible on the service provider's website.</p><p>Unless expressly opposed by the client, the service provider is authorized to mention the client's name and logo as well as to present the completed project as commercial references (portfolio, website, social networks, presentation documents). The service provider is also authorized to communicate, for commercial purposes, on the results obtained and performance metrics of the project, in anonymous or nominative form unless opposed by the client, while respecting the confidentiality of sensitive data.</p>`,
          },
          {
            title: "Delivery times",
            html: `<p>Delivery times are estimated in the quote and constitute a commitment by the service provider, subject to the client's compliance with their own obligations (provision of content, validations within deadlines, technical access). Any delay attributable to the client shifts the schedule accordingly.</p><p>In case of delay exclusively attributable to the service provider exceeding 10 working days compared to the agreed schedule, a discount of 5% of the total service amount will be applied per additional 10 working days of delay, up to a limit of 20% of the total amount.</p><p>In the event of force majeure within the meaning of French law, the service provider's obligations may be suspended without its liability being engaged.</p>`,
          },
          {
            title: "Acceptance",
            html: `<p>Upon project delivery (acceptance), the client has 10 calendar days to formulate reservations in writing. After this period, the deliverables will be deemed compliant and accepted. In case of founded reservations consistent with the validated brief, the service provider undertakes to make the necessary corrections at no additional cost within a reasonable time.</p>`,
          },
          {
            title: "Included launch period",
            html: `<p>The project price includes a launch period of three (3) months from the date of the acceptance report or, in the absence of reservations formulated within 10 days, from the date of project availability.</p><p>During this period, the client benefits from maintenance services corresponding to the subscribed plan (Essential or Premium), without additional billing. This launch period is an integral part of the project service. It is neither a trial period nor a commitment to subscribe to the maintenance plan.</p><p>At the end of the launch period, the client may: (a) continue the maintenance subscription at the current rate, without duration commitment — billing starts automatically unless otherwise notified by the client; (b) not continue, in which case maintenance services cease automatically without formality. The service provider informs the client by email fifteen (15) days before the end of the launch period.</p><p>The launch period applies only to the Accélérateur and Partenaire plans. The Autonome plan does not include any launch period or maintenance service.</p>`,
          },
          {
            title: "Liability",
            html: `<p>The service provider's liability, for all causes combined, is strictly limited to the amount excl. VAT actually paid by the client for the service concerned.</p><p>In no event may the service provider be held responsible for indirect damages, including: loss of revenue, loss of data, loss of clientele, damage to image or reputation, loss of earnings, commercial or financial damage of any kind, including those resulting from a leak, loss or unauthorized access to client data (see "Confidentiality and sensitive client data" section).</p><p>The service provider is bound by an obligation of means. It implements reasonable security measures in accordance with industry best practices, but does not guarantee the inviolability of the client's or third parties' systems, networks or services.</p>`,
          },
          {
            title: "Contract termination",
            html: `<p><strong>Termination for breach.</strong> Each party may terminate the contract in the event of serious breach by the other party of its obligations, after formal notice remaining ineffective for 15 calendar days sent by registered letter with acknowledgment of receipt or by email with read confirmation.</p><p><strong>Termination of the project at the client's initiative.</strong> In the event of termination at the client's initiative outside of a breach by the service provider, amounts paid remain acquired by the service provider in proportion to the work performed. The service provider will provide a detailed progress report and deliver the deliverables produced up to the date of termination.</p><p><strong>Termination of the project at the service provider's initiative.</strong> In the event of termination at the service provider's initiative outside of a breach by the client, the service provider will refund amounts corresponding to services not yet performed.</p><p><strong>Termination of the maintenance subscription.</strong> Termination conditions specific to the maintenance subscription are detailed in the "Maintenance and evolution subscriptions" section.</p>`,
          },
          {
            title: "Hosting and infrastructure",
            html: `<p>Unless otherwise stated in the quote, the project is hosted on the technical infrastructure managed by the service provider (servers, cloud platforms, domain names). Hosting fees are included in the maintenance subscription if applicable, or billed separately according to the terms specified in the quote.</p><p>In the absence of an active subscription and when the project is hosted on the service provider's infrastructure, the latter undertakes to maintain hosting for 90 days following the end of the subscription or project delivery. After this period, the service provider may suspend hosting after 30 days' prior notice to the client. The service provider undertakes to provide the client, upon request, with a copy of the data and files necessary for migrating the project to another host.</p><p>When the project is hosted on the client's infrastructure, the service provider is not responsible for the availability, security or performance of the hosting.</p>`,
          },
          {
            title: "Maintenance and evolution subscriptions",
            html: `<p><strong>Subscription and duration.</strong> The maintenance subscription takes effect automatically at the end of the three (3) month launch period, i.e. on the 91st day following the project acceptance date. The service provider sends a monthly invoice to the client, payable by bank transfer or SEPA direct debit within fifteen (15) days following the date of issue. The subscription is tacitly renewable each month.</p><p><strong>Service levels (SLA).</strong></p><p><em>Essential plan (EUR 490/month):</em> 24/7 monitoring (target availability: 99.5%); critical bug fixes: 48 working hours; minor bug fixes: 10 working days; security updates: applied within 72h; 1h of monthly support included; monthly performance report.</p><p><em>Premium plan (EUR 1,900/month):</em> 24/7 monitoring (target availability: 99.9%); critical bug fixes: 24 working hours; minor bug fixes: 5 working days; security updates: applied within 24h; up to 10h/month of evolutions (non-transferable); priority support 24h; monthly strategic follow-up meeting; monthly performance report.</p><p>Service levels apply to working days (Monday-Friday, excluding French public holidays), except for automated monitoring which operates continuously. Any service exceeding the subscription scope will be subject to an additional quote.</p><p><strong>Termination by the client.</strong> The client may terminate their subscription at any time, by email with acknowledgment of receipt or registered letter, with thirty (30) days' notice before the next monthly due date. Termination takes effect at the end of the calendar month following receipt of the notification.</p><p><strong>Termination by the service provider.</strong> The service provider may terminate the subscription with sixty (60) days' notice, in particular in the event of cessation of activity or technical impossibility of maintaining the service.</p><p><strong>Termination for non-payment.</strong> In case of non-payment of an installment despite a reminder that has remained ineffective for fifteen (15) days, the service provider may suspend maintenance services and terminate the subscription automatically.</p><p><strong>Work in progress.</strong> In the event of termination, maintenance work in progress at the time of notification is completed. No new services will be undertaken.</p><p><strong>Reversibility clause.</strong> Within thirty (30) days following the effective date of termination, the service provider undertakes to: (a) deliver to the client all up-to-date source code; (b) provide technical documentation and necessary access (hosting, DNS, third-party accounts, database); (c) ensure reasonable knowledge transfer (1 hour of videoconference) to facilitate takeover by another service provider; (d) delete client data from its systems within 60 days, unless legally required to retain it.</p><p><strong>Annual commitment.</strong> The client may opt for an annual commitment benefiting from a 25% discount (equivalent to 3 months free out of 12). The annual commitment is billed in one payment on the subscription date. In case of early termination of an annual commitment, the remaining monthly payments are not refunded.</p><p><strong>Price revision.</strong> Subscription prices are revisable once a year, on the contract anniversary date, within the limit of the Syntec index or 5% (whichever is lower). The service provider notifies any price revision sixty (60) days before it takes effect. In case of refusal, the client may terminate without penalty within 30 days following notification.</p>`,
          },
          {
            title: "Personal data (GDPR)",
            html: `<p>As part of the mission, personal data (name, telephone, email, project-related information, etc.) may be collected via the site, online forms, quote requests, as well as by any other means of communication used with the service provider (email, telephone, messaging, etc.) on behalf of the client.</p><p>The client is responsible for compliance with applicable regulations (in particular the GDPR) vis-à-vis its own clients. The service provider acts as a technical processor and undertakes to implement appropriate security measures for the management of this data.</p><p>For more details, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p>`,
          },
          {
            title: "Confidentiality and sensitive client data",
            html: `<p>In the course of performing the services (website creation, automation, systems integration, maintenance), the service provider may be required to access, handle or process sensitive data belonging to the client or its own clients, in particular:</p><ul><li>Banking details and financial information (IBAN, account numbers)</li><li>Technical credentials and access (passwords, API keys, server access, administration panels)</li><li>Client's customer data (customer files, contacts, order history, invoices)</li><li>Confidential business data (revenue, margins, commercial strategy, pricing)</li><li>Any other document or information communicated by the client in the context of the mission</li></ul><p><strong>Service provider commitments (obligation of means):</strong></p><ul><li>Implement reasonable security measures in accordance with industry best practices (encryption, restricted access, strong authentication)</li><li>Access client data only to the extent strictly necessary for the performance of the service</li><li>Not disclose any confidential data to third parties, except legal obligation or written authorization from the client</li><li>Delete or return all client data, access and credentials at the end of the mission or on request</li><li>Report to the client any security breach or incident detected as soon as possible</li></ul><p><strong>Limitation of liability regarding data.</strong> The service provider undertakes an <strong>obligation of means</strong> regarding data protection, and not an obligation of result. In no case may the service provider be held responsible for:</p><ul><li>Leaks, losses, alterations or unauthorized access to data resulting from a failure of the infrastructure, systems or services of the client or third-party providers chosen by the client</li><li>Security incidents caused by cyberattacks (hacking, phishing, ransomware, social engineering) targeting the client's systems, third-party services or the technical environment outside the direct control of the service provider</li><li>Data loss related to the absence of backups made by the client on its own systems</li><li>The client's use of weak passwords, sharing credentials through unsecured channels, or non-compliance with the security recommendations made by the service provider</li><li>Consequences related to the voluntary transmission by the client of sensitive data (banking details, credentials, etc.) via unencrypted or unsecured channels (unencrypted email, mainstream instant messaging, etc.)</li><li>Indirect or consequential damages such as loss of clientele, damage to reputation, loss of earnings or commercial damage resulting from a data leak</li></ul><p><strong>Client obligations:</strong></p><ul><li>Make a complete backup of its data and systems before communicating any access to the service provider</li><li>Transmit credentials and sensitive data exclusively through secure channels (shared password manager, encrypted transfer, dedicated secure space)</li><li>Inform the service provider of the sensitive nature of the data to which it grants access, and of any specific applicable regulations (PCI-DSS, health data, etc.)</li><li>Revoke access granted to the service provider at the end of the mission or as soon as it is no longer necessary</li><li>Ensure regulatory compliance (GDPR, CNIL) of the processing of personal data of its own clients</li></ul><p>This confidentiality clause survives the end of the contract for a period of two (2) years.</p>`,
          },
          {
            title: "Mediation and disputes",
            html: `<p>In the event of a dispute relating to the execution or interpretation of these terms, the parties undertake to seek an amicable solution before any legal action. Failing an amicable agreement within 30 days, the dispute may be submitted to a consumer mediator in accordance with articles L611-1 and following of the French Consumer Code.</p><p>Failing resolution by mediation, the dispute will be brought before the competent courts of the service provider's registered office (Tribunal judiciaire d'Albi), notwithstanding plurality of defendants or warranty claim.</p><p>These terms are governed by French law.</p>`,
          },
          {
            title: "Right of withdrawal",
            html: `<p>In accordance with article L221-28 of the French Consumer Code, the right of withdrawal cannot be exercised for contracts for the supply of digital content not provided on a material medium whose execution has begun with the consumer's prior express agreement and express waiver of their right of withdrawal.</p><p>The client acknowledges and accepts that the execution of the service begins upon signing the quote and payment of the deposit, and expressly waives their right of withdrawal from that moment.</p>`,
          },
          {
            title: "Non-solicitation",
            html: `<p>During the term of the contract and the twelve (12) months following its end, the client undertakes not to solicit, directly or indirectly, the subcontractors, service providers or collaborators introduced by the service provider in the context of the mission, except with prior written agreement. This clause does not prevent the client's right to freely contract with any service provider of its choice for needs unrelated to the mission.</p>`,
          },
          {
            title: "Acceptance of terms",
            html: `<p>Any contractual document (quote, contract, purchase order, commercial proposal, amendment, mission letter, and any other document issued by the service provider) signed with the mention "Bon pour accord" or "Lu et approuvé" constitutes a firm commitment and implies full and unreserved acceptance of these general terms and conditions of sale.</p>`,
          },
        ],
      },
      accessibilite: {
        badge: "Accessibility",
        title: "Accessibility Statement",
        lastUpdated: "April 10, 2026",
        sections: [
          {
            title: "Commitment",
            html: `<p><strong>Aïssa BELKOUSSA</strong> is committed to making the <strong>aissabelkoussa.fr</strong> website accessible in accordance with article 47 of French law no. 2005-102 of February 11, 2005.</p><p>This accessibility statement applies to the <strong>www.aissabelkoussa.fr</strong> website.</p>`,
          },
          {
            title: "Target standard and compliance status",
            html: `<p><strong>Target standard:</strong> WCAG 2.1 level AA (Web Content Accessibility Guidelines).</p><p><strong>Compliance status:</strong> partially compliant. The site has not yet undergone a complete compliance audit. The measures described below are implemented in good faith to improve accessibility.</p>`,
          },
          {
            title: "Non-accessible content",
            html: `<p>The following content is not yet fully accessible:</p><ul><li><strong>Framer Motion animations:</strong> certain transition and entrance animations may pose difficulties for users sensitive to motion, despite respecting <code>prefers-reduced-motion</code> in GSAP animations.</li><li><strong>Preloader:</strong> the initial loading screen does not have a text alternative for screen readers. Users of assistive technologies may not be informed of the loading state.</li><li><strong>Color contrast:</strong> some text using the <code>text-site-text-light</code> class may not reach the minimum contrast ratio of 4.5:1 required by level AA, particularly on light backgrounds.</li></ul>`,
          },
          {
            title: "Measures taken",
            html: `<p>The following measures are in place to improve the accessibility of the site:</p><ul><li><strong>Skip link:</strong> a "Skip to content" link allows direct access to the main content without going through the navigation.</li><li><strong>Semantic HTML:</strong> systematic use of <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;nav&gt;</code> tags and hierarchical heading levels.</li><li><strong>Alternative text:</strong> images have a descriptive <code>alt</code> attribute. Decorative elements are marked <code>aria-hidden="true"</code>.</li><li><strong>Visible focus:</strong> interactive elements (links, buttons, form fields) have a visible focus indicator.</li><li><strong>Reduced motion:</strong> GSAP animations respect the <code>prefers-reduced-motion</code> user preference and are disabled or simplified when this option is enabled.</li><li><strong>Keyboard navigation:</strong> the entire site is navigable by keyboard.</li></ul>`,
          },
          {
            title: "Technologies used",
            html: `<ul><li>HTML5</li><li>CSS3 (Tailwind CSS)</li><li>JavaScript / TypeScript</li><li>React (Next.js)</li><li>GSAP (animations)</li><li>Framer Motion (transitions)</li></ul>`,
          },
          {
            title: "Feedback and contact",
            html: `<p>If you encounter an accessibility defect that prevents you from accessing content or functionality of the site, you can contact us:</p><p><strong>Email:</strong> <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></p><p>We undertake to respond within 7 working days and to find a solution within a reasonable time.</p>`,
          },
          {
            title: "Remedies",
            html: `<p>If you find an accessibility defect and do not receive a satisfactory response, you can:</p><ul><li>Write a message to the <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">Défenseur des droits</a> (French Rights Defender)</li><li>Contact the regional delegate of the Défenseur des droits in your area</li><li>Send a letter by post (free): Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07</li></ul>`,
          },
          {
            title: "Date of the statement",
            html: `<p>This statement was established on <strong>April 10, 2026</strong>.</p>`,
          },
        ],
      },
      rgpd: {
        badge: "GDPR",
        title: "Exercise your GDPR rights",
        lastUpdated: "April 11, 2026",
        intro: {
          title: "What is this page for?",
          html: `<p>This page allows you to concretely exercise your rights over the personal data we process. To understand <strong>what data</strong> is collected, <strong>why</strong> and <strong>for how long</strong> it is kept, see the <a href="/confidentialite" class="text-site-accent hover:underline">privacy policy</a>.</p><p>In accordance with articles 15 to 22 of the <strong>General Data Protection Regulation (GDPR)</strong> and the French Data Protection Act of January 6, 1978 as amended, you have several rights over your personal data, exercisable <strong>free of charge</strong> and at any time.</p>`,
        },
        rightsSectionTitle: "Your rights, in one click",
        rightsSectionIntro: "Each button below opens your mail client with a pre-filled request. You only need to complete the fields in brackets and send.",
        ctaButton: "Exercise this right",
        rights: [
          {
            code: "acces",
            title: "Right of access",
            article: "art. 15 GDPR",
            description: "Obtain confirmation that your data is being processed, and a copy of all data concerning you (purposes, recipients, retention period).",
            subject: "Request for access to my data (art. 15 GDPR)",
            body: "Hello,\n\nUnder article 15 of the GDPR, I wish to exercise my right of access and obtain:\n- Confirmation that data concerning me is being processed\n- A copy of all this data\n- The purposes, categories of data, recipients and retention period\n\nMy identifiers (email used on the site, name):\n[to complete]\n\nBest regards,",
          },
          {
            code: "rectification",
            title: "Right of rectification",
            article: "art. 16 GDPR",
            description: "Correct inaccurate data or complete incomplete data concerning you.",
            subject: "Request for rectification of my data (art. 16 GDPR)",
            body: "Hello,\n\nUnder article 16 of the GDPR, I wish to rectify the following data concerning me:\n\nData to be corrected: [to complete]\nCurrent value: [to complete]\nCorrect value: [to complete]\n\nMy identifiers (email used on the site):\n[to complete]\n\nBest regards,",
          },
          {
            code: "effacement",
            title: "Right to erasure (\"right to be forgotten\")",
            article: "art. 17 GDPR",
            description: "Obtain the deletion of your data, subject to legal retention obligations (accounting, invoicing, etc.).",
            subject: "Request for erasure of my data (art. 17 GDPR)",
            body: "Hello,\n\nUnder article 17 of the GDPR, I wish to exercise my right to erasure and request the deletion of all data concerning me, subject to legal retention obligations.\n\nMy identifiers (email used on the site, name):\n[to complete]\n\nBest regards,",
          },
          {
            code: "limitation",
            title: "Right to restriction of processing",
            article: "art. 18 GDPR",
            description: "Temporarily freeze the processing of your data (for example in case of contestation of its accuracy).",
            subject: "Request for restriction of processing (art. 18 GDPR)",
            body: "Hello,\n\nUnder article 18 of the GDPR, I wish to obtain the restriction of processing of data concerning me.\n\nReason:\n[to complete]\n\nMy identifiers (email used on the site):\n[to complete]\n\nBest regards,",
          },
          {
            code: "portabilite",
            title: "Right to portability",
            article: "art. 20 GDPR",
            description: "Receive your data in a structured, commonly used and machine-readable format (JSON, CSV), to transmit it to another data controller.",
            subject: "Request for portability of my data (art. 20 GDPR)",
            body: "Hello,\n\nUnder article 20 of the GDPR, I wish to exercise my right to portability and receive all data concerning me in a structured and machine-readable format (JSON or CSV).\n\nMy identifiers (email used on the site):\n[to complete]\n\nBest regards,",
          },
          {
            code: "opposition",
            title: "Right to object",
            article: "art. 21 GDPR",
            description: "Object, at any time and for reasons relating to your particular situation, to the processing of your data based on legitimate interest or for prospecting purposes.",
            subject: "Objection to processing (art. 21 GDPR)",
            body: "Hello,\n\nUnder article 21 of the GDPR, I object to the processing of data concerning me.\n\nReason (if processing based on legitimate interest):\n[to complete]\n\nMy identifiers (email used on the site):\n[to complete]\n\nBest regards,",
          },
          {
            code: "directives",
            title: "Post-mortem directives",
            article: "art. 85 French Data Protection Act",
            description: "Define directives concerning the retention, deletion and communication of your data after your death.",
            subject: "Post-mortem directives (art. 85 French Data Protection Act)",
            body: "Hello,\n\nIn accordance with article 85 of the French Data Protection Act, I wish to define the following directives concerning my data after my death:\n\n[to complete]\n\nMy identifiers (email used on the site):\n[to complete]\n\nBest regards,",
          },
        ],
        alternativeSection: {
          title: "How to exercise your rights otherwise",
          html: `<p>If you prefer not to use the buttons above, you can exercise your rights by one of the following means:</p><ul><li>By <strong>email</strong> to <a href="mailto:contact@aissabelkoussa.fr" class="text-site-accent hover:underline">contact@aissabelkoussa.fr</a></li><li>Via the <a href="/contact" class="text-site-accent hover:underline">contact form</a>, specifying the subject "GDPR request"</li><li>By <strong>postal mail</strong>: Aïssa BELKOUSSA, Albi 81000, France</li></ul><p>For access, erasure and portability requests, please specify the <strong>email address</strong> you used on the site to allow identification of the data concerning you.</p>`,
        },
        identitySection: {
          title: "Identity verification",
          html: `<p>In principle, no proof of identity is required: the email address used for the request is considered sufficient when it corresponds to the one registered in our processing.</p><p>In case of <strong>reasonable doubt</strong> about your identity (different email address, unusual request), we may ask you, in accordance with article 12.6 of the GDPR, for additional proof of identity. This proof will be deleted as soon as the request has been processed.</p>`,
        },
        delaySection: {
          title: "Response time",
          html: `<p>In accordance with article 12.3 of the GDPR, we undertake to respond to you <strong>within a maximum of one month</strong> from the receipt of your request.</p><p>This period may be extended by two additional months if the request is particularly complex or if we receive a large number of requests. In this case, we will inform you of this extension and its reasons within one month of receiving your request.</p><p>The exercise of your rights is <strong>free of charge</strong>. However, in case of manifestly unfounded or excessive requests (in particular due to their repetitive nature), we reserve the right to demand payment of reasonable fees or to refuse to act, in accordance with article 12.5 of the GDPR.</p>`,
        },
        limitsSection: {
          title: "Limits to your rights",
          html: `<p>Some data may be retained beyond your erasure request when the law requires it, in particular:</p><ul><li><strong>Invoices</strong> and accounting documents (legal retention of 10 years — art. L123-22 French Commercial Code)</li><li>Data necessary for the exercise or defense of legal claims</li><li>Data whose retention is required by a legal or regulatory obligation</li></ul><p>In these cases, the data concerned will be <strong>blocked</strong> (restricted access) rather than deleted, and will only be used for the legal purposes that impose their retention.</p>`,
        },
        cnilSection: {
          title: "Complaint to the CNIL",
          html: `<p>If you believe, after contacting us, that your rights over your data are not being respected, you have the right to lodge a <strong>complaint</strong> with the Commission Nationale de l'Informatique et des Libertés (CNIL, French Data Protection Authority), the French supervisory authority for personal data protection.</p><p><strong>CNIL</strong><br/>3 Place de Fontenoy — TSA 80715<br/>75334 Paris Cedex 07<br/>Phone: +33 1 53 73 22 22<br/><a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" class="text-site-accent hover:underline">www.cnil.fr/fr/plaintes →</a></p><p>However, we invite you to contact us first: most requests can be processed quickly and directly.</p>`,
        },
      },
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
