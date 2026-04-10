"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Layers,
  Gauge,
  Wrench,
  TreePine,
  MonitorSmartphone,
  Server,
  Bot,
  ShoppingCart,
  Cloud,
  PenTool,
} from "lucide-react";
import { cn } from "@/utils/cn";

const categories = [
  {
    name: "Frontend",
    icon: MonitorSmartphone,
    techs: [
      "React 19",
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    name: "Backend",
    icon: Server,
    techs: ["Node.js", "Express", "Supabase", "PostgreSQL"],
  },
  {
    name: "IA & Automatisation",
    icon: Bot,
    techs: ["n8n", "Make", "OpenAI API", "Claude API", "LangChain"],
  },
  {
    name: "E-commerce",
    icon: ShoppingCart,
    techs: ["Shopify (Hydrogen, GraphQL)", "Stripe"],
  },
  {
    name: "Infrastructure",
    icon: Cloud,
    techs: ["Vercel", "Render", "Cloudflare", "Docker"],
  },
  {
    name: "Design",
    icon: PenTool,
    techs: ["Figma", "Pencil"],
  },
];

const criteria = [
  {
    icon: Gauge,
    title: "Performance",
    description:
      "Chaque technologie est choisie pour sa rapidité d'exécution et son impact sur l'expérience utilisateur. Temps de chargement, réactivité, fluidité — aucun compromis.",
  },
  {
    icon: Wrench,
    title: "Maintenabilité",
    description:
      "Un code lisible, typé, testé. Des outils avec une documentation solide et une communauté active. Pas de dette technique accumulée.",
  },
  {
    icon: TreePine,
    title: "Écosystème",
    description:
      "Des technologies avec un écosystème riche : plugins, intégrations, mises à jour régulières. Pas de technologie orpheline ou en fin de vie.",
  },
];

export default function StackPage() {
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
              <Layers size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Stack technique
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Les technologies
              <br />
              <span className="text-site-text-light">que je maîtrise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Une stack moderne, éprouvée et performante. Chaque outil est choisi
              pour sa fiabilité, sa communauté et sa capacité à livrer des
              résultats concrets.
            </motion.p>
          </div>
        </section>

        {/* -- Grille de technologies -------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors",
                    cat.name === "IA & Automatisation" &&
                      "md:col-span-2"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon size={18} className="text-site-accent" />
                    <h3 className="text-sm font-display font-medium uppercase tracking-wider">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.techs.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block px-3 py-1.5 text-sm font-medium rounded-lg bg-site-accent/[0.06] text-site-text border border-site-accent/10 hover:border-site-accent/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Pourquoi ces choix ------------------------------------ */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Pourquoi ces choix
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Trois critères guident chaque décision technique.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {criteria.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border"
                >
                  <c.icon size={20} className="text-site-accent mb-4" />
                  <h3 className="text-base font-display font-medium mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {c.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -- CTA --------------------------------------------------- */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-site-text-light mb-6">
              Besoin d'une expertise technique sur l'une de ces technologies ?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
            >
              Discuter de votre projet
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
