/**
 * schemas.ts — Donnees structurees Schema.org (JSON-LD)
 *
 * Chaque schema est conforme aux recommandations Google Rich Results
 * et aux specifications Schema.org en vigueur.
 *
 * Architecture @id :
 *   /#person           → Aissa Belkoussa (Person)
 *   /#organization     → Entreprise (ProfessionalService + LocalBusiness)
 *   /#website          → Site web
 *   /services/#service → Service principal
 *   /go/#offer-*       → Offres individuelles
 *   /diagnostic/#app   → Application diagnostic
 *   /contact/#contact  → Page contact
 */

const siteUrl = "https://www.aissabelkoussa.fr";

/* ================================================================== */
/*  1. PERSON                                                          */
/* ================================================================== */

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Aissa Belkoussa",
  givenName: "Aissa",
  familyName: "Belkoussa",
  url: siteUrl,
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/assets/images/AISSABELKOUSSA.png`,
    width: 800,
    height: 800,
  },
  sameAs: [
    "https://www.linkedin.com/in/aissabelkoussa",
    "https://github.com/aissablk1",
    "https://t.me/investwithaissa",
  ],
  jobTitle: "Architecte de systemes digitaux",
  description:
    "Entrepreneur et builder base dans le sud de la France. Je transforme des intuitions systeme en architectures digitales concretes, coherentes et fiables.",
  knowsAbout: [
    "Automation de workflows",
    "Architecture logicielle",
    "Intelligence artificielle",
    "Developpement React et Next.js",
    "E-commerce Shopify",
    "Dashboards decisionnels",
    "TypeScript",
    "Node.js",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Albi",
    addressRegion: "Occitanie",
    postalCode: "81000",
    addressCountry: "FR",
  },
  nationality: { "@type": "Country", name: "France" },
  worksFor: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@aissabelkoussa.fr",
    contactType: "customer service",
    availableLanguage: ["French", "English"],
  },
};

/* ================================================================== */
/*  2. ORGANIZATION / PROFESSIONAL SERVICE / LOCAL BUSINESS            */
/* ================================================================== */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${siteUrl}/#organization`,
  name: "Aissa Belkoussa",
  legalName: "Aissa Belkoussa",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/assets/images/AISSABELKOUSSA.png`,
    width: 800,
    height: 800,
  },
  image: `${siteUrl}/assets/images/AISSABELKOUSSA.png`,
  description:
    "Architecture de systemes, automation et developpement digital sur-mesure. Sites, IA, dashboards, e-commerce. Base a Albi, France.",
  founder: { "@id": `${siteUrl}/#person` },
  foundingDate: "2022",
  taxID: "937690592",
  leiCode: "93769059200012",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Albi",
    addressRegion: "Occitanie",
    postalCode: "81000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.9277,
    longitude: 2.148,
  },
  areaServed: [
    {
      "@type": "Country",
      name: "France",
    },
    {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
  ],
  serviceType: [
    "Architecture de systemes digitaux",
    "Developpement web sur-mesure",
    "Automation et IA",
    "E-commerce Shopify",
    "Dashboards decisionnels",
  ],
  priceRange: "$$",
  currenciesAccepted: "EUR",
  paymentAccepted: "Virement bancaire, Cheque",
  email: "contact@aissabelkoussa.fr",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@aissabelkoussa.fr",
    contactType: "customer service",
    availableLanguage: ["French", "English"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services digitaux",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Plans projet",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Autonome",
            price: "3900",
            priceCurrency: "EUR",
            itemOffered: {
              "@type": "Service",
              name: "Autonome — Projet seul",
              description:
                "Systeme livre cle en main avec documentation technique renforcee et formation autonomie. Pour ceux qui ont une equipe technique.",
            },
          },
          {
            "@type": "Offer",
            name: "Accelerateur",
            price: "2900",
            priceCurrency: "EUR",
            itemOffered: {
              "@type": "Service",
              name: "Accelerateur — Projet + maintenance",
              description:
                "Systeme livre et maintenu. 3 mois de maintenance offerts, monitoring 24/7, bugs sous 48h, mises a jour securite.",
            },
          },
          {
            "@type": "Offer",
            name: "Partenaire",
            price: "6900",
            priceCurrency: "EUR",
            itemOffered: {
              "@type": "Service",
              name: "Partenaire — Systeme + evolution continue",
              description:
                "Infrastructure complete (site, IA, donnees) avec partenaire technique dedie. Evolutions mensuelles, support prioritaire, strategie digitale.",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Plans maintenance",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Maintenance Essentiel",
            price: "490",
            priceCurrency: "EUR",
            itemOffered: {
              "@type": "Service",
              name: "Maintenance Essentiel",
              description:
                "Monitoring 24/7, correction de bugs sous 48h, mises a jour securite, rapport mensuel de performance.",
            },
          },
          {
            "@type": "Offer",
            name: "Maintenance Premium",
            price: "1900",
            priceCurrency: "EUR",
            itemOffered: {
              "@type": "Service",
              name: "Maintenance Premium",
              description:
                "Essentiel + evolutions 10h/mois, support 24h, reunion strategique mensuelle.",
            },
          },
        ],
      },
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/aissabelkoussa",
    "https://github.com/aissablk1",
  ],
};

