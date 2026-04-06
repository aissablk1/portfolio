import { getAllPosts } from "@/lib/blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

export default function BlogPage() {
  const postsFr = getAllPosts("fr");
  const postsEn = getAllPosts("en");
  return <BlogListingClient postsFr={postsFr} postsEn={postsEn} />;
}
