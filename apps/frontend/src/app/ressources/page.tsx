"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileSearch,
  BookOpen,
  Compass,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/utils/cn";

const outils = [
  {
    icon: Sparkles,
    title: "Diagnostic digital gratuit",
    desc: "Évaluez votre maturité digitale en 2 minutes. Résultat immédiat avec recommandations personnalisées.",
    href: "/diagnostic",
    badge: "Gratuit",
  },
  {
    icon: FileSearch,
    title: "Audit digital complet",
    desc: "Rapport détaillé sur votre présence en ligne : SEO, performance, accessibilité, opportunités d'amélioration.",
    href: "/audit",
    badge: "47 €",
  },
];

const guides = [
  {
    title: "SEO vs GEO : ce qui change en 2026",
    desc: "Comprendre la différence entre référencement classique et optimisation pour les IA génératives.",
    href: "/blog/seo-vs-geo-visibilite-ia-2026",
  },
  {
    title: "Combien coûte un chatbot IA",
    desc: "Le vrai prix d'un chatbot IA en 2026 : comparatif SaaS vs sur-mesure, ROI et pièges à éviter.",
    href: "/blog/combien-coute-chatbot-ia-2026",
  },
  {
    title: "Consultant IA à Albi : pourquoi un expert local",
    desc: "Ce qu'un consultant IA local apporte concrètement aux PME et artisans du Tarn.",
    href: "/blog/consultant-ia-albi-pourquoi-faire-appel-expert-local",
  },
  {
    title: "Artisan BTP : votre fiche Google Maps",
    desc: "Guide pas-à-pas pour créer et optimiser votre fiche Google Business Profile en tant qu'artisan.",
    href: "/blog/artisan-btp-fiche-google-maps-2026",
  },
];

export default function RessourcesPage() {
  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <BookOpen size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Ressources
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Ressources gratuites
              <br />
              <span className="text-site-text-light">
                pour PME et artisans
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Guides pratiques, outils de diagnostic et articles de fond pour
              digitaliser votre activité sans jargon technique. Tout est
              accessible, actionnable et gratuit.
            </motion.p>
          </div>
        </section>

        {/* ── Outils gratuits ──────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Compass size={14} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-site-accent">
                  Outils
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
                Évaluez votre situation digitale
              </h2>
              <p className="text-site-text-light mb-10 max-w-xl">
                Deux outils concrets pour savoir où vous en êtes — et ce que
                vous pouvez améliorer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outils.map((o, i) => (
                <motion.div
                  key={o.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={o.href}
                    className="group block p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <o.icon
                        size={20}
                        className="text-site-accent"
                      />
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                          o.badge === "Gratuit"
                            ? "bg-site-accent/10 text-site-accent"
                            : "bg-site-border text-site-text-light"
                        )}
                      >
                        {o.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-display font-medium mb-2">
                      {o.title}
                    </h3>
                    <p className="text-sm text-site-text-light leading-relaxed mb-4">
                      {o.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-site-accent group-hover:gap-3 transition-all">
                      Accéder
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guides thématiques ───────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={14} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-site-accent">
                  Guides thématiques
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
                Articles les plus lus
              </h2>
              <p className="text-site-text-light mb-10 max-w-xl">
                Les sujets qui comptent pour les PME et artisans en 2026 :
                visibilité, automatisation, IA.
              </p>
            </motion.div>

            <div className="space-y-3">
              {guides.map((g, i) => (
                <motion.div
                  key={g.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={g.href}
                    className="group flex items-start gap-6 p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                  >
                    <span className="text-xs font-bold text-site-accent mt-1 shrink-0">
                      0{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-display font-medium mb-1 group-hover:text-site-accent transition-colors">
                        {g.title}
                      </h3>
                      <p className="text-sm text-site-text-light leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-site-text-light group-hover:text-site-accent shrink-0 mt-1 transition-colors"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-6 text-center"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
              >
                Voir tous les articles
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Vous voulez aller plus loin ?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Un accompagnement personnalisé pour digitaliser votre activité,
                ou une formation pour monter en compétences sur l'IA.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  <MessageSquare size={16} />
                  Me contacter
                </Link>
                <Link
                  href="/formation"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:border-white/60 transition-colors"
                >
                  <GraduationCap size={16} />
                  Voir les formations
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
