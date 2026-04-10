import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { personSchema, createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "À propos — Aïssa BELKOUSSA",
  description:
    "Développeur fullstack et consultant IA freelance basé à Albi. 93 projets livrés en 4 ans. Spécialisé automatisation, chatbots IA et sites web pour PME et artisans du Tarn.",
  alternates: {
    canonical: `${siteUrl}/a-propos`,
  },
  openGraph: {
    title: "À propos — Aïssa BELKOUSSA",
    description:
      "Développeur fullstack et consultant IA freelance basé à Albi. 93 projets livrés en 4 ans.",
    url: `${siteUrl}/a-propos`,
    type: "profile",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "À propos", url: `${siteUrl}/a-propos` },
]);

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[personSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]} />
      {children}
    </>
  );
}
