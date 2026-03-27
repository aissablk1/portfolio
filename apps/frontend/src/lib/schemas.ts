const siteUrl = "https://www.aissabelkoussa.fr";

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
  jobTitle: "Architecte de systemes & Developpeur",
  description:
    "Entrepreneur et builder base dans le sud de France. Je transforme des intuitions systeme en architectures digitales concretes, coherentes et fiables.",
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
    name: "Aissa Belkoussa",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
  "@id": `${siteUrl}/#organization`,
  name: "Aissa Belkoussa",
  legalName: "Aissa Belkoussa",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/assets/images/AISSABELKOUSSA.png`,
  },
  description:
    "Architecture de systemes, automation et developpement digital sur-mesure.",
  founder: { "@id": `${siteUrl}/#person` },
  foundingDate: "2022",
  taxID: "937 690 592",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Albi",
    addressRegion: "Occitanie",
    postalCode: "81000",
    addressCountry: "FR",
  },
  areaServed: [
    { "@type": "Country", name: "France" },
    { "@type": "Place", name: "Worldwide" },
  ],
  priceRange: "Sur devis",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Architecture & Automation Systems",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Design d'experiences & Ecosystemes Digitaux",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Workflow Algorithmique & Intelligence des Donnees",
        },
      },
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/aissabelkoussa",
    "https://github.com/aissablk1",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aissa Belkoussa",
  url: siteUrl,
  description:
    "Portfolio & services — Architecture de systemes, automation et developpement digital",
  author: { "@id": `${siteUrl}/#person` },
};

export function createProjectSchema(project: {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/projects/${project.slug}/#project`,
    name: project.name,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    author: { "@id": `${siteUrl}/#person` },
    datePublished: project.datePublished,
    image: `${siteUrl}/og/${project.slug}.jpg`,
    keywords: project.stack.join(", "),
    isPartOf: { "@id": `${siteUrl}/#organization` },
  };
}

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
      name: "Combien coute un site e-commerce sur-mesure avec Shopify ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un site e-commerce sur-mesure avec Next.js connecte a Shopify Storefront API est tarife sur devis selon la complexite : nombre de pages, integrations tierces, volume produits, exigences RGPD. Chaque projet est evalue individuellement.",
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
  ],
};
