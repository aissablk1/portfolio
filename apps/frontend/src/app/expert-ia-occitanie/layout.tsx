import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Expert IA en Occitanie — Consultant intelligence artificielle régional",
  description:
    "Expert IA freelance en Occitanie. Automatisation, chatbot IA, sites web et dashboards pour PME et ETI. Albi, Toulouse, Castres, Montpellier. Prix fixe dès 1 500 EUR, livré en 10 jours. Finançable OPCO.",
  keywords: [
    "expert IA Occitanie",
    "consultant intelligence artificielle région Occitanie",
    "consultant IA freelance Occitanie",
    "automatisation IA Occitanie",
    "expert IA Albi Toulouse Castres",
    "chatbot IA entreprise Occitanie",
    "consultant digital PME Occitanie",
    "développeur IA Occitanie",
    "intelligence artificielle PME Sud France",
    "expert IA région Toulouse Montpellier",
  ],
  alternates: {
    canonical: `${siteUrl}/expert-ia-occitanie`,
  },
  openGraph: {
    title: "Expert IA en Occitanie — Consultant intelligence artificielle régional",
    description:
      "Automatisation, chatbot IA, sites web pour PME et ETI. Toute la région Occitanie. Prix fixe, livré en 10 jours.",
    url: `${siteUrl}/expert-ia-occitanie`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/expert-ia-occitanie/#service`,
  name: "Expert IA en Occitanie — Aïssa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance en Occitanie. Automatisation, chatbot IA, sites web, dashboards pour PME et ETI. Couverture régionale : Albi, Toulouse, Castres, Montpellier, Perpignan, Nîmes.",
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
        text: "Toute la région Occitanie : Albi, Toulouse, Castres, Montpellier, Perpignan, Nîmes, Tarbes, Rodez, Cahors, et toutes les villes intermédiaires. Basé à Albi, je me déplace pour les réunions en personne et travaille en visio pour les échanges courants.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte un expert IA en Occitanie ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un expert IA freelance en Occitanie facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter à 1 500 EUR, Accélérateur à 2 900 EUR, Partenaire à 6 900 EUR. C'est 2 à 3 fois moins cher qu'une agence parisienne, avec la même expertise technique.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides régionales Occitanie pour un projet IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables en Occitanie : OPCO (100% pour les entreprises de moins de 50 salariés), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). BPI France propose aussi des financements pour les startups innovantes de la région.",
      },
    },
    {
      "@type": "Question",
      name: "Quels secteurs économiques en Occitanie bénéficient le plus de l'IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'aéronautique (Toulouse, Aerospace Valley), le BTP (toute la région), le textile (Castres-Mazamet), la viticulture (Hérault, Gaillac), le tourisme (Lourdes, littoral), l'agroalimentaire et les PME industrielles. L'IA automatise les process, les devis, la relation client et le suivi de production.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un expert IA local en Occitanie plutôt qu'une agence parisienne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un expert local connaît le tissu économique régional, les aides Occitanie (OCCAL, Pass Occitanie), les spécificités de chaque bassin économique, et peut se déplacer pour des réunions en personne. Les tarifs sont 2 à 3 fois inférieurs à Paris, sans compromettre la qualité.",
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
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Expert IA Occitanie" }]} />
      {children}
    </>
  );
}
