import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Partenaires & Réseau — Aïssa BELKOUSSA",
  description:
    "Découvrez le réseau de partenaires complémentaires d'Aïssa BELKOUSSA : consultants, éditeurs SaaS, réseaux d'affaires. Devenez apporteur d'affaires et touchez une commission.",
  alternates: {
    canonical: `${siteUrl}/partenaires`,
  },
  openGraph: {
    title: "Partenaires & Réseau — Aïssa BELKOUSSA",
    description:
      "Un réseau de partenaires complémentaires pour des projets digitaux et IA réussis.",
    url: `${siteUrl}/partenaires`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Partenaires", url: `${siteUrl}/partenaires` },
]);

export default function PartenairesLayout({
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
