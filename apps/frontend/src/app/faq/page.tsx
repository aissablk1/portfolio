"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

/* ── Données FAQ par catégorie ─────────────────────────────────────── */

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    title: "Services & expertise",
    items: [
      {
        q: "Qu'est-ce qu'un architecte de systèmes digitaux ?",
        a: "Un architecte de systèmes digitaux conçoit et déploie des infrastructures numériques cohérentes : automatisations, workflows, dashboards et intégrations. Contrairement à un consultant, il code et livre des systèmes opérationnels — pas des recommandations.",
      },
      {
        q: "Quelle différence entre un développeur freelance et un architecte de systèmes ?",
        a: "Un développeur freelance exécute des tâches techniques définies. Un architecte de systèmes part du besoin business pour concevoir l'architecture complète — choix des outils, structure des données, flux d'automatisation — puis la déploie. C'est la différence entre construire une pièce et concevoir une maison.",
      },
      {
        q: "Quelle est la différence entre un site sur-mesure et un template ?",
        a: "Un template est conçu pour tout le monde, donc pour personne en particulier. Un site sur-mesure est construit sur une architecture adaptée aux besoins spécifiques du projet : performances, identité de marque, intégrations métier, scalabilité. Le coût initial est plus élevé, le retour sur investissement aussi.",
      },
    ],
  },
  {
    title: "Prix & financement",
    items: [
      {
        q: "Combien coûte un système digital sur-mesure ?",
        a: "Les systèmes sont proposés en 3 formules : Autonome à 3 900 EUR (projet seul), Accélérateur à 2 900 EUR (projet + 3 mois maintenance), et Partenaire à 6 900 EUR (système complet + évolution continue). Les prix sont forfaitaires et garantis.",
      },
      {
        q: "Comment financer le projet avec mon OPCO ?",
        a: "Je vous aide à monter le dossier. Pour les entreprises de moins de 50 salariés, la formation peut être prise en charge à 100%. Les aides OCCAL (70%, plafond 23 000 EUR) et Pass Occitanie (50%, plafond 10 000 EUR) sont aussi mobilisables pour les projets numériques.",
      },
      {
        q: "Le prix inclut-il la maintenance ?",
        a: "Les formules Accélérateur et Partenaire incluent 3 mois de maintenance. La formule Autonome ne comprend pas de maintenance. Après les 3 mois offerts, la maintenance est sans engagement — vous pouvez arrêter à tout moment.",
      },
    ],
  },
  {
    title: "Processus & délais",
    items: [
      {
        q: "Comment se passe un projet de A à Z ?",
        a: "Étape 1 : diagnostic gratuit (30 min) pour comprendre vos besoins. Étape 2 : proposition avec périmètre, prix et délai fixés. Étape 3 : développement en 5 à 10 jours ouvrés avec points réguliers. Étape 4 : livraison, formation et mise en production. Étape 5 : maintenance et évolutions.",
      },
      {
        q: "Combien de temps faut-il pour voir des résultats ?",
        a: "Les systèmes sont livrés en 5 à 10 jours ouvrés. Les premiers résultats (leads, temps gagné, visibilité) arrivent sous 2 à 4 semaines. Le ROI complet est généralement atteint en 4 à 6 semaines.",
      },
      {
        q: "Que se passe-t-il si j'arrête la maintenance ?",
        a: "Votre site reste en ligne et fonctionnel. Mais sans mises à jour régulières, les performances SEO se dégradent, les failles de sécurité ne sont plus corrigées, et votre système ne s'adapte plus. En moyenne, un site non maintenu perd 20-35% de son trafic organique en 6 mois.",
      },
    ],
  },
  {
    title: "Formations",
    items: [
      {
        q: "Proposez-vous des formations ?",
        a: "Oui. IA Pratique (1 jour, 490 EUR/personne), Automatiser son business (2 jours, 890 EUR/personne), et Sur-mesure (3-5 jours, 800 EUR/jour). Toutes sont finançables OPCO jusqu'à 100%.",
      },
      {
        q: "Faut-il des compétences techniques pour suivre la formation ?",
        a: "Non. Les formations sont conçues pour des dirigeants et opérationnels non techniques. On part de vos cas concrets, pas de théorie abstraite. Vous repartez avec des outils configurés et opérationnels.",
      },
    ],
  },
  {
    title: "SEO & visibilité IA",
    items: [
      {
        q: "C'est quoi le GEO (Generative Engine Optimization) ?",
        a: "Le GEO optimise votre contenu pour être cité par les IA conversationnelles (ChatGPT, Perplexity, Gemini). Contrairement au SEO classique qui vise Google, le GEO structure vos données pour que les modèles de langage vous recommandent comme source fiable.",
      },
      {
        q: "Comment apparaître dans les réponses de ChatGPT ?",
        a: "Il faut des données structurées Schema.org complètes, du contenu expert avec des citations vérifiables, une autorité de domaine forte et des signaux de confiance (avis, mentions, backlinks). Mon approche combine SEO classique et GEO pour maximiser votre visibilité sur tous les canaux.",
      },
    ],
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent mb-4 block"
            >
              FAQ
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Questions fréquentes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Tout ce que vous devez savoir sur mes services, mes prix et ma
              façon de travailler. Une question qui n'est pas ici ?{" "}
              <Link
                href="/contact"
                className="text-site-accent hover:underline"
              >
                Contactez-moi
              </Link>
              .
            </motion.p>
          </div>
        </section>

        {/* ── Catégories FAQ ───────────────────────────── */}
        {categories.map((category, catIndex) => (
          <section key={category.title} className="px-6 mb-12">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                className="text-xl md:text-2xl font-display font-medium tracking-tight mb-4"
              >
                {category.title}
              </motion.h2>

              <div className="space-y-2">
                {category.items.map((faq, i) => {
                  const key = `${catIndex}-${i}`;
                  const isOpen = openItems[key] ?? false;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border border-site-border rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-medium">{faq.q}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            "text-site-text-light shrink-0 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-sm text-site-text-light leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="px-6 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Votre question n'est pas ici ?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Prenez 2 minutes pour un diagnostic gratuit ou contactez-moi
                directement. Réponse sous 24h.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  Diagnostic gratuit (2 min)
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:border-white/60 transition-colors"
                >
                  Me contacter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
