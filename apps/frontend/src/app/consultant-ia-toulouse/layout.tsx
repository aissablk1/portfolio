import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA a Toulouse — Expert intelligence artificielle Haute-Garonne",
  description:
    "Consultant IA freelance a Toulouse, Haute-Garonne. Automatisation, chatbot IA, sites web et dashboards pour PME, startups et ETI. Prix fixe des 1 500 EUR, livre en 10 jours. Financable OPCO.",
  keywords: [
    "consultant IA Toulouse",
    "expert intelligence artificielle Haute-Garonne",
    "automatisation IA Toulouse",
    "consultant IA freelance Toulouse",
    "consultant digital PME Toulouse",
    "chatbot IA entreprise Toulouse",
    "developpeur IA Toulouse Occitanie",
    "consultant IA startups Toulouse",
    "expert IA Aerospace Valley",
    "intelligence artificielle Toulouse Occitanie",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-toulouse`,
  },
  openGraph: {
    title: "Consultant IA a Toulouse — Expert intelligence artificielle Haute-Garonne",
    description:
      "Automatisation, chatbot IA, sites web pour PME et startups. Prix fixe, livre en 10 jours.",
    url: `${siteUrl}/consultant-ia-toulouse`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-toulouse/#service`,
  name: "Consultant IA a Toulouse — Aissa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance a Toulouse (Haute-Garonne). Automatisation, chatbot IA, sites web, dashboards pour PME, startups et ETI. Ecosysteme Aerospace Valley, capitale tech Occitanie.",
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
    "Developpement de chatbot IA",
    "Creation de site web professionnel",
    "Dashboard decisionnel",
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
        description: "1 automatisation cle en main. Livre en 5 jours.",
      },
      {
        "@type": "Offer",
        name: "Accelerateur",
        price: "2900",
        priceCurrency: "EUR",
        description: "Systeme complet + 3 mois maintenance offerts.",
      },
      {
        "@type": "Offer",
        name: "Partenaire",
        price: "6900",
        priceCurrency: "EUR",
        description: "Infrastructure IA complete + partenaire technique dedie.",
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
      name: "Combien coute un consultant IA a Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance a Toulouse facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter a 1 500 EUR, Accelerateur a 2 900 EUR, Partenaire a 6 900 EUR. C'est 2 a 3 fois moins cher qu'une agence parisienne, avec la meme expertise technique.",
      },
    },
    {
      "@type": "Question",
      name: "Quels secteurs a Toulouse beneficient le plus de l'IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'aeronautique (sous-traitants Airbus, Aerospace Valley), les startups tech (Toulouse est le 2e pole numerique francais), le BTP, la sante (CHU, cliniques), et les PME industrielles du bassin toulousain. L'IA automatise les process, les devis, la relation client et le suivi de production.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA local est-il disponible pour des reunions en personne a Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Base a Albi, a 1h de Toulouse, je me deplace regulierement pour les reunions en personne, ateliers de cadrage et formations. Les echanges courants se font en visio pour plus d'efficacite.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financieres pour un projet IA en Haute-Garonne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salaries), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). BPI France propose aussi des financements pour les startups innovantes de la region.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle difference entre un consultant IA freelance et une ESN toulousaine ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une ESN facture 1 500 a 2 500 EUR/jour avec des equipes qui tournent. Un consultant freelance facture 800 EUR/jour, vous travaillez directement avec l'expert qui code, et le projet est livre en 5 a 10 jours au lieu de 2 a 6 mois.",
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
