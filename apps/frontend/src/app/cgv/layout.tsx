import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Conditions generales de vente",
  description:
    "Conditions generales de vente des prestations d'Aissa Belkoussa — reglement, propriete intellectuelle, responsabilite, RGPD.",
  robots: { index: true, follow: true },
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[legalPages.cgv, breadcrumbs.cgv]} />
      {children}
    </>
  );
}
