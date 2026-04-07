import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Désinscription confirmée — Aïssa BELKOUSSA",
  robots: { index: false, follow: false },
};

export default function UnsubscribeConfirmedPage() {
  return (
    <div className="bg-site-bg min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-medium tracking-tighter uppercase mb-4">
          Désinscription confirmée
        </h1>
        <p className="text-site-text-light mb-8">
          Vous ne recevrez plus d&apos;e-mails automatiques de notre part. Si
          c&apos;est une erreur, contactez-nous directement.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-site-text text-site-bg rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
