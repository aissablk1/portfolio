"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  Users,
  BadgeEuro,
  Building2,
  Network,
} from "lucide-react";

const partners = [
  {
    name: "Alexandre BRIHIEZ",
    company: "Admin-IA",
    type: "SaaS auto-écoles",
    description:
      "Mon partenaire stratégique. Il fait du SaaS vertical, je fais du sur-mesure. Nos expertises se complètent parfaitement pour couvrir tous les besoins digitaux des PME.",
    icon: Building2,
  },
  {
    name: "DYNABUY",
    company: "Réseau d'affaires",
    type: "Albi / Tarn",
    description:
      "Mise en relation avec les entrepreneurs locaux. Un écosystème de confiance pour développer les synergies entre professionnels du Tarn et d'Occitanie.",
    icon: Network,
  },
];

const referralBenefits = [
  "Commission versée pour chaque recommandation convertie",
  "Paiement sous 30 jours après signature du contrat",
  "Suivi transparent : vous savez où en est chaque recommandation",
  "Aucun engagement — recommandez quand vous voulez",
];

export default function PartenairesPage() {
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
              <Handshake size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Écosystème
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Un réseau de partenaires
              <br />
              <span className="text-site-text-light">complémentaires</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Je m'entoure de professionnels dont les compétences complètent les
              miennes. Ensemble, on couvre plus de besoins, plus vite, avec plus
              de qualité.
            </motion.p>
          </div>
        </section>

        {/* -- Partenaires actuels ----------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Partenaires actuels
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Des collaborations solides, fondées sur la confiance et la
              complémentarité.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                >
                  <p.icon size={20} className="text-site-accent mb-4" />
                  <h3 className="text-base font-display font-medium mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-site-accent font-medium mb-1">
                    {p.company} — {p.type}
                  </p>
                  <p className="text-sm text-site-text-light leading-relaxed mt-3">
                    {p.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Devenir partenaire ------------------------------------ */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-10 rounded-2xl border border-site-border">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-site-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  Collaboration
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
                Devenir partenaire
              </h2>
              <p className="text-site-text-light leading-relaxed max-w-xl mb-8">
                Vous êtes consultant, agence, ou éditeur de logiciel ? Vos
                clients ont besoin d'automatisation, d'IA ou d'un site
                performant ? Travaillons ensemble.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
              >
                Proposer un partenariat
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* -- Apporteur d'affaires --------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-10 rounded-2xl bg-site-text text-white">
              <div className="flex items-center gap-2 mb-4">
                <BadgeEuro size={14} className="text-site-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  Programme apporteur d'affaires
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-medium mb-4">
                Recommandez, touchez une commission
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xl">
                Vous connaissez une entreprise qui a besoin d'un site, d'un
                chatbot ou d'automatisation ? Recommandez-moi et recevez une
                commission sur chaque projet signé.
              </p>

              <ul className="space-y-3 mb-8">
                {referralBenefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-site-accent mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
              >
                Devenir apporteur d'affaires
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* -- CTA final -------------------------------------------- */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-site-text-light mb-6">
              Une question sur le programme partenaire ou apporteur d'affaires ?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
            >
              Me contacter
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
