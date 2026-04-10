import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title:
    "Freelance vs Agence : quel choix pour votre projet digital | Aïssa Belkoussa",
  description:
    "Comparatif honnête freelance vs agence : prix, délais, flexibilité, expertise. 8 critères pour faire le bon choix en 2026. Guide gratuit.",
  keywords: [
    "freelance vs agence",
    "freelance ou agence web",
    "comparatif freelance agence",
    "choisir freelance ou agence",
    "avantages freelance",
    "freelance développeur vs agence",
    "projet digital freelance",
  ],
  alternates: {
    canonical: `${siteUrl}/freelance-vs-agence`,
  },
  openGraph: {
    title: "Freelance vs Agence : quel choix pour votre projet digital",
    description:
      "Comparatif honnête sur 8 critères. Prix, délais, flexibilité, expertise — le guide pour faire le bon choix.",
    url: `${siteUrl}/freelance-vs-agence`,
    type: "article",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Freelance vs Agence", url: `${siteUrl}/freelance-vs-agence` },
]);

export default function FreelanceVsAgenceLayout({
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
