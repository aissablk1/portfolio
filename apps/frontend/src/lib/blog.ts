import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

type Lang = "fr" | "en";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  image: string;
  imageAlt: string;
  published: boolean;
  featured: boolean;
  readingTime: string;
  content: string;
}

/**
 * Resolve the file path for a given slug and language.
 * Priority: {slug}.{lang}.mdx → {slug}.fr.mdx (fallback) → {slug}.mdx (legacy)
 */
function resolveFile(slug: string, lang: Lang): string | null {
  const candidates = [
    path.join(BLOG_DIR, `${slug}.${lang}.mdx`),
    path.join(BLOG_DIR, `${slug}.fr.mdx`),
    path.join(BLOG_DIR, `${slug}.mdx`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Get unique slugs from all blog files.
 * Strips .fr.mdx, .en.mdx, and .mdx extensions to deduplicate.
 */
function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const slugs = new Set<string>();
  for (const file of files) {
    slugs.add(file.replace(/\.(fr|en)\.mdx$/, "").replace(/\.mdx$/, ""));
  }
  return Array.from(slugs);
}

function isScheduledForNow(data: Record<string, unknown>): boolean {
  const publishAt = data.publishAt as string | undefined;
  if (!publishAt) return true;
  return new Date(publishAt) <= new Date();
}

function parsePost(slug: string, filePath: string): BlogPost | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  if (!data.published) return null;
  if (!isScheduledForNow(data)) return null;
  return { slug, ...data, readingTime: readingTime(content).text, content } as BlogPost;
}

export function getAllPosts(lang: Lang = "fr"): Omit<BlogPost, "content">[] {
  return getAllSlugs()
    .map((slug) => {
      const filePath = resolveFile(slug, lang);
      if (!filePath) return null;
      const post = parsePost(slug, filePath);
      if (!post) return null;
      const { content: _, ...rest } = post;
      return rest;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as Omit<BlogPost, "content">[];
}

export function getPostBySlug(slug: string, lang: Lang = "fr"): BlogPost | null {
  const filePath = resolveFile(slug, lang);
  if (!filePath) return null;
  return parsePost(slug, filePath);
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3, lang: Lang = "fr"): Omit<BlogPost, "content">[] {
  return getAllPosts(lang)
    .filter((p) => p.slug !== currentSlug && p.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

export function getAllCategories(lang: Lang = "fr"): string[] {
  const posts = getAllPosts(lang);
  const categories = new Set<string>();
  for (const post of posts) {
    if (post.category) categories.add(post.category);
  }
  return Array.from(categories).sort();
}
