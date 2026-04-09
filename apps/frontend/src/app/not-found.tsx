import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-site-bg min-h-screen relative">
      <main id="main-content" className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent mb-8">
            404
          </p>

          <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight tracking-tight">
            Page introuvable
          </h1>

          <p className="text-lg text-site-text-light leading-relaxed mb-12 max-w-lg mx-auto">
            Cette page n'existe pas ou a ete deplacee.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
            >
              Voir les offres
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-3 border border-site-border px-8 py-4 rounded-full font-display font-medium text-sm hover:border-site-accent hover:text-site-accent transition-colors"
            >
              Retour a l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
