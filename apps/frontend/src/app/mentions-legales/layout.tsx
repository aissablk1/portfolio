import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { legalPages, breadcrumbs } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site aissabelkoussa.fr — identité de l'éditeur, hébergement, propriété intellectuelle et responsabilité.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.aissabelkoussa.fr/mentions-legales",
  },
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
