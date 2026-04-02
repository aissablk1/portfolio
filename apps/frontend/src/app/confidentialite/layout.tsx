import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Politique de confidentialite et protection des donnees personnelles du site aissabelkoussa.fr, conformement au RGPD.",
  robots: { index: true, follow: true },
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
