import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Journal de bord — Évolutions du site",
  description:
    "Suivez les évolutions du portfolio d'Aïssa BELKOUSSA : nouvelles fonctionnalités, articles, optimisations SEO et améliorations design, semaine après semaine.",
  alternates: {
    canonical: `${siteUrl}/changelog`,
  },
  openGraph: {
    title: "Journal de bord — Évolutions du site",
    description:
      "Ce site évolue chaque semaine. Retrouvez toutes les mises à jour et nouveautés.",
    url: `${siteUrl}/changelog`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Journal de bord", url: `${siteUrl}/changelog` },
]);

export default function ChangelogLayout({
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
