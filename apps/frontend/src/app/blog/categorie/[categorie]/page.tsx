import { getAllPosts, getAllCategories } from "@/lib/blog";
import CategoryPageClient from "@/components/blog/CategoryPageClient";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  const categories = getAllCategories("fr");
  return categories.map((cat) => ({ categorie: cat }));
}

export default async function CategoryPage({ params }: { params: Promise<{ categorie: string }> }) {
  const { categorie } = await params;
  const decoded = decodeURIComponent(categorie);

  const allFr = getAllPosts("fr");
  const allEn = getAllPosts("en");

  const postsFr = allFr.filter((p) => p.category.toLowerCase() === decoded.toLowerCase());
  const postsEn = allEn.filter((p) => p.category.toLowerCase() === decoded.toLowerCase());

  return <CategoryPageClient postsFr={postsFr} postsEn={postsEn} category={decoded} />;
}
