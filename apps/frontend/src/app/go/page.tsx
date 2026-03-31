"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default function GoPage() {
  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
  });

  return (
    <div className="bg-site-bg min-h-screen">
      {/* ── Topbar minimal ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-site-bg/80 backdrop-blur-xl border-b border-site-border">
        <div className="max-w-6xl mx-auto px-container flex items-center justify-between h-14">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Aïssa Belkoussa
          </Link>
          <Link
            href="/contact"
            className="text-[11px] font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
          >
            Prendre contact
          </Link>
        </div>
      </header>

      <main>
        {/* ── 1. Hook ──────────────────────────────────────────────── */}
        <section className="pt-40 pb-32 px-container">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade()}>
              <p className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-8">
                Offres & Résultats
              </p>
              <h1 className="text-fluid-display tracking-tighter uppercase leading-[1.05] mb-8">
                Votre système devrait
                <br />
                déjà tourner.
              </h1>
              <p className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed">
                Vous perdez du temps sur des tâches qui devraient être automatisées.
                Votre site ne reflète pas la qualité de votre travail.
                Vos process sont manuels, vos données dispersées.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 2. Trois situations (pas trois "offres") ─────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-6xl mx-auto">
            <motion.p
              {...fade()}
              className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-16"
            >
              Dans quelle situation êtes-vous ?
            </motion.p>

            <div className="space-y-4">
              {/* ── Situation 1 : Sprint ───────────────────────────── */}
              <motion.div {...fade(0.1)}>
                <div className="group border border-site-border rounded-2xl p-8 md:p-12 hover:border-site-text/20 transition-all duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50">
                          01
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light">
                          Sprint
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        J'ai besoin d'un outil.<br className="hidden md:block" />
                        Rapidement. Maintenant.
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Un site, un dashboard, une automatisation — un seul livrable, en production
                        en 5 à 10 jours ouvrés. Idéal pour tester une collaboration ou débloquer
                        un point précis.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "1 système livré clé en main",
                          "Brief + maquette validée avant dev",
                          "Licence d'utilisation exclusive",
                          "Déploiement en production inclus",
                          "Support 15 jours post-livraison",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-text-light">
                            <Check size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[180px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">2 900 €</div>
                      <p className="text-xs text-site-text-light/50 mt-1 mb-6">
                        Prix final. Paiement en 2 fois.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        Réserver mon sprint
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Situation 2 : Build (highlighted) ─────────────── */}
              <motion.div {...fade(0.2)}>
                <div className="relative group border-2 border-site-text rounded-2xl p-8 md:p-12 bg-site-text text-site-bg">
                  <div className="absolute -top-3 left-8">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-site-bg text-site-text px-4 py-1 rounded-full">
                      Le plus demandé
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/30">
                          02
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/60">
                          Build
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        J'ai besoin d'un système complet.<br className="hidden md:block" />
                        Pas juste un site.
                      </h3>

                      <p className="text-site-bg/60 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Votre infrastructure complète — site, automatisations IA, données —
                        connectée et opérationnelle. Le format qui transforme votre activité,
                        pas juste votre vitrine.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "Système multi-briques connecté",
                          "Intégration IA sur-mesure",
                          "Architecture scalable documentée",
                          "Formation à vos outils",
                          "1 mois de support post-livraison",
                          "Accès prioritaire évolutions futures",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-bg/60">
                            <Check size={13} className="mt-0.5 shrink-0 text-site-bg" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[180px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">6 900 €</div>
                      <p className="text-xs text-site-bg/30 mt-1 mb-6">
                        Prix final. Paiement en 3 fois.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-site-bg text-site-text px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
                      >
                        Lancer mon système
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Situation 3 : Écosystème ──────────────────────── */}
              <motion.div {...fade(0.3)}>
                <div className="group border border-site-border rounded-2xl p-8 md:p-12 hover:border-site-text/20 transition-all duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50">
                          03
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light">
                          Écosystème
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        J'ai besoin d'un partenaire technique.<br className="hidden md:block" />
                        Sur la durée.
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Votre CTO externalisé. Architecture, IA, données, ops — je deviens
                        votre référent technique permanent. Engagement 3 mois minimum,
                        ROI mesurable dès le premier mois.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "Architecture complète A à Z",
                          "Agents IA autonomes intégrés",
                          "Dashboards temps réel",
                          "Tunnels de conversion automatisés",
                          "Maintenance et évolution continues",
                          "Interlocuteur unique, zéro intermédiaire",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-text-light">
                            <Check size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[180px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">Sur mesure</div>
                      <p className="text-xs text-site-text-light/50 mt-1 mb-6">
                        3 mois min. Paiement mensuel.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        Échanger 30 min
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 3. ROI — preuve concrète ──────────────────────────────── */}
        <section className="bg-site-text text-site-bg rounded-3xl md:rounded-[3rem] mx-2 md:mx-4 px-container py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fade()}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-site-bg/30 mb-8">
                Exemple concret
              </p>
              <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                Entreprise de plomberie, 8 salariés
              </h2>
              <p className="text-site-bg/50 text-base md:text-lg max-w-2xl leading-relaxed mb-12">
                Le patron perd 10 heures par semaine à répondre au téléphone, envoyer des devis
                par mail et relancer les clients. Sprint à 2 900 € : site pro + prise de RDV
                en ligne + devis automatisé. Le système tourne dès J+10.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { value: "10h", label: "libérées chaque semaine" },
                { value: "800 €", label: "de valeur récupérée par semaine" },
                { value: "4 sem.", label: "pour rentabiliser le Sprint" },
              ].map((stat, i) => (
                <motion.div key={i} {...fade(i * 0.1)} className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-medium tracking-tighter mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-site-bg/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Après la livraison ────────────────────────────────── */}
        <section className="px-container py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fade()} className="mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-6">
                Après la livraison
              </p>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                Un système ne se lance pas. Il se maintient.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Essentiel",
                  price: "490 €",
                  desc: "Monitoring 24/7, bugs sous 48h, mises à jour sécurité, rapport mensuel de performance.",
                },
                {
                  name: "Pro",
                  price: "1 900 €",
                  desc: "Essentiel + évolutions mensuelles (10h), support prioritaire 24h, suivi stratégique, accès aux dernières technologies IA.",
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  {...fade(i * 0.1)}
                  className="border border-site-border rounded-2xl p-8 md:p-10 hover:border-site-text/20 transition-colors"
                >
                  <h4 className="text-sm font-bold uppercase tracking-widest text-site-text-light mb-4">
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl md:text-4xl font-medium tracking-tighter">{plan.price}</span>
                    <span className="text-site-text-light text-sm">/mois</span>
                  </div>
                  <p className="text-sm text-site-text-light leading-relaxed">{plan.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Garanties ─────────────────────────────────────────── */}
        <section className="px-container pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-site-border pt-16">
              {[
                {
                  title: "Prix final garanti",
                  desc: "Pas de devis surprise. Le prix annoncé est le prix payé. Si je dépasse, c'est pour moi.",
                },
                {
                  title: "Satisfait ou retravaillé",
                  desc: "Si le livrable ne correspond pas au brief validé, je retravaille sans frais supplémentaires.",
                },
                {
                  title: "Licence exclusive incluse",
                  desc: "Accès complet au code, documentation, déploiement — vous exploitez librement votre système. Zéro dépendance.",
                },
              ].map((g, i) => (
                <motion.div key={i} {...fade(i * 0.1)}>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{g.title}</h4>
                  <p className="text-sm text-site-text-light leading-relaxed">{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. CTA final ─────────────────────────────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fade()}>
              <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                Prêt à lancer votre système ?
              </h2>
              <p className="text-site-text-light mb-10 max-w-lg mx-auto">
                30 minutes suffisent pour cadrer votre projet.
                Gratuit, zéro engagement.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-site-text text-site-bg px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
              >
                Réserver un échange
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer minimal ────────────────────────────────────────── */}
      <footer className="border-t border-site-border py-8 px-container">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-site-text-light">
          <span>Aïssa Belkoussa — Albi, France</span>
          <Link href="/" className="hover:text-site-text transition-colors">
            aissabelkoussa.fr
          </Link>
        </div>
      </footer>
    </div>
  );
}
