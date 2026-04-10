import type { Metadata } from "next";
import { getAllCategories } from "@/lib/blog";

const siteUrl = "https://www.aissabelkoussa.fr";

export async function generateMetadata({ params }: { params: Promise<{ categorie: string }> }): Promise<Metadata> {
  const { categorie } = await params;
  const decoded = decodeURIComponent(categorie);
  const title = `Articles ${decoded} — Blog Aïssa BELKOUSSA`;
  const description = `Tous les articles sur le thème ${decoded}. Guides pratiques, études de cas et retours d'expérience par Aïssa BELKOUSSA, consultant IA à Albi.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blog/categorie/${categorie}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/categorie/${categorie}`,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  const categories = getAllCategories("fr");
  return categories.map((cat) => ({ categorie: cat }));
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
