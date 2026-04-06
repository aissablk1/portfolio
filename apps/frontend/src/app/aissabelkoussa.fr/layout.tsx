import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aissabelkoussa.fr — domaine officiel verifie",
  description:
    "Le domaine aissabelkoussa.fr est le seul domaine officiel d'Aïssa BELKOUSSA, architecte de systemes. Enregistre aupres d'OVHcloud.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DomainLegitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
