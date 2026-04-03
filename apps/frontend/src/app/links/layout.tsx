import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Liens — Aïssa Belkoussa",
  description:
    "Tous mes liens : portfolio, tarifs, diagnostic gratuit, contact, WhatsApp, réseaux sociaux.",
  alternates: {
    canonical: `${siteUrl}/links`,
  },
  openGraph: {
    title: "Aïssa Belkoussa — Liens",
    description:
      "Architecte de systèmes digitaux. Portfolio, tarifs, diagnostic gratuit, contact direct.",
    url: `${siteUrl}/links`,
    type: "website",
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
