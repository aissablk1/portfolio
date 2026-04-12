import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles du site aissabelkoussa.fr, conformément au RGPD.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.aissabelkoussa.fr/confidentialite",
  },
};

export default function ConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[legalPages.confidentialite, breadcrumbs.confidentialite]} />
      {children}
    </>
  );
}
