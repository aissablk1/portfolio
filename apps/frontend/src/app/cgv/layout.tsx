import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales de vente",
  description:
    "Conditions generales de vente des prestations d'Aïssa Belkoussa — reglement, propriete intellectuelle, responsabilite, RGPD.",
  robots: { index: true, follow: true },
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
