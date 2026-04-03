import { getAllPosts } from "@/lib/blog";
import BlogListingClient from "@/components/blog/BlogListingClient";

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListingClient posts={posts} />;
}