/* ================================================================== */
/*  3. WEBSITE + SEARCH ACTION                                         */
/* ================================================================== */

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Aissa Belkoussa",
  url: siteUrl,
  description:
    "Portfolio et services — Architecture de systemes, automation et developpement digital sur-mesure.",
  author: { "@id": `${siteUrl}/#person` },
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: ["fr", "en"],
};

/* ================================================================== */
/*  4. FAQ (page d'accueil + services)                                 */
/* ================================================================== */

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un architecte de systemes digitaux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un architecte de systemes digitaux concoit et deploie des infrastructures numeriques coherentes : automatisations, workflows, dashboards et integrations. Contrairement a un consultant, il code et livre des systemes operationnels — pas des recommandations.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle difference entre un developpeur freelance et un architecte de systemes ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un developpeur freelance execute des taches techniques definies. Un architecte de systemes part du besoin business pour concevoir l'architecture complete — choix des outils, structure des donnees, flux d'automatisation — puis la deploie. C'est la difference entre construire une piece et concevoir une maison.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coute un systeme digital sur-mesure ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les systemes sont proposes en 3 formules : Autonome a 3 900 EUR (projet seul), Accelerateur a 2 900 EUR (projet + 3 mois maintenance), et Partenaire a 6 900 EUR (systeme complet + evolution continue). Les prix sont forfaitaires et garantis.",
      },
    },
    {
      "@type": "Question",
      name: "Comment automatiser les workflows d'une PME sans DSI ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'automatisation d'une PME commence par un audit des flux manuels repetitifs : traitement de leads, relances, reporting, synchronisation d'outils. On identifie les points de friction, on choisit les outils adaptes (n8n, Make, API custom), et on construit un systeme qui tourne sans intervention humaine.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la difference entre un site sur-mesure et un template ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un template est concu pour tout le monde, donc pour personne en particulier. Un site sur-mesure est construit sur une architecture adaptee aux besoins specifiques du projet : performances, identite de marque, integrations metier, scalabilite. Le cout initial est plus eleve, le retour sur investissement aussi.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si j'arrete la maintenance ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Votre site reste en ligne et fonctionnel. Mais sans mises a jour regulieres, les performances SEO se degradent, les failles de securite ne sont plus corrigees, et votre systeme ne s'adapte plus. En moyenne, un site non maintenu perd 20-35% de son trafic organique en 6 mois.",
      },
    },
    {
      "@type": "Question",
      name: "L'abonnement de maintenance est-il avec engagement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Apres les 3 mois offerts, la maintenance est sans engagement — vous pouvez arreter a tout moment. L'engagement annuel est une option qui fait economiser 25% (3 mois gratuits sur 12).",
      },
    },
    {
      "@type": "Question",
      name: "Comment financer le projet avec mon OPCO ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Je vous aide a monter le dossier. Pour les entreprises de moins de 50 salaries, la formation peut etre prise en charge a 100%. Les aides OCCAL (70%, plafond 23 000 EUR) et Pass Occitanie (50%, plafond 10 000 EUR) sont aussi mobilisables pour les projets numeriques.",
      },
    },
    {
      "@type": "Question",
      name: "Proposez-vous des formations ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. IA Pratique (1 jour, 490 EUR/personne), Automatiser son business (2 jours, 890 EUR/personne), et Sur-mesure (3-5 jours, 800 EUR/jour). Toutes sont financables OPCO jusqu'a 100%.",
      },
    },
  ],
};

