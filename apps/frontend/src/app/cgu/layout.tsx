import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales d'utilisation",
  description:
    "Conditions generales d'utilisation du site aissabelkoussa.fr — acces, propriete intellectuelle, responsabilite et droit applicable.",
  robots: { index: true, follow: true },
};

export default function CGULayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
