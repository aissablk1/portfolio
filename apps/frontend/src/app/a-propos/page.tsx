"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Wrench,
  Shield,
  Code2,
  Cpu,
  Eye,
  Award,
  BookOpen,
  TrendingUp,
  Linkedin,
  Github,
  Send,
} from "lucide-react";
import { cn } from "@/utils/cn";

const stats = [
  { value: "93", label: "Projets livrés", icon: Briefcase },
  { value: "4+", label: "Années d'expérience", icon: Clock },
  { value: "10j", label: "Délai moyen", icon: TrendingUp },
  { value: "3 mois", label: "Maintenance offerts", icon: Shield },
];

const philosophie = [
  {
    icon: Cpu,
    title: "System-first, business-driven",
    desc: "Je pars du besoin métier, pas de la tech. Chaque système est conçu pour résoudre un problème concret et mesurable.",
  },
  {
    icon: Code2,
    title: "Builder, pas consultant",
    desc: "Je code et je livre. Pas de slides, pas de réunions interminables. Un système qui tourne, livré clé en main.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    desc: "Prix fixe, pas de surprise, satisfait ou retravaillé. Vous savez exactement ce que vous payez et ce que vous recevez.",
  },
];

const technologies = [
  { name: "React 19", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "GSAP", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "Supabase", category: "Backend" },
  { name: "n8n", category: "Automatisation" },
  { name: "Make", category: "Automatisation" },
  { name: "Shopify", category: "E-commerce" },
  { name: "Vercel", category: "Infra" },
];

export default function AProposPage() {
  const { dict } = useLanguage();

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-start">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-2 mb-6"
                >
                  <MapPin size={14} className="text-site-accent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                    Albi, Tarn — Occitanie
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-4"
                >
                  Aïssa BELKOUSSA
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-site-text-light font-display mb-6"
                >
                  Architecte de systèmes digitaux
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-base text-site-text-light leading-relaxed max-w-xl"
                >
                  Développeur fullstack et consultant IA freelance. Je conçois
                  et livre des systèmes digitaux complets pour les PME et
                  artisans — automatisation, chatbots IA, sites web, dashboards.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative aspect-square overflow-hidden rounded-3xl grayscale hover:grayscale-0 transition-all duration-700"
              >
                <Image
                  src="/assets/images/AISSABELKOUSSA.png"
                  alt="Aïssa Belkoussa — Développeur fullstack et consultant IA freelance à Albi"
                  fill
                  sizes="280px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-tr from-site-accent/20 to-transparent mix-blend-overlay" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Mon parcours ─────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
                Mon parcours
              </h2>

              <div className="space-y-6 text-base text-site-text-light leading-relaxed max-w-2xl">
                <p>
                  Pas d'héritage, pas de filet. Autodidacte, builder. J'ai
                  appris à coder en résolvant des problèmes concrets, pas dans
                  une salle de classe.
                </p>
                <p>
                  <strong className="text-site-text">4 ans d'expérience, 93 projets livrés.</strong>{" "}
                  Des sites vitrines aux systèmes d'automatisation complets, en
                  passant par les chatbots IA et les dashboards décisionnels.
                </p>
                <p>
                  Basé à Albi, je travaille avec des entreprises de toute
                  l'Occitanie et en remote à l'échelle nationale. Je connais le
                  tissu économique du Tarn, les aides régionales, et je me
                  déplace pour des réunions en personne.
                </p>
                <p>
                  <strong className="text-site-text">Stack technique :</strong>{" "}
                  React 19, Next.js, TypeScript, Node.js, n8n, IA générative
                  (GPT, Claude, modèles open source). Chaque brique est choisie
                  pour sa fiabilité et sa maintenabilité.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Ma philosophie ───────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Ma philosophie
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Trois piliers qui guident chaque projet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {philosophie.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                >
                  <p.icon size={20} className="text-site-accent mb-4" />
                  <h3 className="text-base font-display font-medium mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Chiffres clés ────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-10">
              Chiffres clés
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border text-center"
                >
                  <s.icon
                    size={20}
                    className="text-site-accent mx-auto mb-3"
                  />
                  <div className="text-3xl font-display font-medium tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-site-text-light uppercase tracking-wider mt-2">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technologies ─────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Technologies
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Les outils que j'utilise au quotidien pour livrer des systèmes
              fiables et performants.
            </p>

            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <motion.span
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-site-border text-sm font-medium hover:border-site-accent/40 hover:text-site-accent transition-colors"
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Certifications & formation ───────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              Certifications & formation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-site-border"
              >
                <Award size={20} className="text-site-accent mb-4" />
                <h3 className="text-base font-display font-medium mb-2">
                  Autodidacte
                </h3>
                <p className="text-sm text-site-text-light leading-relaxed">
                  Formé par la pratique et les projets réels. Chaque projet
                  livré est une certification concrète.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border border-site-border"
              >
                <BookOpen size={20} className="text-site-accent mb-4" />
                <h3 className="text-base font-display font-medium mb-2">
                  Formation continue
                </h3>
                <p className="text-sm text-site-text-light leading-relaxed">
                  Apprentissage permanent des nouvelles technologies, frameworks
                  et bonnes pratiques du développement web et de l'IA.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-site-border"
              >
                <TrendingUp size={20} className="text-site-accent mb-4" />
                <h3 className="text-base font-display font-medium mb-2">
                  Veille techno active
                </h3>
                <p className="text-sm text-site-text-light leading-relaxed">
                  Suivi quotidien des évolutions IA, automatisation et
                  développement web. Adoption rapide des outils qui apportent
                  une valeur réelle.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Me contacter ─────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Travaillons ensemble
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Un projet en tête ? Un besoin d'automatisation ? Parlons-en.
                Premier échange gratuit, zéro engagement.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
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

              <div className="flex items-center justify-center gap-6">
                <a
                  href="https://www.linkedin.com/in/aissabelkoussa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://github.com/aissablk1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://t.me/investwithaissa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Send size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
