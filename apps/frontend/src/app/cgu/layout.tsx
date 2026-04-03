import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Conditions generales d'utilisation",
  description:
    "Conditions generales d'utilisation du site aissabelkoussa.fr — acces, propriete intellectuelle, responsabilite et droit applicable.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.aissabelkoussa.fr/cgu",
  },
};

export default function CGULayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[legalPages.cgu, breadcrumbs.cgu]} />
      {children}
    </>
  );
}
