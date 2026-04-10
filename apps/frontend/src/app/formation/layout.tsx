import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema, formationSchemas } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Formations IA & Automatisation — Aïssa BELKOUSSA",
  description:
    "Formations pratiques IA et automatisation pour PME et équipes. 1 jour dès 490 €/personne, finançable OPCO à 100%. Chaque participant repart avec des outils opérationnels.",
  keywords: [
    "formation IA Albi",
    "formation automatisation PME",
    "formation intelligence artificielle Tarn",
    "formation OPCO IA",
    "formation IA entreprise Occitanie",
    "formation automatisation n8n Make",
    "formation prompt engineering",
  ],
  alternates: {
    canonical: `${siteUrl}/formation`,
  },
  openGraph: {
    title: "Formations IA & Automatisation — Aïssa BELKOUSSA",
    description:
      "Formations pratiques IA et automatisation pour PME. Dès 490 €/pers, finançable OPCO à 100%.",
    url: `${siteUrl}/formation`,
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Faut-il des prérequis techniques pour suivre une formation IA ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aucun prérequis technique. Les formations sont conçues pour des professionnels non-techniques. Il suffit de savoir utiliser un ordinateur et un navigateur web.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la durée des formations ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IA Pratique dure 1 jour (7h). Automatiser son business dure 2 jours (14h). La formation sur-mesure s'étend sur 3 à 5 jours selon les besoins identifiés lors de l'audit préalable.",
      },
    },
    {
      "@type": "Question",
      name: "Où se déroulent les formations ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En inter-entreprise : dans nos locaux à Albi (Tarn). En intra-entreprise : directement dans vos locaux, partout en Occitanie. Les formations à distance sont également possibles en visioconférence.",
      },
    },
    {
      "@type": "Question",
      name: "Les formations sont-elles certifiantes ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une attestation de formation est délivrée à chaque participant. Les formations sont éligibles au financement OPCO. Elles ne délivrent pas de certification diplômante, mais chaque participant repart avec des livrables concrets et opérationnels.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de participants par session ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En inter-entreprise : 4 à 8 participants par session pour garantir un accompagnement personnalisé. En intra-entreprise : jusqu'à 12 participants. Au-delà, nous recommandons de dédoubler les sessions.",
      },
    },
  ],
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Formations", url: `${siteUrl}/formation` },
]);

export default function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={[...formationSchemas, faqSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Formations" }]} />
      {children}
    </>
  );
}
