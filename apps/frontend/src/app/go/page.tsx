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

      {/* ── Urgency banner ─────────────────────────────────────── */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-site-text text-site-bg text-center py-2">
        <p className="text-[11px] font-bold uppercase tracking-widest">
          Avril 2026 — 2 créneaux projet disponibles
        </p>
      </div>

      <main>
        {/* ── 1. Hook ──────────────────────────────────────────────── */}
        <section className="pt-48 pb-32 px-container">
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
              {/* ── Situation 1 : Autonome (decoy) ────────────────── */}
              <motion.div {...fade(0.1)}>
                <div className="group border border-site-border rounded-2xl p-8 md:p-12 opacity-90 hover:opacity-100 hover:border-site-text/20 transition-all duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50">
                          01
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light">
                          Autonome — Projet seul
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        J'ai une équipe technique.<br className="hidden md:block" />
                        Je veux juste le livrable.
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Votre système livré clé en main. Vous gérez la suite — documentation
                        technique renforcée et formation autonomie incluses.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "1 système livré (site, automation ou dashboard)",
                          "Brief + maquette validée",
                          "Licence d'utilisation exclusive",
                          "Documentation technique renforcée",
                          "Formation autonomie (2h)",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-text-light">
                            <Check size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[200px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">3 900 €</div>
                      <p className="text-xs text-site-text-light/50 mt-1 mb-6">
                        Paiement unique. Aucune maintenance incluse.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        Choisir l'autonomie
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Situation 2 : Accélérateur (recommended) ──────── */}
              <motion.div {...fade(0.2)}>
                <div className="relative group border-2 border-site-text rounded-2xl p-8 md:p-12 bg-site-text text-site-bg">
                  <div className="absolute -top-3 left-8">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-site-bg text-site-text px-4 py-1 rounded-full">
                      Recommandé
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/30">
                          02
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/60">
                          Accélérateur — Projet + maintenance
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        Je veux un système qui tourne.<br className="hidden md:block" />
                        Sans m'en occuper.
                      </h3>

                      <p className="text-site-bg/60 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Votre système livré et maintenu. 3 mois de maintenance offerts —
                        monitoring 24/7, bugs sous 48h, mises à jour sécurité. Vous ne touchez
                        à rien.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "1 système livré clé en main",
                          "Licence d'utilisation exclusive",
                          "3 mois monitoring + support offerts",
                          "Corrections de bugs sous 48h",
                          "Mises à jour sécurité continues",
                          "Rapport mensuel de performance",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-bg/60">
                            <Check size={13} className="mt-0.5 shrink-0 text-site-bg" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[200px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">2 900 €</div>
                      <p className="text-xs text-site-bg/50 mt-1">
                        puis 490 €/mois après 3 mois offerts
                      </p>
                      <p className="inline-block mt-2 mb-6 text-[10px] font-bold bg-site-bg/10 text-site-bg px-3 py-1 rounded-full">
                        3 mois offerts (valeur 1 470 €)
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

              {/* ── Situation 3 : Partenaire ──────────────────────── */}
              <motion.div {...fade(0.3)}>
                <div className="group border border-site-border rounded-2xl p-8 md:p-12 hover:border-site-text/20 transition-all duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50">
                          03
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light">
                          Partenaire — Système + évolution continue
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        J'ai besoin d'un partenaire technique.<br className="hidden md:block" />
                        Qui fait évoluer mon système.
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        Votre infrastructure complète — site, IA, données — avec un partenaire
                        technique dédié. Évolutions mensuelles, support prioritaire, stratégie
                        digitale.
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {[
                          "Système multi-briques (site + IA + data)",
                          "Intégration IA sur-mesure",
                          "3 mois évolution + support Premium offerts",
                          "Évolutions 10h/mois + support 24h",
                          "Réunion stratégique mensuelle",
                          "Accès prioritaire nouvelles technos IA",
                        ].map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-site-text-light">
                            <Check size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:text-right md:min-w-[200px]">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter">6 900 €</div>
                      <p className="text-xs text-site-text-light/50 mt-1">
                        puis 1 900 €/mois après 3 mois offerts
                      </p>
                      <p className="inline-block mt-2 mb-6 text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        3 mois offerts (valeur 5 700 €)
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        Devenir partenaire
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
                par mail et relancer les clients. Accélérateur à 2 900 € : site pro + prise de RDV
                en ligne + devis automatisé + 3 mois de maintenance inclus. Le système tourne dès J+10.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { value: "10h", label: "libérées chaque semaine" },
                { value: "800 €", label: "de valeur récupérée par semaine" },
                { value: "4 sem.", label: "pour rentabiliser l'Accélérateur" },
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

            <p className="text-site-text-light text-sm mb-8 max-w-2xl">
              Les 3 premiers mois sont inclus dans votre projet (plans Accélérateur et
              Partenaire). Ensuite, la maintenance continue sans engagement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Essentiel",
                  price: "490 €",
                  desc: "Monitoring 24/7, bugs sous 48h, MAJ sécurité, rapport mensuel. Annuel : 368 €/mois (3 mois offerts).",
                },
                {
                  name: "Premium",
                  price: "1 900 €",
                  desc: "Essentiel + évolutions 10h/mois, support 24h, suivi stratégique mensuel. Annuel : 1 425 €/mois.",
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
