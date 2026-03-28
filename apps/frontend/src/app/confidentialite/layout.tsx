import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Politique de confidentialite et protection des donnees personnelles du site aissabelkoussa.fr, conformement au RGPD.",
  robots: { index: true, follow: true },
};

export default function ConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
