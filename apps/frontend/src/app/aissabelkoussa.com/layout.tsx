import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aissabelkoussa.com ne m'appartient pas",
  description:
    "Le domaine aissabelkoussa.com est détenu par un tiers (Team AG Internet) et constitue une usurpation d'identité numérique. Le site officiel est aissabelkoussa.fr.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DomainAlertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
