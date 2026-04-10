import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Stack technique — Technologies maîtrisées",
  description:
    "React 19, Next.js 16, TypeScript, Supabase, n8n, OpenAI, Claude, Shopify, Vercel — les technologies que je maîtrise pour livrer des projets performants et maintenables.",
  alternates: {
    canonical: `${siteUrl}/stack`,
  },
  openGraph: {
    title: "Stack technique — Technologies maîtrisées",
    description:
      "Frontend, backend, IA, e-commerce, infrastructure — toutes les technologies utilisées par Aïssa BELKOUSSA.",
    url: `${siteUrl}/stack`,
    type: "website",
  },
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Stack technique", url: `${siteUrl}/stack` },
]);

export default function StackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[breadcrumb]} />
      {children}
    </>
  );
}
