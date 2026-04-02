import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostic digital gratuit — Aïssa Belkoussa",
  description:
    "5 questions pour évaluer votre maturité digitale. Résultat immédiat + recommandations personnalisées. Gratuit, sans engagement.",
  robots: { index: true, follow: true },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
