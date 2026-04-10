import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA a Castres — Expert intelligence artificielle Sud Tarn",
  description:
    "Consultant IA freelance a Castres, Sud Tarn. Automatisation, chatbot IA, sites web et dashboards pour PME, artisans et industries. Prix fixe des 1 500 EUR, livre en 10 jours. Financable OPCO.",
  keywords: [
    "consultant IA Castres",
    "expert IA Sud Tarn",
    "automatisation PME Castres",
    "consultant IA freelance Castres",
    "consultant digital PME Castres-Mazamet",
    "chatbot IA entreprise Castres",
    "developpeur IA Castres Occitanie",
    "consultant IA industrie textile Castres",
    "expert intelligence artificielle Castres",
    "automatisation artisan Sud Tarn",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-castres`,
  },
  openGraph: {
    title: "Consultant IA a Castres — Expert intelligence artificielle Sud Tarn",
    description:
      "Automatisation, chatbot IA, sites web pour PME et artisans. Prix fixe, livre en 10 jours.",
    url: `${siteUrl}/consultant-ia-castres`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-castres/#service`,
  name: "Consultant IA a Castres — Aissa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance a Castres (Sud Tarn). Automatisation, chatbot IA, sites web, dashboards pour PME, artisans et industries du bassin Castres-Mazamet. Expertise textile, pharmacie, BTP.",
  url: `${siteUrl}/consultant-ia-castres`,
  provider: { "@id": `${siteUrl}/#person` },
  areaServed: [
    {
      "@type": "City",
      name: "Castres",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Tarn",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Occitanie",
        },
      },
    },
    { "@type": "City", name: "Mazamet" },
    { "@type": "City", name: "Labruguiere" },
    { "@type": "City", name: "Aussillon" },
    { "@type": "City", name: "Revel" },
    { "@type": "City", name: "Lavaur" },
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
    addressLocality: "Castres",
    addressRegion: "Occitanie",
    postalCode: "81100",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.6016,
    longitude: 2.2404,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coute un consultant IA a Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance a Castres facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter a 1 500 EUR, Accelerateur a 2 900 EUR, Partenaire a 6 900 EUR. Des tarifs adaptes aux PME et artisans du bassin Castres-Mazamet.",
      },
    },
    {
      "@type": "Question",
      name: "L'IA peut-elle aider les entreprises textiles et pharmaceutiques de Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. L'IA automatise le suivi de production, la gestion de stock, les controles qualite et les rapports reglementaires. Pour le textile, elle optimise la planification et les commandes fournisseurs. Pour la pharmacie (Pierre Fabre, sous-traitants), elle automatise la documentation et le suivi de conformite.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA local est-il disponible pour des reunions en personne a Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Base a Albi, a 40 minutes de Castres, je me deplace regulierement pour les reunions en personne, ateliers de cadrage et formations. Les echanges courants se font en visio pour plus d'efficacite.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financieres pour un projet IA dans le Sud Tarn ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salaries), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). Le consultant vous accompagne dans le montage du dossier.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un consultant local plutot qu'une agence de Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant local connait le tissu economique du bassin Castres-Mazamet, les specificites des PME et artisans du Sud Tarn, et les aides regionales Occitanie. Les tarifs sont adaptes a l'economie locale, sans compromettre la qualite technique.",
      },
    },
  ],
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Consultant IA Castres", url: `${siteUrl}/consultant-ia-castres` },
]);

export default function ConsultantIACastresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[localServiceSchema, faqSchema, breadcrumb]} />
      {children}
    </>
  );
}