/* ================================================================== */
/*  5. SERVICES PAGE — Services detailles                              */
/* ================================================================== */

export const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}/services/#service`,
  name: "Systemes Digitaux & Automation",
  provider: { "@id": `${siteUrl}/#organization` },
  description:
    "Conception, livraison et maintenance de systemes digitaux : sites, automatisations IA, dashboards. Livre en 5-10 jours, 3 mois de maintenance inclus.",
  areaServed: [
    { "@type": "Country", name: "France" },
    { "@type": "AdministrativeArea", name: "Worldwide" },
  ],
  serviceType: "Digital Systems Architecture",
  termsOfService: `${siteUrl}/cgv`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Plans projet",
    itemListElement: [
      {
        "@type": "Offer",
        "@id": `${siteUrl}/services/#offer-autonome`,
        name: "Autonome — Projet seul",
        description:
          "Systeme livre cle en main. Documentation technique renforcee, formation autonomie 2h, licence d'usage non exclusive. Aucune maintenance incluse.",
        price: "3900",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "3900",
          priceCurrency: "EUR",
          unitText: "projet",
          description: "Paiement unique",
        },
        availability: "https://schema.org/InStock",
        validFrom: "2026-01-01",
        seller: { "@id": `${siteUrl}/#organization` },
        itemOffered: {
          "@type": "Service",
          name: "Autonome",
          description:
            "1 systeme livre (site, automation ou dashboard), brief + maquette validee, licence d'usage non exclusive, documentation technique renforcee, formation autonomie 2h.",
        },
      },
      {
        "@type": "Offer",
        "@id": `${siteUrl}/services/#offer-accelerateur`,
        name: "Accelerateur — Projet + maintenance",
        description:
          "Systeme livre et maintenu. 3 mois de monitoring + support offerts, bugs sous 48h, mises a jour securite continues, rapport mensuel.",
        price: "2900",
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: "2900",
            priceCurrency: "EUR",
            unitText: "projet",
            description: "Frais de mise en place",
          },
          {
            "@type": "UnitPriceSpecification",
            price: "490",
            priceCurrency: "EUR",
            unitText: "mois",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
            description: "Maintenance Essentiel apres 3 mois offerts",
          },
        ],
        availability: "https://schema.org/InStock",
        validFrom: "2026-01-01",
        seller: { "@id": `${siteUrl}/#organization` },
        itemOffered: {
          "@type": "Service",
          name: "Accelerateur",
          description:
            "1 systeme cle en main, licence d'usage non exclusive, 3 mois monitoring + support offerts, corrections bugs sous 48h, MAJ securite continues, rapport mensuel.",
        },
      },
      {
        "@type": "Offer",
        "@id": `${siteUrl}/services/#offer-partenaire`,
        name: "Partenaire — Systeme + evolution continue",
        description:
          "Infrastructure complete (site, IA, donnees) avec partenaire technique dedie. 3 mois evolution + support Premium offerts.",
        price: "6900",
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: "6900",
            priceCurrency: "EUR",
            unitText: "projet",
            description: "Frais de mise en place",
          },
          {
            "@type": "UnitPriceSpecification",
            price: "1900",
            priceCurrency: "EUR",
            unitText: "mois",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: "1",
              unitCode: "MON",
            },
            description: "Maintenance Premium apres 3 mois offerts",
          },
        ],
        availability: "https://schema.org/InStock",
        validFrom: "2026-01-01",
        seller: { "@id": `${siteUrl}/#organization` },
        itemOffered: {
          "@type": "Service",
          name: "Partenaire",
          description:
            "Systeme multi-briques (site + IA + data), integration IA sur-mesure, evolutions 10h/mois + support 24h, reunion strategique mensuelle, acces prioritaire nouvelles technos IA.",
        },
      },
    ],
  },
};

