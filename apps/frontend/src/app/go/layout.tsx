import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres & Résultats",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
