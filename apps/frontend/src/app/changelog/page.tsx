"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Newspaper, Sparkles } from "lucide-react";

const entries = [
  {
    date: "10 avril 2026",
    description:
      "53 pages, 4 articles niches DYNABUY, header îlot flottant, témoignages clients",
  },
  {
    date: "9 avril 2026",
    description:
      "Landing page /consultant-ia-albi, SEO/GEO optimization, GA4+GTM, post LinkedIn GEO",
  },
  {
    date: "8 avril 2026",
    description: "FAQ accordion redesign, CSS grid transitions",
  },
  {
    date: "7 avril 2026",
    description:
      "15 articles blog FR+EN, LinkedIn posts automatisés",
  },
  {
    date: "3 avril 2026",
    description: "Stratégie offres v2, restructuration pricing",
  },
  {
    date: "25 mars 2026",
    description: "Refonte complète du portfolio",
  },
];

export default function ChangelogPage() {
  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* -- Hero -------------------------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <Newspaper size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Journal de bord
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Ce site évolue
              <br />
              <span className="text-site-text-light">chaque semaine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Nouvelles pages, articles, optimisations techniques,
              améliorations design — tout est documenté ici, en toute
              transparence.
            </motion.p>

            {/* Badge dernière mise à jour */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-site-accent/[0.06] border border-site-accent/10 text-sm font-medium text-site-accent">
                <Sparkles size={14} />
                Dernière mise à jour : {entries[0].date}
              </span>
            </motion.div>
          </div>
        </section>

        {/* -- Timeline ---------------------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-site-border" />

              <div className="space-y-6">
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.date}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative pl-8"
                  >
                    {/* Point sur la timeline */}
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-site-accent bg-site-bg" />

                    <div className="p-5 rounded-xl border border-site-border hover:border-site-accent/30 transition-colors">
                      <time className="block text-xs font-bold uppercase tracking-wider text-site-accent mb-2">
                        {entry.date}
                      </time>
                      <p className="text-sm text-site-text leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -- CTA --------------------------------------------------- */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-site-text-light mb-6">
              Envie de suivre l'évolution du projet en détail ?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
            >
              Me contacter
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
