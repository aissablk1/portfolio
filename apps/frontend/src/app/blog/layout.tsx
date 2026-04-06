import type { Metadata } from "next";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Blog — Articles experts IA & automatisation pour PME",
  description: "Articles experts sur l'automatisation, les sites web et l'IA pour artisans BTP et PME. Par Aïssa BELKOUSSA, consultant IA à Albi.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Blog — Aïssa BELKOUSSA",
    description: "Articles experts : automatisation, sites web, IA pour artisans et PME.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
