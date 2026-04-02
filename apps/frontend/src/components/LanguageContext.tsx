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
  };
  offers: {
    title: string;
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
  systems: {
    title: string;
    intro: string;
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
    legalNotice: string;
    privacyPolicy: string;
    termsOfService: string;
    termsAndConditions: string;
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
    };
    cta: { next: string; prev: string; submit: string };
    success: { title: string; message: string };
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
    },
    services: {
      badge: "Offres & Résultats",
      title: "Votre système digital.\nConçu, livré, opérationnel.",
      subtitle: "Trois formats clairs. Un seul objectif : un système qui tourne dès la livraison. Premier échange gratuit, sans engagement.",
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
          name: "Autonome",
          tag: "Projet seul",
          description: "Votre système livré clé en main. Vous gérez la suite — idéal si vous avez une équipe technique en interne.",
          price: "3 900 €",
          priceNote: "Paiement unique. Aucune maintenance incluse.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "5 à 10 jours ouvrés",
          features: [
            "1 système livré (site, automation ou dashboard)",
            "Brief stratégique + maquette validée",
            "Licence d'utilisation exclusive",
            "Déploiement en production",
            "Documentation technique renforcée",
            "Formation autonomie (2h)",
          ],
          excluded: [
            "Aucune maintenance post-livraison",
            "Aucune mise à jour de sécurité",
            "Aucun monitoring",
            "Aucun support",
          ],
        },
        {
          name: "Accélérateur",
          tag: "Projet + maintenance",
          description: "Votre système livré et maintenu. 3 mois de maintenance offerts — vous ne touchez à rien.",
          price: "2 900 €",
          priceNote: "Puis 490 €/mois après les 3 mois offerts. Sans engagement.",
          monthlyPrice: "490 €",
          monthlyNote: "3 mois offerts (valeur 1 470 €)",
          duration: "5 à 10 jours ouvrés",
          features: [
            "1 système livré clé en main (site, automation ou dashboard)",
            "Brief stratégique + maquette validée avant dev",
            "Licence d'utilisation exclusive",
            "Déploiement en production inclus",
            "3 mois de monitoring + support offerts",
            "Corrections de bugs sous 48h",
            "Mises à jour de sécurité continues",
            "Rapport mensuel de performance",
          ],
          excluded: [],
        },
        {
          name: "Partenaire",
          tag: "Système + évolution continue",
          description: "Votre infrastructure complète — site, IA, données — avec un partenaire technique dédié qui fait évoluer votre système.",
          price: "6 900 €",
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
      ],
      ecosystemCta: {
        text: "Besoin d'une architecture sur mesure ? Le plan Écosystème s'adapte à vos ambitions — de 2 à 6 mois, CTO externalisé.",
        button: "Échanger 30 min",
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
      title: "Vous savez que vous devriez automatiser.\nVous ne savez pas par où commencer.",
      subtitle: "Je transforme vos intuitions système en architectures digitales concrètes, cohérentes et fiables — de l'idée floue au système qui tourne en arrière-plan.",
      ctaPrimary: "Initier un projet",
      ctaSecondary: "Voir les systèmes",
    },
    offers: {
      title: "Ce que je construis pour vous",
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
    systems: {
      title: "Systèmes construits, pas promis",
      intro: "Ce n'est pas ce que je pourrais faire. C'est ce que j'ai fait.",
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
      legalNotice: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions générales d'utilisation",
      termsAndConditions: "Conditions générales de vente",
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
            { id: "design", label: "Design & Expériences", template: "Je souhaite refondre mon interface avec une approche systémique et immersive. Mon objectif est de..." },
            { id: "app", label: "Apps Large Scale", template: "J'ai besoin de construire une application SaaS robuste et scalable capable de gérer..." },
            { id: "chatbot", label: "Chatbots IA", template: "Je cherche à intégrer un agent conversationnel intelligent pour automatiser..." },
            { id: "phone", label: "IA Téléphonique", template: "Je souhaite déployer un agent IA vocal capable de gérer mes appels et..." },
            { id: "workflow", label: "Workflows Autonomes", template: "Je veux automatiser mon processus de [domaine] via des workflows indépendants et performants." },
            { id: "full", label: "Système Complet", template: "Je souhaite créer un écosystème sur-mesure combinant architecture, design et IA de bout en bout." }
          ] 
        },
        details: { 
          title: "Dites-m'en plus", 
          messageLabel: "Votre message", 
          budgetLabel: "Budget estimé",
          customMessage: "Message personnalisé",
          useTemplate: "Utiliser un template"
        },
      },
      cta: { next: "Continuer", prev: "Retour", submit: "Envoyer ma demande" },
      success: {
        title: "Demande reçue",
        message: "Je reviens vers vous sous 48h pour analyser votre système."
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
    domainLegit: {
      badge: "Domaine officiel verifie",
      title: "aissabelkoussa.fr — vous etes au bon endroit.",
      subtitle: "Ce domaine est le seul que je possede et controle. C'est mon espace officiel sur le web.",
      ownership: {
        title: "Propriété du domaine",
        domain: "aissabelkoussa.fr",
        holder: "Aïssa Belkoussa (personne physique)",
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
    },
    services: {
      badge: "Services & Results",
      title: "Your digital system.\nDesigned, delivered, operational.",
      subtitle: "Three clear formats. One goal: a system that runs from day one. First call free, no strings attached.",
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
          name: "Autonomous",
          tag: "Project only",
          description: "Your system delivered turnkey. You handle the rest — ideal if you have an in-house technical team.",
          price: "€3,900",
          priceNote: "One-time payment. No maintenance included.",
          monthlyPrice: "",
          monthlyNote: "",
          duration: "5 to 10 business days",
          features: [
            "1 system delivered (website, automation or dashboard)",
            "Strategic brief + validated mockup",
            "Exclusive usage license",
            "Production deployment",
            "Enhanced technical documentation",
            "Autonomy training (2h)",
          ],
          excluded: [
            "No post-delivery maintenance",
            "No security updates",
            "No monitoring",
            "No support",
          ],
        },
        {
          name: "Accelerator",
          tag: "Project + maintenance",
          description: "Your system delivered and maintained. 3 months free maintenance — you don't touch a thing.",
          price: "€2,900",
          priceNote: "Then €490/month after 3 free months. No commitment.",
          monthlyPrice: "€490",
          monthlyNote: "3 months free (€1,470 value)",
          duration: "5 to 10 business days",
          features: [
            "1 turnkey system (website, automation or dashboard)",
            "Strategic brief + validated mockup",
            "Exclusive usage license",
            "Production deployment included",
            "3 months monitoring + support included",
            "Bug fixes within 48h",
            "Continuous security updates",
            "Monthly performance report",
          ],
          excluded: [],
        },
        {
          name: "Partner",
          tag: "System + continuous evolution",
          description: "Your complete infrastructure — site, AI, data — with a dedicated technical partner evolving your system.",
          price: "€6,900",
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
      ],
      ecosystemCta: {
        text: "Need a custom architecture? The Ecosystem plan adapts to your ambitions — 2 to 6 months, outsourced CTO.",
        button: "Chat for 30 min",
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
    },
    offers: {
      title: "What I build for you",
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
    systems: {
      title: "Built systems, not promises",
      intro: "It's not what I could do. It's what I have done.",
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
      content: "My name is Aïssa. I am an entrepreneur, builder, and systems architect — based in southern France, operating everywhere.\n\nNo inheritance, no safety net. Just years of learning, building, and testing — until I mastered what many delegate without understanding.\n\nWhat sets me apart? I live in both worlds: I understand business strategy and I build the technical system that executes it. No need for a project manager between you and the code.\n\nIf you have a system idea — fuzzy or precise — I can transform it into something real.",
      location: "Based in the South of 🇫🇷. Working worldwide.",
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
      version: "Version preliminary version",
      legalNotice: "Legal notice",
      privacyPolicy: "Privacy policy",
      termsOfService: "Terms of service",
      termsAndConditions: "Terms and conditions",
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
            { id: "design", label: "Design & Experiences", template: "I want to redesign my interface with a systemic and immersive approach. My goal is to..." },
            { id: "app", label: "Large Scale Apps", template: "I need to build a robust and scalable SaaS application capable of handling..." },
            { id: "chatbot", label: "AI Chatbots", template: "I'm looking to integrate an intelligent conversational agent to automate..." },
            { id: "phone", label: "AI Phone Agents", template: "I wish to deploy a vocal AI agent capable of handling my calls and..." },
            { id: "workflow", label: "Autonomous Workflows", template: "I want to automate my [domain] process via independent and high-performance workflows." },
            { id: "full", label: "Full System", template: "I want to create a bespoke ecosystem combining architecture, design, and AI from end to end." }
          ] 
        },
        details: { 
          title: "Tell me more", 
          messageLabel: "Your message", 
          budgetLabel: "Estimated Budget",
          customMessage: "Custom message",
          useTemplate: "Use template"
        },
      },
      cta: { next: "Continue", prev: "Back", submit: "Send my request" },
      success: {
        title: "Request received",
        message: "I'll get back to you within 48h to analyze your system."
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
    domainLegit: {
      badge: "Verified official domain",
      title: "aissabelkoussa.fr — you are in the right place.",
      subtitle: "This domain is the only one I own and control. This is my official space on the web.",
      ownership: {
        title: "Domain ownership",
        domain: "aissabelkoussa.fr",
        holder: "Aïssa Belkoussa (individual)",
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
