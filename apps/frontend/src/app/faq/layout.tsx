import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { createBreadcrumbSchema } from "@/lib/schemas";

const siteUrl = "https://www.aissabelkoussa.fr";

export const metadata: Metadata = {
  title: "Questions fréquentes — Aïssa BELKOUSSA",
  description:
    "Réponses aux questions sur les systèmes digitaux, l'automatisation IA, les prix, la maintenance et les formations. Consultant IA à Albi.",
  alternates: { canonical: `${siteUrl}/faq` },
  openGraph: {
    title: "Questions fréquentes — Aïssa BELKOUSSA",
    description:
      "Réponses aux questions sur les systèmes digitaux, l'automatisation IA, les prix, la maintenance et les formations. Consultant IA à Albi.",
    url: `${siteUrl}/faq`,
    type: "website",
  },
};

const faqItems = [
  {
    question: "Qu'est-ce qu'un architecte de systèmes digitaux ?",
    answer:
      "Un architecte de systèmes digitaux conçoit et déploie des infrastructures numériques cohérentes : automatisations, workflows, dashboards et intégrations. Contrairement à un consultant, il code et livre des systèmes opérationnels — pas des recommandations.",
  },
  {
    question:
      "Quelle différence entre un développeur freelance et un architecte de systèmes ?",
    answer:
      "Un développeur freelance exécute des tâches techniques définies. Un architecte de systèmes part du besoin business pour concevoir l'architecture complète — choix des outils, structure des données, flux d'automatisation — puis la déploie. C'est la différence entre construire une pièce et concevoir une maison.",
  },
  {
    question:
      "Quelle est la différence entre un site sur-mesure et un template ?",
    answer:
      "Un template est conçu pour tout le monde, donc pour personne en particulier. Un site sur-mesure est construit sur une architecture adaptée aux besoins spécifiques du projet : performances, identité de marque, intégrations métier, scalabilité. Le coût initial est plus élevé, le retour sur investissement aussi.",
  },
  {
    question: "Combien coûte un système digital sur-mesure ?",
    answer:
      "Les systèmes sont proposés en 3 formules : Autonome à 3 900 EUR (projet seul), Accélérateur à 2 900 EUR (projet + 3 mois maintenance), et Partenaire à 6 900 EUR (système complet + évolution continue). Les prix sont forfaitaires et garantis.",
  },
  {
    question: "Comment financer le projet avec mon OPCO ?",
    answer:
      "Je vous aide à monter le dossier. Pour les entreprises de moins de 50 salariés, la formation peut être prise en charge à 100%. Les aides OCCAL (70%, plafond 23 000 EUR) et Pass Occitanie (50%, plafond 10 000 EUR) sont aussi mobilisables pour les projets numériques.",
  },
  {
    question: "Le prix inclut-il la maintenance ?",
    answer:
      "Les formules Accélérateur et Partenaire incluent 3 mois de maintenance. La formule Autonome ne comprend pas de maintenance. Après les 3 mois offerts, la maintenance est sans engagement — vous pouvez arrêter à tout moment.",
  },
  {
    question: "Comment se passe un projet de A à Z ?",
    answer:
      "Étape 1 : diagnostic gratuit (30 min) pour comprendre vos besoins. Étape 2 : proposition avec périmètre, prix et délai fixés. Étape 3 : développement en 5 à 10 jours ouvrés avec points réguliers. Étape 4 : livraison, formation et mise en production. Étape 5 : maintenance et évolutions.",
  },
  {
    question: "Combien de temps faut-il pour voir des résultats ?",
    answer:
      "Les systèmes sont livrés en 5 à 10 jours ouvrés. Les premiers résultats (leads, temps gagné, visibilité) arrivent sous 2 à 4 semaines. Le ROI complet est généralement atteint en 4 à 6 semaines.",
  },
  {
    question: "Que se passe-t-il si j'arrête la maintenance ?",
    answer:
      "Votre site reste en ligne et fonctionnel. Mais sans mises à jour régulières, les performances SEO se dégradent, les failles de sécurité ne sont plus corrigées, et votre système ne s'adapte plus. En moyenne, un site non maintenu perd 20-35% de son trafic organique en 6 mois.",
  },
  {
    question: "Proposez-vous des formations ?",
    answer:
      "Oui. IA Pratique (1 jour, 490 EUR/personne), Automatiser son business (2 jours, 890 EUR/personne), et Sur-mesure (3-5 jours, 800 EUR/jour). Toutes sont finançables OPCO jusqu'à 100%.",
  },
  {
    question:
      "Faut-il des compétences techniques pour suivre la formation ?",
    answer:
      "Non. Les formations sont conçues pour des dirigeants et opérationnels non techniques. On part de vos cas concrets, pas de théorie abstraite. Vous repartez avec des outils configurés et opérationnels.",
  },
  {
    question: "C'est quoi le GEO (Generative Engine Optimization) ?",
    answer:
      "Le GEO optimise votre contenu pour être cité par les IA conversationnelles (ChatGPT, Perplexity, Gemini). Contrairement au SEO classique qui vise Google, le GEO structure vos données pour que les modèles de langage vous recommandent comme source fiable.",
  },
  {
    question: "Comment apparaître dans les réponses de ChatGPT ?",
    answer:
      "Il faut des données structurées Schema.org complètes, du contenu expert avec des citations vérifiables, une autorité de domaine forte et des signaux de confiance (avis, mentions, backlinks). Mon approche combine SEO classique et GEO pour maximiser votre visibilité sur tous les canaux.",
  },
];

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumb = createBreadcrumbSchema([
  { name: "Accueil", url: siteUrl },
  { name: "Questions fréquentes", url: `${siteUrl}/faq` },
]);

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={[faqPageSchema, breadcrumb]} />
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "FAQ" }]} />
      {children}
    </>
  );
}
