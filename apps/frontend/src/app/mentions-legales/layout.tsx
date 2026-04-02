import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Mentions legales",
  description:
    "Mentions legales du site aissabelkoussa.fr — identite de l'editeur, hebergement, propriete intellectuelle et responsabilite.",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[legalPages.mentionsLegales, breadcrumbs.mentionsLegales]} />
      {children}
    </>
  );
}