/* ================================================================== */
/*  6. GO PAGE — Offres avec contexte niche                            */
/* ================================================================== */

export const goPageSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Offres systemes digitaux",
  description:
    "3 situations, 3 systemes. Pour artisans BTP et prestataires B2B.",
  url: `${siteUrl}/go`,
  numberOfItems: 4,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Offer",
        "@id": `${siteUrl}/go/#offer-pilote`,
        name: "Pilote Automatique",
        description:
          "Automatisation acquisition client : emails, chatbot IA, notifications, dashboard. Livre cle en main en 5 jours ouvres.",
        price: "1500",
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: "1500",
            priceCurrency: "EUR",
            unitText: "projet",
            description: "Mise en place",
          },
          {
            "@type": "UnitPriceSpecification",
            price: "290",
            priceCurrency: "EUR",
            unitText: "mois",
            description: "Maintenance optionnelle",
          },
        ],
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "France" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Offer",
        "@id": `${siteUrl}/go/#offer-autonome`,
        name: "Autonome — Projet seul",
        description:
          "J'ai une equipe technique. Je veux juste le livrable. Systeme livre cle en main, documentation technique renforcee, formation autonomie.",
        price: "3900",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "3900",
          priceCurrency: "EUR",
          unitText: "projet",
        },
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "France" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Offer",
        "@id": `${siteUrl}/go/#offer-accelerateur`,
        name: "Accelerateur — Projet + maintenance",
        description:
          "Je veux un systeme qui tourne, sans m'en occuper. Systeme livre et maintenu, 3 mois offerts, monitoring 24/7, bugs sous 48h.",
        price: "2900",
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: "2900",
            priceCurrency: "EUR",
            unitText: "projet",
            description: "Mise en place",
          },
          {
            "@type": "UnitPriceSpecification",
            price: "490",
            priceCurrency: "EUR",
            unitText: "mois",
            description: "Maintenance Essentiel apres 3 mois offerts",
          },
        ],
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "France" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Offer",
        "@id": `${siteUrl}/go/#offer-partenaire`,
        name: "Partenaire — Systeme + evolution continue",
        description:
          "J'ai besoin d'un partenaire technique qui fait evoluer mon systeme. Infrastructure complete avec IA, donnees et support dedie.",
        price: "6900",
        priceCurrency: "EUR",
        priceSpecification: [
          {
            "@type": "UnitPriceSpecification",
            price: "6900",
            priceCurrency: "EUR",
            unitText: "projet",
            description: "Mise en place",
          },
          {
            "@type": "UnitPriceSpecification",
            price: "1900",
            priceCurrency: "EUR",
            unitText: "mois",
            description: "Maintenance Premium apres 3 mois offerts",
          },
        ],
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "France" },
      },
    },
  ],
};

/* ================================================================== */
/*  7. DIAGNOSTIC PAGE — WebApplication + Quiz                         */
/* ================================================================== */

export const diagnosticPageSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteUrl}/diagnostic/#app`,
    name: "Diagnostic digital gratuit",
    url: `${siteUrl}/diagnostic`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "5 questions pour evaluer votre maturite digitale. Resultat immediat et recommandations personnalisees. Gratuit, sans engagement.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    creator: { "@id": `${siteUrl}/#person` },
    provider: { "@id": `${siteUrl}/#organization` },
    inLanguage: "fr",
    featureList: [
      "Evaluation en 5 questions",
      "Score de maturite digitale",
      "Recommandations personnalisees",
      "Resultat immediat",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Diagnostic de maturite digitale",
    url: `${siteUrl}/diagnostic`,
    description:
      "Evaluez la maturite digitale de votre entreprise en 5 questions : site web, prise de RDV, devis, relance prospects, taches admin.",
    educationalLevel: "beginner",
    about: {
      "@type": "Thing",
      name: "Maturite digitale des entreprises",
    },
    provider: { "@id": `${siteUrl}/#organization` },
    numberOfQuestions: 5,
    typicalAgeRange: "25-65",
  },
];

