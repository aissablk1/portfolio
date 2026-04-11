import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Toutes les catégories — Blog Aïssa BELKOUSSA",
  description:
    "Explorez tous les articles du blog classés par thématique : IA, automatisation, sites web, SEO, conversion. Guides pratiques pour artisans, PME et prestataires B2B.",
  alternates: { canonical: `${siteUrl}/blog/categorie` },
  openGraph: {
    title: "Toutes les catégories — Blog Aïssa BELKOUSSA",
    description:
      "Explorez tous les articles du blog classés par thématique : IA, automatisation, sites web, SEO, conversion.",
    url: `${siteUrl}/blog/categorie`,
    type: "website",
  },
};

export default function CategoriesIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
