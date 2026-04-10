"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Scale,
  CheckCircle2,
  XCircle,
  Users,
  User,
  Building2,
} from "lucide-react";

const comparisonRows = [
  {
    critere: "Prix journée",
    freelance: "400 – 900 €",
    agence: "1 200 – 3 000 €",
    avantage: "freelance",
  },
  {
    critere: "Délai de livraison",
    freelance: "5 – 15 jours",
    agence: "2 – 6 mois",
    avantage: "freelance",
  },
  {
    critere: "Interlocuteur unique",
    freelance: "Oui — le développeur qui code",
    agence: "Non — chef de projet intermédiaire",
    avantage: "freelance",
  },
  {
    critere: "Flexibilité",
    freelance: "Très haute — ajustement en direct",
    agence: "Faible — processus rigides, avenants",
    avantage: "freelance",
  },
  {
    critere: "Expertise spécialisée",
    freelance: "Profonde sur son domaine",
    agence: "Large mais souvent généraliste",
    avantage: "egal",
  },
  {
    critere: "Maintenance",
    freelance: "Incluse ou forfait clair",
    agence: "Tickets de support payants",
    avantage: "freelance",
  },
  {
    critere: "Connaissance locale",
    freelance: "Tissu économique, aides régionales",
    agence: "Rarement — approche nationale",
    avantage: "freelance",
  },
  {
    critere: "Engagement",
    freelance: "Zéro engagement, résultat garanti",
    agence: "Contrat long, engagement minimum",
    avantage: "freelance",
  },
];

const quandFreelance = [
  {
    titre: "Projet ciblé avec budget maîtrisé",
    desc: "Vous avez besoin d'un site web, d'un chatbot ou d'une automatisation — pas d'une refonte globale. Le freelance livre vite et à prix fixe.",
  },
  {
    titre: "Besoin d'un interlocuteur technique direct",
    desc: "Vous voulez parler au développeur, pas à un commercial. Les décisions se prennent en 1 appel, pas en 3 réunions.",
  },
  {
    titre: "Accompagnement sur la durée sans abonnement",
    desc: "Maintenance incluse, évolutions à la carte, pas de contrat annuel. Vous payez uniquement ce que vous consommez.",
  },
];

const quandAgence = [
  {
    titre: "Projet multi-disciplinaire à grande échelle",
    desc: "Vous avez besoin d'une équipe complète (design, dev, SEO, vidéo, rédaction) sur un projet de 6 mois ou plus.",
  },
  {
    titre: "Campagne publicitaire ou branding complet",
    desc: "Identité visuelle, stratégie de marque, campagne média — ces projets nécessitent plusieurs spécialistes simultanément.",
  },
  {
    titre: "Besoin de remplacement garanti en cas d'absence",
    desc: "L'agence assure une continuité de service grâce à son effectif, même si un membre de l'équipe est indisponible.",
  },
];

export default function FreelanceVsAgencePage() {
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
              <Scale size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Comparatif honnête
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Freelance vs Agence
              <br />
              <span className="text-site-text-light">
                le comparatif honnête
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              Pas de parti pris. Les deux modèles ont des forces. Ce comparatif
              vous aide à choisir en fonction de votre projet, votre budget et
              vos priorités.
            </motion.p>
          </div>
        </section>

        {/* ── Tableau comparatif ───────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              8 critères comparés
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-site-text">
                    <th className="text-left py-3 pr-4 font-display font-medium text-xs uppercase tracking-wider text-site-text-light">
                      Critère
                    </th>
                    <th className="text-left py-3 px-4 font-display font-medium text-xs uppercase tracking-wider text-site-accent">
                      <span className="flex items-center gap-2">
                        <User size={12} />
                        Freelance
                      </span>
                    </th>
                    <th className="text-left py-3 pl-4 font-display font-medium text-xs uppercase tracking-wider text-site-text-light">
                      <span className="flex items-center gap-2">
                        <Building2 size={12} />
                        Agence
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.critere}
                      className="border-b border-site-border"
                    >
                      <td className="py-3 pr-4 font-medium">{row.critere}</td>
                      <td className="py-3 px-4 text-site-accent font-medium">
                        {row.freelance}
                      </td>
                      <td className="py-3 pl-4 text-site-text-light">
                        {row.agence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Quand choisir un freelance ───────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Quand choisir un freelance
            </h2>
            <p className="text-site-text-light mb-8 max-w-xl">
              Le freelance est le meilleur choix quand vous cherchez rapidité,
              expertise ciblée et contact direct.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quandFreelance.map((item, i) => (
                <motion.div
                  key={item.titre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-accent/30 bg-site-accent/[0.02]"
                >
                  <CheckCircle2
                    size={16}
                    className="text-site-accent mb-4"
                  />
                  <h3 className="text-base font-display font-medium mb-2">
                    {item.titre}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quand choisir une agence ─────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Quand choisir une agence
            </h2>
            <p className="text-site-text-light mb-8 max-w-xl">
              L'agence convient mieux aux projets nécessitant plusieurs
              spécialités simultanées ou une continuité garantie.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quandAgence.map((item, i) => (
                <motion.div
                  key={item.titre}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border"
                >
                  <Users
                    size={16}
                    className="text-site-text-light mb-4"
                  />
                  <h3 className="text-base font-display font-medium mb-2">
                    {item.titre}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Vous hésitez encore ? Parlons-en.
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Échange gratuit de 30 minutes. Je vous aide à déterminer si un
                freelance ou une agence correspond mieux à votre situation.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  Découvrir mes offres
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
