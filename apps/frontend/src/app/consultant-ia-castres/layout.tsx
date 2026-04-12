import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA à Castres — Expert intelligence artificielle Sud Tarn",
  description:
    "Consultant IA freelance à Castres, Sud Tarn. Automatisation, chatbot IA, sites web et dashboards pour PME, artisans et industries. Prix fixe dès 1 500 EUR, livré en 10 jours. Finançable OPCO.",
  keywords: [
    "consultant IA Castres",
    "expert IA Sud Tarn",
    "automatisation PME Castres",
    "consultant IA freelance Castres",
    "consultant digital PME Castres-Mazamet",
    "chatbot IA entreprise Castres",
    "développeur IA Castres Occitanie",
    "consultant IA industrie textile Castres",
    "expert intelligence artificielle Castres",
    "automatisation artisan Sud Tarn",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-castres`,
  },
  openGraph: {
    title: "Consultant IA à Castres — Expert intelligence artificielle Sud Tarn",
    description:
      "Automatisation, chatbot IA, sites web pour PME et artisans. Prix fixe, livré en 10 jours.",
    url: `${siteUrl}/consultant-ia-castres`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-castres/#service`,
  name: "Consultant IA à Castres — Aïssa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance à Castres (Sud Tarn). Automatisation, chatbot IA, sites web, dashboards pour PME, artisans et industries du bassin Castres-Mazamet. Expertise textile, pharmacie, BTP.",
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
    { "@type": "City", name: "Labruguière" },
    { "@type": "City", name: "Aussillon" },
    { "@type": "City", name: "Revel" },
    { "@type": "City", name: "Lavaur" },
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
      name: "Combien coûte un consultant IA à Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance à Castres facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter à 1 500 EUR, Accélérateur à 2 900 EUR, Partenaire à 6 900 EUR. Des tarifs adaptés aux PME et artisans du bassin Castres-Mazamet.",
      },
    },
    {
      "@type": "Question",
      name: "L'IA peut-elle aider les entreprises textiles et pharmaceutiques de Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. L'IA automatise le suivi de production, la gestion de stock, les contrôles qualité et les rapports réglementaires. Pour le textile, elle optimise la planification et les commandes fournisseurs. Pour la pharmacie (Pierre Fabre, sous-traitants), elle automatise la documentation et le suivi de conformité.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA local est-il disponible pour des réunions en personne à Castres ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Basé à Albi, à 40 minutes de Castres, je me déplace régulièrement pour les réunions en personne, ateliers de cadrage et formations. Les échanges courants se font en visio pour plus d'efficacité.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financières pour un projet IA dans le Sud Tarn ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salariés), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). Le consultant vous accompagne dans le montage du dossier.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un consultant local plutôt qu'une agence de Toulouse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant local connaît le tissu économique du bassin Castres-Mazamet, les spécificités des PME et artisans du Sud Tarn, et les aides régionales Occitanie. Les tarifs sont adaptés à l'économie locale, sans compromettre la qualité technique.",
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
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Consultant IA Castres" }]} />
      {children}
    </>
  );
}
