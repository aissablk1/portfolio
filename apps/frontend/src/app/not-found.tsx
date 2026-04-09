import dynamic from "next/dynamic";

const NotFoundClient = dynamic(() => import("@/components/NotFoundClient"), {
  ssr: false,
  loading: () => (
    <div className="bg-site-bg min-h-screen relative">
      <main id="main-content" className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent mb-8">
            404
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight tracking-tight">
            Page introuvable
          </h1>
        </div>
      </main>
    </div>
  ),
});

export default function NotFound() {
  return <NotFoundClient />;
}
