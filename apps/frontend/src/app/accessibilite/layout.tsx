import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité — Aïssa BELKOUSSA",
  description:
    "Déclaration d'accessibilité du site aissabelkoussa.fr. Norme visée : WCAG 2.1 niveau AA. Mesures prises et contenus non accessibles.",
  alternates: {
    canonical: `${siteUrl}/accessibilite`,
  },
  openGraph: {
    title: "Déclaration d'accessibilité — Aïssa BELKOUSSA",
    description:
      "Déclaration d'accessibilité du site aissabelkoussa.fr. Norme visée : WCAG 2.1 niveau AA.",
    url: `${siteUrl}/accessibilite`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Accessibilité", url: `${siteUrl}/accessibilite` },
]);

export default function AccessibiliteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Accessibilité" }]} />
      {children}
    </>
  );
}
