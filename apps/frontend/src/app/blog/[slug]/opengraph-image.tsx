import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

export const alt = "Article blog — Aïssa BELKOUSSA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "fr") || getPostBySlug(slug, "en");

  const title = post?.title ?? slug;
  const category = post?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#fdfdfd",
          backgroundImage:
            "linear-gradient(#eeeeee 1px, transparent 1px), linear-gradient(90deg, #eeeeee 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          padding: "60px 80px",
        }}
      >
        {/* Category badge */}
        {category && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#1a1a1a",
              }}
            />
            <span
              style={{
                color: "#1a1a1a",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            color: "#1a1a1a",
            fontSize: title.length > 60 ? "42px" : "52px",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 1.15,
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Bottom — domain */}
        <span
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#999999",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          aissabelkoussa.fr/blog
        </span>
      </div>
    ),
    { ...size }
  );
}
