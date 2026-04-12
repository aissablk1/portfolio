import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA à Toulouse — Expert intelligence artificielle Haute-Garonne",
  description:
    "Consultant IA freelance à Toulouse, Haute-Garonne. Automatisation, chatbot IA, sites web et dashboards pour PME, startups et ETI. Prix fixe dès 1 500 EUR, livré en 10 jours. Finançable OPCO.",
  keywords: [
    "consultant IA Toulouse",
    "expert intelligence artificielle Haute-Garonne",
    "automatisation IA Toulouse",
    "consultant IA freelance Toulouse",
    "consultant digital PME Toulouse",
    "chatbot IA entreprise Toulouse",
    "développeur IA Toulouse Occitanie",
    "consultant IA startups Toulouse",
    "expert IA Aerospace Valley",
    "intelligence artificielle Toulouse Occitanie",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-toulouse`,
  },
  openGraph: {
    title: "Consultant IA à Toulouse — Expert intelligence artificielle Haute-Garonne",
    description:
      "Automatisation, chatbot IA, sites web pour PME et startups. Prix fixe, livré en 10 jours.",
    url: `${siteUrl}/consultant-ia-toulouse`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-toulouse/#service`,
  name: "Consultant IA à Toulouse — Aïssa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance à Toulouse (Haute-Garonne). Automatisation, chatbot IA, sites web, dashboards pour PME, startups et ETI. Écosystème Aerospace Valley, capitale tech Occitanie.",
  url: `${siteUrl}/consultant-ia-toulouse`,
  provider: { "@id": `${siteUrl}/#person` },
  areaServed: [
    {
      "@type": "City",
      name: "Toulouse",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Haute-Garonne",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Occitanie",
        },
      },
    },
    { "@type": "AdministrativeArea", name: "Haute-Garonne" },
    { "@type": "City", name: "Blagnac" },
    { "@type": "City", name: "Colomiers" },
    { "@type": "City", name: "Tournefeuille" },
    { "@type": "City", name: "Muret" },
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
    addressLocality: "Toulouse",
    addressRegion: "Occitanie",
    postalCode: "31000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.6047,
    longitude: 1.4442,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûte un consultant IA à Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance à Toulouse facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter à 1 500 EUR, Accélérateur à 2 900 EUR, Partenaire à 6 900 EUR. C'est 2 à 3 fois moins cher qu'une agence parisienne, avec la même expertise technique.",
      },
    },
    {
      "@type": "Question",
      name: "Quels secteurs à Toulouse bénéficient le plus de l'IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'aéronautique (sous-traitants Airbus, Aerospace Valley), les startups tech (Toulouse est le 2e pôle numérique français), le BTP, la santé (CHU, cliniques), et les PME industrielles du bassin toulousain. L'IA automatise les process, les devis, la relation client et le suivi de production.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA local est-il disponible pour des réunions en personne à Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Basé à Albi, à 1h de Toulouse, je me déplace régulièrement pour les réunions en personne, ateliers de cadrage et formations. Les échanges courants se font en visio pour plus d'efficacité.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financières pour un projet IA en Haute-Garonne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salariés), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). BPI France propose aussi des financements pour les startups innovantes de la région.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre un consultant IA freelance et une ESN toulousaine ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une ESN facture 1 500 à 2 500 EUR/jour avec des équipes qui tournent. Un consultant freelance facture 800 EUR/jour, vous travaillez directement avec l'expert qui code, et le projet est livré en 5 à 10 jours au lieu de 2 à 6 mois.",
      },
    },
  ],
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Consultant IA Toulouse", url: `${siteUrl}/consultant-ia-toulouse` },
]);

export default function ConsultantIAToulouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[localServiceSchema, faqSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Consultant IA Toulouse" }]} />
      {children}
    </>
  );
}
