import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title:
    "Calculateur ROI — Combien l'automatisation vous rapporte | Aïssa Belkoussa",
  description:
    "Estimez en 30 secondes combien l'automatisation IA vous fait économiser. Calculateur interactif : heures récupérées, économies annuelles, délai de rentabilité.",
  keywords: [
    "calculateur ROI automatisation",
    "ROI intelligence artificielle",
    "économie automatisation IA",
    "rentabilité automatisation PME",
    "calculateur retour sur investissement",
    "automatisation BTP ROI",
    "gain de temps IA entreprise",
  ],
  alternates: {
    canonical: `${siteUrl}/calculateur-roi`,
  },
  openGraph: {
    title: "Calculateur ROI — Combien l'automatisation vous rapporte",
    description:
      "Estimez en 30 secondes combien l'automatisation IA vous fait économiser. Calculateur interactif gratuit.",
    url: `${siteUrl}/calculateur-roi`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Calculateur ROI", url: `${siteUrl}/calculateur-roi` },
]);

export default function CalculateurROILayout({
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
