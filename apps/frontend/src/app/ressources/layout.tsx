import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Ressources gratuites — Aïssa BELKOUSSA",
  description:
    "Guides, outils et articles gratuits pour les PME et artisans. Automatisation IA, SEO, visibilité digitale, formations.",
  alternates: {
    canonical: `${siteUrl}/ressources`,
  },
  openGraph: {
    title: "Ressources gratuites — Aïssa BELKOUSSA",
    description:
      "Guides, outils et articles gratuits pour les PME et artisans. Automatisation IA, SEO, visibilité digitale, formations.",
    url: `${siteUrl}/ressources`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Ressources", url: `${siteUrl}/ressources` },
]);

export default function RessourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Ressources" }]} />
      {children}
    </>
  );
}