/* ================================================================== */
/*  8. CONTACT PAGE                                                    */
/* ================================================================== */

export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${siteUrl}/contact/#contact`,
  name: "Contact — Aissa Belkoussa",
  url: `${siteUrl}/contact`,
  description:
    "Initier un projet. 30 minutes suffisent pour cadrer votre besoin. Gratuit, zero engagement.",
  mainEntity: {
    "@type": "ContactPoint",
    email: "contact@aissabelkoussa.fr",
    contactType: "customer service",
    availableLanguage: ["French", "English"],
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "AdministrativeArea", name: "Worldwide" },
    ],
  },
  isPartOf: { "@id": `${siteUrl}/#website` },
};

/* ================================================================== */
/*  9. PROJECTS — CreativeWork + SoftwareApplication                   */
/* ================================================================== */

export function createProjectSchema(project: {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  datePublished: string;
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${siteUrl}/projects/${project.slug}/#project`,
      name: project.name,
      description: project.description,
      url: `${siteUrl}/projects/${project.slug}`,
      author: { "@id": `${siteUrl}/#person` },
      creator: { "@id": `${siteUrl}/#person` },
      datePublished: project.datePublished,
      image: `${siteUrl}/og/${project.slug}.jpg`,
      keywords: project.stack.join(", "),
      isPartOf: { "@id": `${siteUrl}/#website` },
      inLanguage: "fr",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: project.name,
      description: project.description,
      url: `${siteUrl}/projects/${project.slug}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      author: { "@id": `${siteUrl}/#person` },
      datePublished: project.datePublished,
      softwareRequirements: project.stack.join(", "),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
      },
    },
  ];
}

/* ================================================================== */
/*  10. BREADCRUMB                                                     */
/* ================================================================== */

export function createBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/* ── Breadcrumbs precalcules pour chaque page ─────────────────────── */

export const breadcrumbs = {
  home: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
  ]),

  services: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Tarifs & Services", url: `${siteUrl}/services` },
  ]),

  go: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Offres & Resultats", url: `${siteUrl}/go` },
  ]),

  diagnostic: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Diagnostic digital", url: `${siteUrl}/diagnostic` },
  ]),

  contact: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Contact", url: `${siteUrl}/contact` },
  ]),

  mentionsLegales: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Mentions legales", url: `${siteUrl}/mentions-legales` },
  ]),

  cgu: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "CGU", url: `${siteUrl}/cgu` },
  ]),

  cgv: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "CGV", url: `${siteUrl}/cgv` },
  ]),

  confidentialite: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Politique de confidentialite", url: `${siteUrl}/confidentialite` },
  ]),

  blog: createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
  ]),
};

export function createProjectBreadcrumb(projectName: string, slug: string) {
  return createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Systemes", url: `${siteUrl}/#systems` },
    { name: projectName, url: `${siteUrl}/projects/${slug}` },
  ]);
}

/* ================================================================== */
/*  11. LEGAL PAGES — WebPage                                          */
/* ================================================================== */

export function createLegalPageSchema(page: {
  name: string;
  url: string;
  description: string;
  lastReviewed: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${page.url}/#webpage`,
    name: page.name,
    url: page.url,
    description: page.description,
    lastReviewed: page.lastReviewed,
    inLanguage: "fr",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    breadcrumb: createBreadcrumbSchema([
      { name: "Accueil", url: siteUrl },
      { name: page.name, url: page.url },
    ]),
  };
}

