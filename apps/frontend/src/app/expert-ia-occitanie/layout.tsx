import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Expert IA en Occitanie — Consultant intelligence artificielle regional",
  description:
    "Expert IA freelance en Occitanie. Automatisation, chatbot IA, sites web et dashboards pour PME et ETI. Albi, Toulouse, Castres, Montpellier. Prix fixe des 1 500 EUR, livre en 10 jours. Financable OPCO.",
  keywords: [
    "expert IA Occitanie",
    "consultant intelligence artificielle region Occitanie",
    "consultant IA freelance Occitanie",
    "automatisation IA Occitanie",
    "expert IA Albi Toulouse Castres",
    "chatbot IA entreprise Occitanie",
    "consultant digital PME Occitanie",
    "developpeur IA Occitanie",
    "intelligence artificielle PME Sud France",
    "expert IA region Toulouse Montpellier",
  ],
  alternates: {
    canonical: `${siteUrl}/expert-ia-occitanie`,
  },
  openGraph: {
    title: "Expert IA en Occitanie — Consultant intelligence artificielle regional",
    description:
      "Automatisation, chatbot IA, sites web pour PME et ETI. Toute la region Occitanie. Prix fixe, livre en 10 jours.",
    url: `${siteUrl}/expert-ia-occitanie`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/expert-ia-occitanie/#service`,
  name: "Expert IA en Occitanie — Aissa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance en Occitanie. Automatisation, chatbot IA, sites web, dashboards pour PME et ETI. Couverture regionale : Albi, Toulouse, Castres, Montpellier, Perpignan, Nimes.",
  url: `${siteUrl}/expert-ia-occitanie`,
  provider: { "@id": `${siteUrl}/#person` },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Occitanie",
    },
    { "@type": "City", name: "Albi" },
    { "@type": "City", name: "Toulouse" },
    { "@type": "City", name: "Castres" },
    { "@type": "City", name: "Montpellier" },
    { "@type": "City", name: "Perpignan" },
    { "@type": "City", name: "Nimes" },
    { "@type": "City", name: "Tarbes" },
    { "@type": "City", name: "Rodez" },
    { "@type": "City", name: "Cahors" },
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
    addressLocality: "Albi",
    addressRegion: "Occitanie",
    postalCode: "81000",
    addressCountry: "FR",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelles villes d'Occitanie couvrez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Toute la region Occitanie : Albi, Toulouse, Castres, Montpellier, Perpignan, Nimes, Tarbes, Rodez, Cahors, et toutes les villes intermediaires. Base a Albi, je me deplace pour les reunions en personne et travaille en visio pour les echanges courants.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coute un expert IA en Occitanie ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un expert IA freelance en Occitanie facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter a 1 500 EUR, Accelerateur a 2 900 EUR, Partenaire a 6 900 EUR. C'est 2 a 3 fois moins cher qu'une agence parisienne, avec la meme expertise technique.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides regionales Occitanie pour un projet IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables en Occitanie : OPCO (100% pour les entreprises de moins de 50 salaries), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). BPI France propose aussi des financements pour les startups innovantes de la region.",
      },
    },
    {
      "@type": "Question",
      name: "Quels secteurs economiques en Occitanie beneficient le plus de l'IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'aeronautique (Toulouse, Aerospace Valley), le BTP (toute la region), le textile (Castres-Mazamet), la viticulture (Herault, Gaillac), le tourisme (Lourdes, littoral), l'agroalimentaire et les PME industrielles. L'IA automatise les process, les devis, la relation client et le suivi de production.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un expert IA local en Occitanie plutot qu'une agence parisienne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un expert local connait le tissu economique regional, les aides Occitanie (OCCAL, Pass Occitanie), les specificites de chaque bassin economique, et peut se deplacer pour des reunions en personne. Les tarifs sont 2 a 3 fois inferieurs a Paris, sans compromettre la qualite.",
      },
    },
  ],
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Expert IA Occitanie", url: `${siteUrl}/expert-ia-occitanie` },
]);

export default function ExpertIAOccitanieLayout({
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
