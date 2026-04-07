import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Audit digital personnalise — 47 EUR | Aïssa BELKOUSSA",
  description:
    "Rapport d'audit personnalise de votre presence digitale. 5 axes analyses, recommandations concretes, livre par email sous 24h. 47 EUR au lieu de 197 EUR.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/audit` },
  openGraph: {
    title: "Audit digital personnalise — 47 EUR",
    description:
      "5 axes analyses, recommandations concretes, livre par email sous 24h.",
    url: `${siteUrl}/audit`,
    siteName: "Aïssa BELKOUSSA",
    locale: "fr_FR",
    type: "website",
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
