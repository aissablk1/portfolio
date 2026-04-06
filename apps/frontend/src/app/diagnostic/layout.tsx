import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { diagnosticPageSchema, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Diagnostic digital gratuit — Aïssa BELKOUSSA",
  description:
    "5 questions pour evaluer votre maturite digitale. Resultat immediat + recommandations personnalisees. Gratuit, sans engagement.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.aissabelkoussa.fr/diagnostic",
  },
  openGraph: {
    title: "Votre site vous rapporte-t-il des clients ? — Diagnostic gratuit",
    description:
      "5 questions, 2 minutes. Evaluez la maturite digitale de votre entreprise et recevez des recommandations personnalisees.",
    url: "https://www.aissabelkoussa.fr/diagnostic",
    siteName: "Aïssa BELKOUSSA",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnostic digital gratuit — Aïssa BELKOUSSA",
    description: "5 questions, 2 minutes. Evaluez votre maturite digitale.",
  },
};

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[...diagnosticPageSchema, breadcrumbs.diagnostic]} />
      {children}
    </>
  );
}
