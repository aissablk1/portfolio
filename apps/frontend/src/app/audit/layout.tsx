import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Audit digital personnalisé — 47 € | Aïssa BELKOUSSA",
  description:
    "Rapport d'audit personnalisé de votre présence digitale. 5 axes analysés, recommandations concrètes, livré par e-mail sous 24h. 47 € au lieu de 197 €.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/audit` },
  openGraph: {
    title: "Audit digital personnalisé — 47 €",
    description:
      "5 axes analysés, recommandations concrètes, livré par e-mail sous 24h.",
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
