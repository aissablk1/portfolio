import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Votre système devrait déjà tourner — Offres & Résultats",
  description:
    "Systèmes digitaux pour artisans BTP et prestataires B2B. Accélérateur : 2 900 € + 3 mois maintenance offerts. Livré en 5-10 jours. Prix fixe, licence exclusive.",
  alternates: {
    canonical: `${siteUrl}/go`,
  },
  openGraph: {
    title: "Votre système devrait déjà tourner — Aïssa Belkoussa",
    description:
      "Sites, automatisations IA, dashboards — livrés en 5-10 jours avec 3 mois de maintenance inclus. À partir de 2 900 €.",
    url: `${siteUrl}/go`,
    type: "website",
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
