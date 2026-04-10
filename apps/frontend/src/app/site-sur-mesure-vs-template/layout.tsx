import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title:
    "Site sur-mesure vs Template : quel choix en 2026 | Aïssa Belkoussa",
  description:
    "Comparatif site sur-mesure vs template WordPress : coût, SEO, personnalisation, évolutivité. ROI comparé sur 12 mois. Guide pour faire le bon choix.",
  keywords: [
    "site sur-mesure vs template",
    "site web sur mesure ou template",
    "WordPress template vs développement sur mesure",
    "comparatif site internet",
    "coût site web sur mesure",
    "avantages site sur mesure",
    "site internet PME 2026",
  ],
  alternates: {
    canonical: `${siteUrl}/site-sur-mesure-vs-template`,
  },
  openGraph: {
    title: "Site sur-mesure vs Template : quel choix en 2026",
    description:
      "Comparatif détaillé sur 6 critères. Coût, SEO, personnalisation, évolutivité — avec exemples chiffrés et ROI sur 12 mois.",
    url: `${siteUrl}/site-sur-mesure-vs-template`,
    type: "article",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  {
    name: "Site sur-mesure vs Template",
    url: `${siteUrl}/site-sur-mesure-vs-template`,
  },
]);

export default function SurMesureVsTemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      {children}
    </>
  );
}
