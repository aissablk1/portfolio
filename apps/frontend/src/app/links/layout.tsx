import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Liens — Aïssa BELKOUSSA",
  description:
    "Tous mes liens : portfolio, tarifs, diagnostic gratuit, blog, contact, WhatsApp, réseaux sociaux.",
  alternates: {
    canonical: `${siteUrl}/links`,
  },
  openGraph: {
    title: "Aïssa BELKOUSSA — Liens",
    description:
      "Architecte de systèmes digitaux. Portfolio, tarifs, diagnostic gratuit, contact direct.",
    url: `${siteUrl}/links`,
    type: "website",
    images: [{ url: `${siteUrl}/assets/images/AISSABELKOUSSA.png`, width: 800, height: 800 }],
  },
  twitter: {
    card: "summary",
    title: "Aïssa BELKOUSSA — Liens",
    description: "Architecte de systèmes digitaux. Portfolio, tarifs, diagnostic gratuit, contact direct.",
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
