import type { Metadata } from "next";
import Script from "next/script";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Tarifs & Services",
  description:
    "Systèmes digitaux livrés en 5-10 jours avec 3 mois de maintenance inclus. Autonome (3 900 €), Accélérateur (2 900 € + 490 €/mois), Partenaire (6 900 € + 1 900 €/mois). Prix fixe, licence exclusive, zéro intermédiaire.",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Tarifs & Services — Aïssa Belkoussa",
    description:
      "Votre système digital conçu, livré et maintenu. 3 mois de maintenance offerts. À partir de 2 900 €.",
    url: `${siteUrl}/services`,
    type: "website",
  },
};

const schemaJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Systèmes Digitaux & Automation",
  provider: {
    "@type": "Person",
    name: "Aïssa Belkoussa",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Albi",
      addressCountry: "FR",
    },
  },
  description:
    "Conception, livraison et maintenance de systèmes digitaux : sites, automatisations IA, dashboards. Livré en 5-10 jours, 3 mois de maintenance inclus.",
  areaServed: "FR",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Plans projet",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Autonome",
        description:
          "Projet seul, zéro maintenance. Pour ceux qui ont une équipe technique.",
        price: "3900",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Accélérateur",
        description:
          "Projet livré + 3 mois de maintenance inclus. Recommandé.",
        price: "2900",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Partenaire",
        description:
          "Système complet + partenaire technique dédié. 3 mois inclus.",
        price: "6900",
        priceCurrency: "EUR",
      },
    ],
  },
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="services-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {schemaJsonLd}
      </Script>
      {children}
    </>
  );
}
