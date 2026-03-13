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
    bio: string;
    subtitle: string;
    pillars: Array<{ title: string; content: string }>;
  };
  expertises: {
    items: string[];
  };
  systems: {
    title: string;
    items: Array<{
      id: string;
      slug: string;
      title: string;
      sub: string;
      desc: string;
      color: string;
    }>;
  };
  about: {
    content: string;
    location: string;
  };
  contact: {
    title: string;
    cta: string;
  };
  footer: {
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
      identity: { title: string; nameLabel: string; contextLabel: string };
      needs: { title: string; options: string[] };
      details: { title: string; messageLabel: string; budgetLabel: string };
    };
    cta: { next: string; prev: string; submit: string };
    success: { title: string; message: string };
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
    },
    hero: {
      title: "Architecture de systèmes, automation et innovation digitale.",
      subtitle: "Ingénierie de systèmes. Automation & IA. Architectures digitales à haute performance.",
      ctaPrimary: "Initier un projet",
      ctaSecondary: "Explorer",
    },
    offers: {
      title: "Offres",
      pillar1Props: { title: "Architecture & Automation Systems", sub: "Optimisation des workflows et infrastructures autonomes." },
      pillar2Props: { title: "Design d’expériences & Écosystèmes Digitaux", sub: "Interfaces haute-fidélité et parcours utilisateurs cohérents." },
      pillar3Props: { title: "Workflow Algorithmique & Intelligence des Données", sub: "Systèmes décisionnels et stratégies quantitative." },
    },
    approach: {
      title: "Approche",
      bio: "Je suis Aïssa. Je fusionne stratégie, design et systèmes pour bâtir des architectures digitales qui libèrent du temps, structurent la complexité et portent une croissance durable.",
      subtitle: "Transformer des idées en systèmes. Construire des architectures qui les font vivre.",
      pillars: [
        { title: "System-first, business-driven", content: "Chaque ligne de code, chaque automation, chaque dashboard doit servir une vision business claire." },
        { title: "Excellence opérationnelle", content: "Les idées ne suffisent pas. C’est dans le détail des systèmes et des flux que tout se joue." },
        { title: "ADN de builder", content: "Je ne me contente pas de conseiller : je conçois, j’automatise, je teste en réel." },
        { title: "Transparence & rigueur", content: "Je préfère un système simple qui tourne vraiment à une promesse complexe impossible à maintenir." },
      ],
    },
    expertises: {
      items: [
        "Systèmes d’automatisation sur-mesure",
        "Architecture d’IA et d’agents",
        "Stratégie data & monitoring temps réel",
        "Systèmes de workflow algorithmique & quantitatifs",
        "Dashboards & cockpits décisionnels",
        "Sites vitrines systémiques & expériences digitales",
        "Plateformes internes & outils métiers",
        "Programmes CRM & funnels automatisés",
      ],
    },
    systems: {
      title: "Systèmes sélectionnés",
      items: [
        {
          id: "dk-building",
          slug: "dk-building",
          title: "DK BUILDING",
          sub: "Real Estate Ecosystem.",
          desc: "Architecture digitale complète pour la gestion immobilière. Automation des leads, dashboards de rentabilité et interface investisseurs.",
          color: "#0F172A"
        },
        {
          id: "nexus-core",
          slug: "nexus-core",
          title: "NEXUS CORE",
          sub: "Industrial Automation Hub.",
          desc: "Système centralisé de monitoring industriel. Intégration d'agents IA pour la maintenance prédictive et optimisation des flux logistiques.",
          color: "#1E293B"
        },
        {
          id: "quantum-flow",
          slug: "quantum-flow",
          title: "QUANTUM FLOW",
          sub: "HFT Data Cockpit.",
          desc: "Interface haute performance pour le traitement de données massives. Visualisation temps réel et exécution algorithmique basse latence.",
          color: "#334155"
        }
      ]
    },
    about: {
      content: "Entrepreneur & système builder basé dans le sud de 🇫🇷. Autodidacte, obsédé par les architectures qui durent et les systèmes qui travaillent en arrière-plan. Je conçois des environnements numériques qui unifient automatisation, IA, workflow, design et stratégie.",
      location: "Basé dans le sud de 🇫🇷. Travaillant dans le monde entier.",
    },
    contact: {
      title: "Une idée de système, un chaos à structurer, ou envie de challenger vos process ?\nParlons-en.",
      cta: "Initier un projet",
    },
    footer: {
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
          contextLabel: "Entreprise ou Projet" 
        },
        needs: { 
          title: "De quoi avez-vous besoin ?", 
          options: [
            "Architecture & Automation Systems",
            "Design d'expériences & Écosystèmes",
            "Workflow Algorithmique & Data",
            "Audit & Stratégie"
          ] 
        },
        details: { 
          title: "Dites-m'en plus", 
          messageLabel: "Votre message", 
          budgetLabel: "Budget estimé" 
        },
      },
      cta: { next: "Continuer", prev: "Retour", submit: "Envoyer ma demande" },
      success: { 
        title: "Demande reçue", 
        message: "Je reviens vers vous sous 48h pour analyser votre système." 
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
    },
    hero: {
      title: "System architectures, automation and digital innovation.",
      subtitle: "Systems engineering. Automation & AI. High-performance digital architectures.",
      ctaPrimary: "Start a project",
      ctaSecondary: "Explore",
    },
    offers: {
      title: "Services",
      pillar1Props: { title: "Architecture & Automation Systems", sub: "Workflow optimization and autonomous infrastructures." },
      pillar2Props: { title: "Experience Design & Digital Ecosystems", sub: "High-fidelity interfaces and coherent user journeys." },
      pillar3Props: { title: "Algorithmic Workflow & Data Intelligence", sub: "Decision systems and quantitative strategies." },
    },
    approach: {
      title: "Approach",
      bio: "I'm Aïssa. I blend strategy, design, and systems to build digital architectures that free up time, structure complexity, and drive sustainable growth.",
      subtitle: "Transforming ideas into systems. Building architectures that make them live.",
      pillars: [
        { title: "System-first, business-driven", content: "Every line of code, every automation, every dashboard must serve a clear business vision." },
        { title: "Operational excellence", content: "Ideas are not enough. It's in the detail of systems and flows that everything happens." },
        { title: "Builder DNA", content: "I don't just advise: I design, automate, and test in real conditions." },
        { title: "Transparency & rigor", content: "I prefer a simple system that actually runs to a complex promise that's impossible to maintain." },
      ],
    },
    expertises: {
      items: [
        "Custom automation systems",
        "AI & agent architectures",
        "Real-time data & monitoring strategy",
        "Algorithmic workflow systems & prop firms",
        "Dashboards & decision cockpits",
        "Systemic showcase websites & digital experiences",
        "Internal platforms & tools",
        "CRM programs & automated funnels",
      ],
    },
    systems: {
      title: "Selected Systems",
      items: [
        {
          id: "dk-building",
          slug: "dk-building",
          title: "DK BUILDING",
          sub: "Real Estate Ecosystem.",
          desc: "Complete digital architecture for real estate management. Lead automation, profitability dashboards, and investor interface.",
          color: "#0F172A"
        },
        {
          id: "nexus-core",
          slug: "nexus-core",
          title: "NEXUS CORE",
          sub: "Industrial Automation Hub.",
          desc: "Centralized industrial monitoring system. AI agent integration for predictive maintenance and logistics flow optimization.",
          color: "#1E293B"
        },
        {
          id: "quantum-flow",
          slug: "quantum-flow",
          title: "QUANTUM FLOW",
          sub: "HFT Data Cockpit.",
          desc: "High-performance interface for massive data processing. Real-time visualization and low-latency algorithmic execution.",
          color: "#334155"
        }
      ]
    },
    about: {
      content: "Entrepreneur & system builder based in the South of 🇫🇷. Self-taught, obsessed with architectures that last and systems that work in the background. I design digital environments that unify automation, AI, workflow, design, and strategy.",
      location: "Based in the South of 🇫🇷. Working worldwide.",
    },
    contact: {
      title: "A system to imagine, a chaos to organize, or just the need to challenge your current setup?\nLet's talk.",
      cta: "Start a project",
    },
    footer: {
      title: "Building the future of digital progress.",
      baseline: "System architectures, automation and digital innovation.",
      credits: "© 2026 Portfolio by AÏSSA BELKOUSSA",
      reserved: "All rights reserved",
      version: "Preliminary version",
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
          contextLabel: "Company or Project" 
        },
        needs: { 
          title: "What do you need?", 
          options: [
            "Architecture & Automation Systems",
            "Experience Design & Ecosystems",
            "Algorithmic Workflow & Data",
            "Audit & Strategy"
          ] 
        },
        details: { 
          title: "Tell me more", 
          messageLabel: "Your message", 
          budgetLabel: "Estimated Budget" 
        },
      },
      cta: { next: "Continue", prev: "Back", submit: "Send my request" },
      success: { 
        title: "Request received", 
        message: "I'll get back to you within 48h to analyze your system." 
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
