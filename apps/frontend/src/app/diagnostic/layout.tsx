import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostic digital gratuit — Aïssa Belkoussa",
  description:
    "5 questions pour évaluer votre maturité digitale. Résultat immédiat + recommandations personnalisées. Gratuit, sans engagement.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Votre site vous rapporte-t-il des clients ? — Diagnostic gratuit",
    description: "5 questions, 2 minutes. Évaluez la maturité digitale de votre entreprise et recevez des recommandations personnalisées.",
    url: "https://www.aissabelkoussa.fr/diagnostic",
    siteName: "Aïssa Belkoussa",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diagnostic digital gratuit — Aïssa Belkoussa",
    description: "5 questions, 2 minutes. Évaluez votre maturité digitale.",
  },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
