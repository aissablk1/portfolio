import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { contactPageSchema, breadcrumbs } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Initier un projet avec Aïssa BELKOUSSA. 30 minutes suffisent pour cadrer votre besoin. Architecture de systemes, automation, IA. Gratuit, zero engagement.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact — Aïssa BELKOUSSA",
    description:
      "Construisons votre futur systeme. Architecture, automation, IA — 30 minutes pour cadrer votre projet.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[contactPageSchema, breadcrumbs.contact]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />
      {children}
    </>
  );
}
