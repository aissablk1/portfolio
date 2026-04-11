import { getAllPosts, getAllCategories } from "@/lib/blog";
import CategoriesIndexClient from "@/components/blog/CategoriesIndexClient";

export const revalidate = 3600;

export default function CategoriesIndexPage() {
  const postsFr = getAllPosts("fr");
  const postsEn = getAllPosts("en");

  const countsFr = new Map<string, number>();
  for (const p of postsFr) {
    if (!p.category) continue;
    countsFr.set(p.category, (countsFr.get(p.category) ?? 0) + 1);
  }

  const countsEn = new Map<string, number>();
  for (const p of postsEn) {
    if (!p.category) continue;
    countsEn.set(p.category, (countsEn.get(p.category) ?? 0) + 1);
  }

  const categoriesFr = getAllCategories("fr").map((name) => ({
    name,
    count: countsFr.get(name) ?? 0,
  }));
  const categoriesEn = getAllCategories("en").map((name) => ({
    name,
    count: countsEn.get(name) ?? 0,
  }));

  return <CategoriesIndexClient categoriesFr={categoriesFr} categoriesEn={categoriesEn} />;
}
