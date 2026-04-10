"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  Clock,
  BadgeEuro,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";

const secteurs = [
  "BTP",
  "Comptabilité",
  "Immobilier",
  "Commerce",
  "Courtage",
  "Autre",
];

const offres = [
  {
    name: "Starter",
    price: 1500,
    label: "1 500 €",
    desc: "1 automatisation clé en main",
    features: [
      "Chatbot OU emails OU RDV",
      "Livré en 5 jours",
      "Formation 1h incluse",
    ],
  },
  {
    name: "Accélérateur",
    price: 2900,
    label: "2 900 €",
    desc: "Système complet + maintenance",
    features: [
      "1 système livré clé en main",
      "3 mois maintenance offerts",
      "Bugs corrigés sous 48h",
      "Rapport mensuel",
    ],
  },
  {
    name: "Partenaire",
    price: 6900,
    label: "6 900 €",
    desc: "Infrastructure IA + partenaire dédié",
    features: [
      "Système multi-briques (site + IA + data)",
      "3 mois évolution + support Premium",
      "Évolutions 10h/mois",
      "Réunion stratégique mensuelle",
    ],
  },
];

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

export default function CalculateurROIPage() {
  const [secteur, setSecteur] = useState("BTP");
  const [heures, setHeures] = useState(15);
  const [coutHoraire, setCoutHoraire] = useState(35);

  const resultats = useMemo(() => {
    const coutAnnuelPerdu = heures * coutHoraire * 47;
    const heuresRecuperees = heures * 0.6;
    const economieAnnuelle = heuresRecuperees * coutHoraire * 47;
    const offreRecommandee =
      heures < 10 ? offres[0] : heures <= 20 ? offres[1] : offres[2];
    const semainesPourRentabiliser =
      heuresRecuperees * coutHoraire > 0
        ? Math.ceil(offreRecommandee.price / (heuresRecuperees * coutHoraire))
        : 0;
    const gainNetAnnee1 = economieAnnuelle - offreRecommandee.price;

    return {
      coutAnnuelPerdu,
      heuresRecuperees,
      economieAnnuelle,
      offreRecommandee,
      semainesPourRentabiliser,
      gainNetAnnee1,
    };
  }, [heures, coutHoraire]);

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
              <Calculator size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Calculateur interactif
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Combien l'automatisation IA
              <br />
              <span className="text-site-text-light">
                vous rapporte-t-elle ?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Renseignez 3 informations et découvrez instantanément votre retour
              sur investissement. Aucune inscription requise.
            </motion.p>
          </div>
        </section>

        {/* ── Formulaire ───────────────────────────────── */}
        <section className="px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Secteur */}
              <div className="p-6 rounded-2xl border border-site-border">
                <label className="block text-xs font-bold uppercase tracking-wider text-site-text-light mb-3">
                  Secteur d'activité
                </label>
                <select
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  className="w-full bg-site-bg border border-site-border rounded-lg px-4 py-3 text-sm font-medium text-site-text focus:outline-none focus:border-site-accent transition-colors"
                >
                  {secteurs.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Heures perdues */}
              <div className="p-6 rounded-2xl border border-site-border">
                <label className="block text-xs font-bold uppercase tracking-wider text-site-text-light mb-3">
                  Heures/semaine perdues
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={heures}
                    onChange={(e) => setHeures(Number(e.target.value))}
                    className="flex-1 accent-site-accent"
                  />
                  <span className="text-2xl font-display font-medium w-14 text-right tabular-nums">
                    {heures}h
                  </span>
                </div>
                <p className="text-[10px] text-site-text-light mt-2">
                  Tâches répétitives : emails, devis, relances, saisie...
                </p>
              </div>

              {/* Coût horaire */}
              <div className="p-6 rounded-2xl border border-site-border">
                <label className="block text-xs font-bold uppercase tracking-wider text-site-text-light mb-3">
                  Coût horaire chargé
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={coutHoraire}
                    onChange={(e) =>
                      setCoutHoraire(
                        Math.max(10, Math.min(200, Number(e.target.value)))
                      )
                    }
                    className="w-full bg-site-bg border border-site-border rounded-lg px-4 py-3 text-sm font-medium text-site-text focus:outline-none focus:border-site-accent transition-colors tabular-nums"
                  />
                  <span className="text-sm text-site-text-light font-medium">
                    €/h
                  </span>
                </div>
                <p className="text-[10px] text-site-text-light mt-2">
                  Salaire brut chargé ou TJM ÷ 7h
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Résultats en temps réel ──────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
                Vos résultats
                <span className="text-site-text-light">
                  {" "}
                  — en temps réel
                </span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 rounded-2xl border border-site-border">
                  <Clock
                    size={16}
                    className="text-red-500/70 mb-3"
                  />
                  <div className="text-2xl font-display font-medium tracking-tight text-red-500/70">
                    {formatNumber(resultats.coutAnnuelPerdu)} €
                  </div>
                  <div className="text-[10px] text-site-text-light uppercase tracking-wider mt-1">
                    Coût annuel du temps perdu
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-site-border">
                  <TrendingUp
                    size={16}
                    className="text-site-accent mb-3"
                  />
                  <div className="text-2xl font-display font-medium tracking-tight text-site-accent">
                    {formatNumber(resultats.economieAnnuelle)} €
                  </div>
                  <div className="text-[10px] text-site-text-light uppercase tracking-wider mt-1">
                    Économie avec automatisation
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-site-border">
                  <Zap
                    size={16}
                    className="text-site-accent mb-3"
                  />
                  <div className="text-2xl font-display font-medium tracking-tight text-site-accent">
                    {resultats.semainesPourRentabiliser} sem.
                  </div>
                  <div className="text-[10px] text-site-text-light uppercase tracking-wider mt-1">
                    Pour rentabiliser l'investissement
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-site-border">
                  <BadgeEuro
                    size={16}
                    className="text-emerald-600 mb-3"
                  />
                  <div
                    className={cn(
                      "text-2xl font-display font-medium tracking-tight",
                      resultats.gainNetAnnee1 >= 0
                        ? "text-emerald-600"
                        : "text-red-500/70"
                    )}
                  >
                    {resultats.gainNetAnnee1 >= 0 ? "+" : ""}
                    {formatNumber(resultats.gainNetAnnee1)} €
                  </div>
                  <div className="text-[10px] text-site-text-light uppercase tracking-wider mt-1">
                    Gain net année 1
                  </div>
                </div>
              </div>

              <p className="text-xs text-site-text-light">
                Hypothèse : 60 % des heures répétitives automatisées, 47
                semaines travaillées/an. Secteur sélectionné : {secteur}.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Recommandation ───────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              Votre recommandation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offres.map((offre) => {
                const isRecommanded =
                  offre.name === resultats.offreRecommandee.name;
                return (
                  <div
                    key={offre.name}
                    className={cn(
                      "p-6 rounded-2xl border transition-colors",
                      isRecommanded
                        ? "border-site-accent bg-site-accent/[0.02]"
                        : "border-site-border opacity-60"
                    )}
                  >
                    {isRecommanded && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent mb-3">
                        Recommandé pour vous
                      </span>
                    )}
                    <h3 className="text-lg font-display font-medium">
                      {offre.name}
                    </h3>
                    <p className="text-xs text-site-text-light mb-4">
                      {offre.desc}
                    </p>
                    <div className="text-3xl font-display font-medium tracking-tight mb-1">
                      {offre.label.replace(" €", "")}{" "}
                      <span className="text-lg text-site-text-light">€</span>
                    </div>
                    <p className="text-[10px] text-site-text-light mb-4">
                      Paiement unique — licence incluse
                    </p>
                    <ul className="space-y-2">
                      {offre.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-site-text-light"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-site-accent mt-0.5 shrink-0"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-site-text-light mt-4">
              {heures < 10
                ? "Moins de 10h/semaine de tâches répétitives → le Starter suffit pour automatiser l'essentiel."
                : heures <= 20
                  ? "Entre 10 et 20h/semaine → l'Accélérateur couvre un système complet avec 3 mois de maintenance."
                  : "Plus de 20h/semaine → le Partenaire offre une infrastructure IA multi-briques avec support premium."}
            </p>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Passez du calcul à l'action
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Diagnostic gratuit en 2 minutes. On identifie ensemble les
                automatisations les plus rentables pour votre activité.
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
                  href="/services"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:border-white/60 transition-colors"
                >
                  Voir les offres
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
