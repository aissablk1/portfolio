"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BadgeEuro,
} from "lucide-react";

const comparisonRows = [
  {
    critere: "Coût initial",
    template: "300 – 800 €",
    surMesure: "2 500 – 6 900 €",
    note: "Le template semble moins cher, mais les coûts cachés (plugins, personnalisation, maintenance) s'accumulent.",
  },
  {
    critere: "Délai de livraison",
    template: "1 – 2 semaines",
    surMesure: "5 – 15 jours",
    note: "Un sur-mesure bien cadré est livré aussi vite qu'un template, sans les compromis.",
  },
  {
    critere: "Personnalisation",
    template: "Limitée aux options du thème",
    surMesure: "Illimitée — conçu pour votre activité",
    note: "Le template vous force dans un moule. Le sur-mesure s'adapte à votre parcours client.",
  },
  {
    critere: "SEO & performance",
    template: "Moyen — plugins lourds, code générique",
    surMesure: "Optimisé — code léger, données structurées, Core Web Vitals",
    note: "Google favorise les sites rapides et bien structurés. Un sur-mesure a 2 à 3 positions d'avance en SEO.",
  },
  {
    critere: "Évolutivité",
    template: "Dépendant des mises à jour du thème",
    surMesure: "Évolutions libres, sans contrainte technique",
    note: "Avec un template, une mise à jour peut casser votre site. Un sur-mesure évolue à votre rythme.",
  },
  {
    critere: "Maintenance",
    template: "30 – 80 €/mois (hébergement + plugins + sécurité)",
    surMesure: "Incluse 3 mois, puis forfait clair",
    note: "Le coût réel d'un template WordPress inclut hébergement, plugins premium, sécurité et sauvegardes.",
  },
];

const roiTemplate = {
  label: "Template WordPress",
  coutInitial: 500,
  maintenanceMois: 50,
  coutAn1: 500 + 50 * 12,
  leadsEstimes: "2 – 5 / mois",
  conversionEstimee: "1 – 2 %",
};

const roiSurMesure = {
  label: "Site sur-mesure",
  coutInitial: 2900,
  maintenanceMois: 0,
  coutAn1: 2900,
  leadsEstimes: "8 – 15 / mois",
  conversionEstimee: "3 – 5 %",
};

export default function SurMesureVsTemplatePage() {
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
              <Layers size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Guide comparatif 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Site sur-mesure vs Template
              <br />
              <span className="text-site-text-light">
                quel choix en 2026 ?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Le template paraît moins cher. Mais le vrai coût se mesure sur 12
              mois, en incluant maintenance, leads générés et positionnement
              Google. Voici les chiffres.
            </motion.p>
          </div>
        </section>

        {/* ── Tableau comparatif ───────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              6 critères comparés
            </h2>

            <div className="space-y-4">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={row.critere}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl border border-site-border"
                >
                  <h3 className="text-base font-display font-medium mb-4">
                    {row.critere}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-start gap-2">
                      <XCircle
                        size={14}
                        className="text-red-500/70 mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-site-text-light block mb-1">
                          Template
                        </span>
                        <span className="text-sm text-site-text-light">
                          {row.template}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-site-accent mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-site-accent block mb-1">
                          Sur-mesure
                        </span>
                        <span className="text-sm font-medium">
                          {row.surMesure}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-site-text-light italic">
                    {row.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Exemples concrets ────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Exemple concret : artisan BTP dans le Tarn
            </h2>
            <p className="text-site-text-light mb-8 max-w-xl">
              Un plombier à Albi veut un site pour générer des demandes de devis
              en ligne. Comparons les deux options sur 12 mois.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Template */}
              <div className="p-6 rounded-2xl border border-site-border">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light mb-3">
                  Option A — Template WordPress
                </span>
                <div className="text-3xl font-display font-medium tracking-tight mb-1">
                  {roiTemplate.coutInitial}{" "}
                  <span className="text-lg text-site-text-light">€</span>
                </div>
                <p className="text-xs text-site-text-light mb-4">
                  Coût initial (thème premium + installation)
                </p>
                <ul className="space-y-2 text-sm text-site-text-light">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/70 mt-0.5">+</span>
                    Maintenance : {roiTemplate.maintenanceMois} €/mois
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500/70 mt-0.5">=</span>
                    <span className="font-medium text-site-text">
                      Coût année 1 : {roiTemplate.coutAn1} €
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">~</span>
                    Leads estimés : {roiTemplate.leadsEstimes}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">~</span>
                    Taux de conversion : {roiTemplate.conversionEstimee}
                  </li>
                </ul>
              </div>

              {/* Sur-mesure */}
              <div className="p-6 rounded-2xl border border-site-accent bg-site-accent/[0.02]">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent mb-3">
                  Option B — Sur-mesure (Accélérateur)
                </span>
                <div className="text-3xl font-display font-medium tracking-tight mb-1">
                  {roiSurMesure.coutInitial}{" "}
                  <span className="text-lg text-site-text-light">€</span>
                </div>
                <p className="text-xs text-site-text-light mb-4">
                  Tout inclus — 3 mois maintenance offerts
                </p>
                <ul className="space-y-2 text-sm text-site-text-light">
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-site-accent mt-0.5 shrink-0"
                    />
                    Maintenance : 0 € (3 mois inclus)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-site-accent mt-0.5 shrink-0"
                    />
                    <span className="font-medium text-site-text">
                      Coût année 1 : {roiSurMesure.coutAn1} €
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp
                      size={14}
                      className="text-site-accent mt-0.5 shrink-0"
                    />
                    Leads estimés : {roiSurMesure.leadsEstimes}
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp
                      size={14}
                      className="text-site-accent mt-0.5 shrink-0"
                    />
                    Taux de conversion : {roiSurMesure.conversionEstimee}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROI comparé sur 12 mois ──────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-10 rounded-2xl bg-site-text text-white">
              <div className="flex items-center gap-2 mb-4">
                <BadgeEuro size={14} className="text-site-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  ROI comparé sur 12 mois
                </span>
              </div>
              <h3 className="text-xl font-display font-medium mb-6">
                Le sur-mesure coûte 2x plus cher au départ, mais génère 3 à 4x
                plus de leads
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-white/50">
                    1 100 €
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                    Coût an 1 — Template
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    2 900 €
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                    Coût an 1 — Sur-mesure
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-white/50">
                    24 – 60
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                    Leads an 1 — Template
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    96 – 180
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                    Leads an 1 — Sur-mesure
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/40 mt-6 text-center">
                Un seul chantier signé à 3 000 € rembourse l'investissement
                sur-mesure. Le template nécessite 3 chantiers pour le même
                résultat.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Prêt à investir dans un site qui rapporte ?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Diagnostic gratuit en 2 minutes. On évalue ensemble si un site
                sur-mesure est rentable pour votre activité.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  Voir les offres
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:border-white/60 transition-colors"
                >
                  Diagnostic gratuit
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
