import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Guide gratuit — L'IA pour les dirigeants en 2026",
  description:
    "Téléchargez le guide gratuit : 15 pages, 5 cas d'usage par secteur, les vrais prix de l'IA pour les PME. Par Aïssa BELKOUSSA, consultant IA à Albi.",
  keywords: [
    "guide IA PME",
    "intelligence artificielle dirigeants",
    "automatisation PME gratuit",
    "consultant IA Albi",
  ],
  alternates: {
    canonical: `${siteUrl}/guide-ia`,
  },
  openGraph: {
    title: "Guide gratuit — L'IA pour les dirigeants en 2026",
    description:
      "15 pages, 5 cas d'usage par secteur, les vrais prix de l'IA pour les PME. Téléchargement gratuit.",
    url: `${siteUrl}/guide-ia`,
    type: "website",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/guide-ia/#webpage`,
  name: "Guide gratuit — L'IA pour les dirigeants en 2026",
  description:
    "Téléchargez le guide gratuit : 15 pages, 5 cas d'usage par secteur, les vrais prix de l'IA pour les PME.",
  url: `${siteUrl}/guide-ia`,
  author: { "@id": `${siteUrl}/#person` },
  publisher: { "@id": `${siteUrl}/#person` },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Guide IA", url: `${siteUrl}/guide-ia` },
]);

export default function GuideIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Guide IA" }]} />
      {children}
    </>
  );
}
