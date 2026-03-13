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
    items: Array<{
      title: string;
      description: string;
      microcopy: string;
    }>;
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
        {
          title: "Systèmes d’automatisation sur-mesure",
          description: "Libérez votre potentiel humain en déléguant la répétition à des machines. Je conçois des flux autonomes qui connectent vos outils et fiabilisent vos opérations 24/7.",
          microcopy: "Industrialiser l'efficience"
        },
        {
          title: "Architecture d’IA et d’agents",
          description: "Intégrez l'intelligence artificielle au cœur de votre métier. Du LLM spécialisé aux agents autonomes, je bâtis des systèmes capables de raisonner et d'agir sur vos données.",
          microcopy: "Déployer l'intelligence"
        },
        {
          title: "Stratégie data & monitoring temps réel",
          description: "Ne pilotez plus à vue. J'installe des cockpits de données qui transforment le bruit numérique en indicateurs décisionnels clairs et exploitables instantanément.",
          microcopy: "Maîtriser le flux"
        },
        {
          title: "Systèmes de workflow algorithmique",
          description: "Performance et précision pour les environnements à haute fréquence. J'optimise vos algorithmes et vos chaînes de traitement pour une exécution sans faille.",
          microcopy: "Exécuter avec précision"
        },
        {
          title: "Dashboards & cockpits décisionnels",
          description: "Le design au service de la décision. Des interfaces immersives conçues pour une lecture rapide et une gestion intuitive de systèmes complexes.",
          microcopy: "Visualiser l'essentiel"
        },
        {
          title: "Sites vitrines systémiques",
          description: "Votre présence digitale n'est pas qu'une image, c'est un actif. Je crée des expériences immersives qui captent l'attention et convertissent par leur clarté.",
          microcopy: "Captiver l'audience"
        },
        {
          title: "Plateformes internes & outils métiers",
          description: "Des outils que vos équipes aimeront utiliser. Je simplifie vos processus internes avec des solutions sur-mesure qui s'adaptent à vos méthodes, pas l'inverse.",
          microcopy: "Simplifier l'usage"
        },
        {
          title: "Programmes CRM & funnels automatisés",
          description: "La conversion comme un système. J'automatise vos tunnels de vente et la nutrition de vos leads pour garantir une croissance prévisible et scalable.",
          microcopy: "Scaler la croissance"
        }
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
      content: "Entrepreneur & système builder basé dans le sud de 🇫🇷.\nAutodidacte, obsédé par les architectures qui durent et les systèmes qui travaillent en arrière-plan. Je conçois des environnements numériques qui unifient automatisation, IA, workflow, design et stratégie.",
      location: "Basé dans le sud de 🇫🇷. Travaillant dans le monde entier.",
    },
    contact: {
      title: "Une idée de système, un chaos à structurer, ou envie de challenger vos process ?\nParlons-en.",
      cta: "Initier un projet",
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
        {
          title: "Custom automation systems",
          description: "Free up human potential by delegating repetition to machines. I design autonomous flows that connect your tools and secure your operations 24/7.",
          microcopy: "Industrialize efficiency"
        },
        {
          title: "AI & agent architectures",
          description: "Integrate artificial intelligence into the heart of your business. From specialized LLMs to autonomous agents, I build systems capable of reasoning and acting on your data.",
          microcopy: "Deploy intelligence"
        },
        {
          title: "Real-time data & monitoring strategy",
          description: "Stop flying blind. I install data cockpits that transform digital noise into clear, instantly actionable decision indicators.",
          microcopy: "Master the flow"
        },
        {
          title: "Algorithmic workflow systems",
          description: "Performance and precision for high-frequency environments. I optimize your algorithms and processing chains for flawless execution.",
          microcopy: "Execute with precision"
        },
        {
          title: "Dashboards & decision cockpits",
          description: "Design at the service of decision. Immersive interfaces designed for quick reading and intuitive management of complex systems.",
          microcopy: "Visualize the essential"
        },
        {
          title: "Systemic showcase websites",
          description: "Your digital presence is not just an image, it's an asset. I create immersive experiences that capture attention and convert through clarity.",
          microcopy: "Captivate the audience"
        },
        {
          title: "Internal platforms & tools",
          description: "Tools your teams will love to use. I simplify your internal processes with bespoke solutions that adapt to your methods, not the other way around.",
          microcopy: "Simplify usage"
        },
        {
          title: "CRM programs & automated funnels",
          description: "Conversion as a system. I automate your sales funnels and lead nurturing to guarantee predictable and scalable growth.",
          microcopy: "Scale growth"
        }
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
      content: "Entrepreneur & system builder based in the South of 🇫🇷.\nSelf-taught, obsessed with architectures that last and systems that work in the background. I design digital environments that unify automation, AI, workflow, design, and strategy.",
      location: "Based in the South of 🇫🇷. Working worldwide.",
    },
    contact: {
      title: "A system to imagine, a chaos to organize, or just the need to challenge your current setup?\nLet's talk.",
      cta: "Start a project",
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
