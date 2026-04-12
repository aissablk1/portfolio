import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site aissabelkoussa.fr — accès, propriété intellectuelle, responsabilité et droit applicable.",
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
