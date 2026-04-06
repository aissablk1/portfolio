import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import ArticlePageClient from "@/components/blog/ArticlePageClient";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

function renderMdx(source: string) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        },
      }}
    />
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const postFr = getPostBySlug(slug, "fr");
  const postEn = getPostBySlug(slug, "en");

  if (!postFr && !postEn) notFound();

  const relatedFr = postFr ? getRelatedPosts(slug, postFr.tags, 3, "fr") : [];
  const relatedEn = postEn ? getRelatedPosts(slug, postEn.tags, 3, "en") : [];

  return (
    <ArticlePageClient
      postFr={postFr}
      postEn={postEn}
      relatedFr={relatedFr}
      relatedEn={relatedEn}
      mdxFr={postFr ? renderMdx(postFr.content) : null}
      mdxEn={postEn ? renderMdx(postEn.content) : null}
    />
  );
}
