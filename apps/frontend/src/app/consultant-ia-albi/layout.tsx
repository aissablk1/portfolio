import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Consultant IA a Albi — Expert intelligence artificielle Tarn",
  description:
    "Consultant IA freelance a Albi, Tarn. Automatisation, chatbot IA, sites web et dashboards pour PME et artisans BTP. Prix fixe des 1 500 EUR, livre en 10 jours. Financable OPCO.",
  keywords: [
    "consultant IA Albi",
    "consultant intelligence artificielle Albi",
    "expert IA Tarn",
    "consultant IA freelance Tarn",
    "consultant digital PME Albi",
    "automatisation IA artisan Albi",
    "chatbot IA entreprise Tarn",
    "developpeur IA Albi Occitanie",
    "consultant IA PME Occitanie",
    "expert intelligence artificielle Tarn Occitanie",
  ],
  alternates: {
    canonical: `${siteUrl}/consultant-ia-albi`,
  },
  openGraph: {
    title: "Consultant IA a Albi — Expert intelligence artificielle Tarn",
    description:
      "Automatisation, chatbot IA, sites web pour PME et artisans. Prix fixe, livre en 10 jours.",
    url: `${siteUrl}/consultant-ia-albi`,
    type: "website",
  },
};

const localServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/consultant-ia-albi/#service`,
  name: "Consultant IA a Albi — Aissa BELKOUSSA",
  description:
    "Consultant intelligence artificielle freelance a Albi (Tarn). Automatisation, chatbot IA, sites web, dashboards pour PME et artisans BTP. Expert en SEO local et GEO.",
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
      name: "Combien coute un consultant IA a Albi ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant IA freelance a Albi facture 800 EUR/jour en TJM, ou propose des forfaits projet : Starter a 1 500 EUR, Accelerateur a 2 900 EUR, Partenaire a 6 900 EUR. C'est 2 a 3 fois moins cher qu'une agence parisienne.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles aides financieres pour un projet IA dans le Tarn ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois aides sont mobilisables : OPCO (100% pour les entreprises de moins de 50 salaries), OCCAL (70%, plafond 23 000 EUR), Pass Occitanie (50%, plafond 10 000 EUR). Le consultant vous accompagne dans le montage du dossier.",
      },
    },
    {
      "@type": "Question",
      name: "Un consultant IA peut-il aider un artisan sans competence technique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le consultant IA concoit, construit et livre le systeme cle en main. L'artisan recoit une formation et un systeme qui fonctionne sans intervention technique. Support inclus pendant 3 mois.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle difference entre un consultant IA et un developpeur web ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un developpeur web construit des sites. Un consultant IA concoit des systemes complets : automatisation, chatbot, dashboards, integrations IA. Il part du besoin business, pas d'un cahier des charges technique.",
      },
    },
    {
      "@type": "Question",
      name: "Pourquoi choisir un consultant IA local a Albi plutot qu'une agence parisienne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un consultant local connait le tissu economique du Tarn, les aides regionales Occitanie, et peut se deplacer pour des reunions en personne. Les tarifs sont 2 a 3 fois inferieurs a Paris, sans compromettre la qualite.",
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
      {children}
    </>
  );
}
