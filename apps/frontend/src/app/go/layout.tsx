import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { goPageSchema, formationSchemas, breadcrumbs } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Votre système devrait déjà tourner — Offres & Résultats",
  description:
    "Systèmes digitaux pour artisans BTP et prestataires B2B. Accelerateur : 2 900 EUR + 3 mois maintenance offerts. Livre en 5-10 jours. Prix fixe, licence d'usage incluse.",
  alternates: {
    canonical: `${siteUrl}/go`,
  },
  openGraph: {
    title: "Votre système devrait déjà tourner — Aïssa BELKOUSSA",
    description:
      "Sites, automatisations IA, dashboards — livres en 5-10 jours avec 3 mois de maintenance inclus. A partir de 2 900 EUR.",
    url: `${siteUrl}/go`,
    type: "website",
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[goPageSchema, ...formationSchemas, breadcrumbs.go]} />
      {children}
    </>
  );
}