export const legalPages = {
  mentionsLegales: createLegalPageSchema({
    name: "Mentions legales",
    url: `${siteUrl}/mentions-legales`,
    description:
      "Mentions legales du site aissabelkoussa.fr : identite de l'editeur, hebergement, propriete intellectuelle.",
    lastReviewed: "2026-03-28",
  }),

  cgu: createLegalPageSchema({
    name: "Conditions generales d'utilisation",
    url: `${siteUrl}/cgu`,
    description:
      "CGU du site aissabelkoussa.fr : acces, propriete intellectuelle, responsabilite et droit applicable.",
    lastReviewed: "2026-03-28",
  }),

  cgv: createLegalPageSchema({
    name: "Conditions generales de vente",
    url: `${siteUrl}/cgv`,
    description:
      "CGV des prestations d'Aissa Belkoussa : reglement, propriete intellectuelle, responsabilite, RGPD.",
    lastReviewed: "2026-04-02",
  }),

  confidentialite: createLegalPageSchema({
    name: "Politique de confidentialite",
    url: `${siteUrl}/confidentialite`,
    description:
      "Politique de confidentialite et protection des donnees personnelles, conformement au RGPD.",
    lastReviewed: "2026-03-28",
  }),
};

/* ================================================================== */
/*  12. FORMATIONS — Course                                            */
/* ================================================================== */

export const formationSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/services/#formation-ia-pratique`,
    name: "IA Pratique — Formation 1 jour",
    description:
      "Prompt engineering, cas d'usage metier, kit IA personnalise. Les equipes repartent operationnelles.",
    provider: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/services`,
    inLanguage: "fr",
    offers: [
      {
        "@type": "Offer",
        price: "490",
        priceCurrency: "EUR",
        description: "Tarif inter-entreprise par personne",
      },
      {
        "@type": "Offer",
        price: "1500",
        priceCurrency: "EUR",
        description: "Tarif intra-entreprise (groupe 6-12)",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/services/#formation-automatisation`,
    name: "Automatiser son business — Formation 2 jours",
    description:
      "Automatisations Make/n8n, chatbot, email auto, mesure ROI. 2-3 automatisations deployees pendant la formation.",
    provider: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/services`,
    inLanguage: "fr",
    offers: [
      {
        "@type": "Offer",
        price: "890",
        priceCurrency: "EUR",
        description: "Tarif inter-entreprise par personne",
      },
      {
        "@type": "Offer",
        price: "2800",
        priceCurrency: "EUR",
        description: "Tarif intra-entreprise",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${siteUrl}/services/#formation-sur-mesure`,
    name: "Formation IA sur-mesure — 3 a 5 jours",
    description:
      "Audit prealable, programme personnalise, suivi 3 mois. Transformation IA structuree.",
    provider: { "@id": `${siteUrl}/#organization` },
    url: `${siteUrl}/services`,
    inLanguage: "fr",
    offers: {
      "@type": "Offer",
      price: "800",
      priceCurrency: "EUR",
      description: "Tarif journalier",
    },
  },
];

/* ================================================================== */
/*  13. CONSULTING — Service                                           */
/* ================================================================== */

export const consultingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteUrl}/services/#consulting`,
  name: "Consulting IA & Digital",
  description:
    "Audit, conseil, architecture, implementation — a la carte. Demi-journee 450 EUR, journee 800 EUR, semaine 3 600 EUR, mois 6 800 EUR.",
  provider: { "@id": `${siteUrl}/#organization` },
  serviceType: "IT Consulting",
  areaServed: { "@type": "Country", name: "France" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tarifs consulting",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Demi-journee",
        price: "450",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Journee",
        price: "800",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Semaine",
        price: "3600",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Mois",
        price: "6800",
        priceCurrency: "EUR",
      },
    ],
  },
};

/* ================================================================== */
/*  14. ARTICLE — Blog                                                 */
/* ================================================================== */

export function createArticleSchema(article: {
  title: string;
  slug: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  image: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}/blog/${article.slug}/#article`,
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/blog/${article.slug}`,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#organization` },
    image: article.image.startsWith("http")
      ? article.image
      : `${siteUrl}${article.image}`,
    keywords: article.tags.join(", "),
    inLanguage: "fr",
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}
