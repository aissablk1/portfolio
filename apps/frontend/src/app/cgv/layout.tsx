import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Conditions générales de vente des prestations d'Aïssa BELKOUSSA — règlement, propriété intellectuelle, responsabilité, RGPD.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.aissabelkoussa.fr/cgv",
  },
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
