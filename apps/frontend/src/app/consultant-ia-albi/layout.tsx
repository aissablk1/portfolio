import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA à Albi — Expert intelligence artificielle Tarn",
  description:
    "Consultant IA freelance à Albi, Tarn. Automatisation, chatbot IA, sites web et dashboards pour PME et artisans BTP. Prix fixe dès 1 500 EUR, livré en 10 jours. Finançable OPCO.",
  keywords: [
    "consultant IA Albi",
    "consultant intelligence artificielle Albi",
    "expert IA Tarn",
    "consultant IA freelance Tarn",
    "consultant digital PME Albi",
    "automatisation IA artisan Albi",
    "chatbot IA entreprise Tarn",
    "développeur IA Albi Occitanie",
    "consultant IA PME Occitanie",
    "expert intelligence artificielle Tarn Occitanie",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-albi`,
  },
  openGraph: {
    title: "Consultant IA à Albi — Expert intelligence artificielle Tarn",
    description:
      "Automatisation, chatbot IA, sites web pour PME et artisans. Prix fixe, livré en 10 jours.",
    url: `${siteUrl}/consultant-ia-albi`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-albi/#service`,
  name: "Consultant IA à Albi — Aissa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance à Albi (Tarn). Automatisation, chatbot IA, sites web, dashboards pour PME et artisans BTP. Expert en SEO local et GEO.",
  url: `${siteUrl}/consultant-ia-albi`,
  provider: { "@id": `${siteUrl}/#person` },
  areaServed: [
    {
      "@type": "City",
      name: "Albi",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Tarn",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Occitanie",
        },
      },
    },
    { "@type": "City", name: "Toulouse" },
    { "@type": "City", name: "Castres" },
    { "@type": "City", name: "Gaillac" },
    { "@type": "City", name: "Carmaux" },
  ],
  serviceType: [
    "Consultant intelligence artificielle",
    "Automatisation de workflows",
    "Développement de chatbot IA",
    "Création de site web professionnel",
    "Dashboard décisionnel",
    "SEO local et GEO",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services IA pour PME",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter — Pilote Automatique",
        price: "1500",
        priceCurrency: "EUR",
        description: "1 automatisation clé en main. Livré en 5 jours.",
      },
      {
        "@type": "Offer",
        name: "Accélérateur",
        price: "2900",
        priceCurrency: "EUR",
        description: "Système complet + 3 mois maintenance offerts.",
      },
      {
        "@type": "Offer",
        name: "Partenaire",
        price: "6900",
        priceCurrency: "EUR",
        description: "Infrastructure IA complète + partenaire technique dédié.",
      },
    ],
  },
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
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûte un consultant IA à Albi ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance à Albi facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter à 1 500 EUR, Accélérateur à 2 900 EUR, Partenaire à 6 900 EUR. C'est 2 à 3 fois moins cher qu'une agence parisienne.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financières pour un projet IA dans le Tarn ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salariés), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). Le consultant vous accompagne dans le montage du dossier.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA peut-il aider un artisan sans compétence technique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le consultant IA conçoit, construit et livre le système clé en main. L'artisan reçoit une formation et un système qui fonctionne sans intervention technique. Support inclus pendant 3 mois.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre un consultant IA et un développeur web ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un développeur web construit des sites. Un consultant IA conçoit des systèmes complets : automatisation, chatbot, dashboards, intégrations IA. Il part du besoin business, pas d'un cahier des charges technique.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un consultant IA local à Albi plutôt qu'une agence parisienne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant local connaît le tissu économique du Tarn, les aides régionales Occitanie, et peut se déplacer pour des réunions en personne. Les tarifs sont 2 à 3 fois inférieurs à Paris, sans compromettre la qualité.",
      },
    },
  ],
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Consultant IA Albi", url: `${siteUrl}/consultant-ia-albi` },
]);

export default function ConsultantIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[localServiceSchema, faqSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Consultant IA Albi" }]} />
      {children}
    </>
  );
}
