import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { createArticleSchema, createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "fr");
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "fr");

  if (!post) return <>{children}</>;

  const articleSchema = createArticleSchema({
    title: post.title,
    slug: post.slug,
    description: post.description,
    date: post.date,
    updatedAt: post.updatedAt,
    author: post.author,
    image: post.image || "/assets/images/AISSABELKOUSSA.png",
    tags: post.tags,
  });

  const breadcrumb = createBreadcrumbSchema([
    { name: "Accueil", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumb]} />
      {children}
    </>
  );
}
