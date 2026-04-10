import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  servicesPageSchema,
  faqSchema,
  formationSchemas,
  consultingSchema,
  breadcrumbs,
} from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Tarifs & Services",
  description:
    "Systemes digitaux livres en 5-10 jours avec 3 mois de maintenance inclus. Autonome (3 900 EUR), Accelerateur (2 900 EUR + 490 EUR/mois), Partenaire (6 900 EUR + 1 900 EUR/mois). Prix fixe, licence d'usage incluse, zero intermediaire.",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Tarifs & Services — Aïssa BELKOUSSA",
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
      <JsonLd data={[servicesPageSchema, faqSchema, ...formationSchemas, consultingSchema, breadcrumbs.services]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Tarifs & Services" }]} />
      {children}
    </>
  );
}
