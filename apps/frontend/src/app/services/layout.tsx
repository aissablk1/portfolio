import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { servicesPageSchema, breadcrumbs } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Tarifs & Services",
  description:
    "Systemes digitaux livres en 5-10 jours avec 3 mois de maintenance inclus. Autonome (3 900 EUR), Accelerateur (2 900 EUR + 490 EUR/mois), Partenaire (6 900 EUR + 1 900 EUR/mois). Prix fixe, licence exclusive, zero intermediaire.",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Tarifs & Services — Aissa Belkoussa",
    description:
      "Votre systeme digital concu, livre et maintenu. 3 mois de maintenance offerts. A partir de 2 900 EUR.",
    url: `${siteUrl}/services`,
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[servicesPageSchema, breadcrumbs.services]} />
      {children}
    </>
  );
}
