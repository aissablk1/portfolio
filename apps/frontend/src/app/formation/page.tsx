"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Zap,
  Settings,
  Wrench,
  CheckCircle2,
  Landmark,
  ChevronDown,
  Users,
  Clock,
  FileCheck,
  Target,
  BookOpen,
} from "lucide-react";
import { cn } from "@/utils/cn";

const formations = [
  {
    icon: GraduationCap,
    name: "IA Pratique",
    duration: "1 jour (7h)",
    priceInter: "490",
    priceIntra: "1 500",
    labelInter: "par personne (inter)",
    labelIntra: "par groupe (intra)",
    desc: "Les fondamentaux de l'IA appliqués à votre métier.",
    features: [
      "Prompt engineering : rédiger des instructions efficaces",
      "Cas d'usage métier : ventes, admin, relation client",
      "Kit IA personnalisé : chaque participant repart avec ses prompts",
      "Atelier pratique sur vos propres documents",
    ],
    highlight: false,
  },
  {
    icon: Zap,
    name: "Automatiser son business",
    duration: "2 jours (14h)",
    priceInter: "890",
    priceIntra: "2 800",
    labelInter: "par personne (inter)",
    labelIntra: "par groupe (intra)",
    desc: "Automatisez vos tâches répétitives avec n8n et Make.",
    features: [
      "Emails, CRM, facturation : tout tourne sans vous",
      "Relances automatiques clients et prospects",
      "Outils n8n / Make : créez vos propres workflows",
      "2 à 3 automatisations déployées pendant la formation",
    ],
    highlight: true,
  },
  {
    icon: Settings,
    name: "Sur-mesure",
    duration: "3 à 5 jours",
    priceInter: "800",
    priceIntra: null,
    labelInter: "par jour",
    labelIntra: null,
    desc: "Programme adapté à vos besoins spécifiques.",
    features: [
      "Audit préalable de vos processus",
      "Programme 100% personnalisé",
      "Suivi post-formation pendant 3 mois",
      "Transformation IA structurée pour votre équipe",
    ],
    highlight: false,
  },
];

const differentiators = [
  {
    icon: Wrench,
    title: "Zéro théorie inutile",
    desc: "Chaque minute est consacrée à la pratique. Vos équipes travaillent sur leurs vrais fichiers, leurs vrais processus.",
  },
  {
    icon: FileCheck,
    title: "Audit personnalisé inclus",
    desc: "Avant la formation, chaque participant reçoit un audit de ses outils et processus actuels.",
  },
  {
    icon: Target,
    title: "Plan d'action 30 jours",
    desc: "Chaque participant repart avec un plan d'action concret : quoi automatiser, dans quel ordre, avec quels outils.",
  },
  {
    icon: BookOpen,
    title: "Kit de prompts IA",
    desc: "Une bibliothèque de prompts testés et validés pour votre secteur d'activité, prêts à l'emploi.",
  },
];

const faqs = [
  {
    q: "Faut-il des prérequis techniques pour suivre une formation IA ?",
    a: "Aucun prérequis technique. Les formations sont conçues pour des professionnels non-techniques. Il suffit de savoir utiliser un ordinateur et un navigateur web.",
  },
  {
    q: "Quelle est la durée des formations ?",
    a: "IA Pratique dure 1 jour (7h). Automatiser son business dure 2 jours (14h). La formation sur-mesure s'étend sur 3 à 5 jours selon les besoins identifiés lors de l'audit préalable.",
  },
  {
    q: "Où se déroulent les formations ?",
    a: "En inter-entreprise : dans nos locaux à Albi (Tarn). En intra-entreprise : directement dans vos locaux, partout en Occitanie. Les formations à distance sont également possibles en visioconférence.",
  },
  {
    q: "Les formations sont-elles certifiantes ?",
    a: "Une attestation de formation est délivrée à chaque participant. Les formations sont éligibles au financement OPCO. Elles ne délivrent pas de certification diplômante, mais chaque participant repart avec des livrables concrets et opérationnels.",
  },
  {
    q: "Combien de participants par session ?",
    a: "En inter-entreprise : 4 à 8 participants par session pour garantir un accompagnement personnalisé. En intra-entreprise : jusqu'à 12 participants. Au-delà, nous recommandons de dédoubler les sessions.",
  },
];

export default function FormationPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* -- Hero ------------------------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <GraduationCap size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Formations professionnelles
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Formations IA & Automatisation
              <br />
              <span className="text-site-text-light">
                vos équipes repartent opérationnelles
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl mb-10"
            >
              Pas de slides interminables. Chaque participant travaille sur ses
              propres outils et repart avec des automatisations fonctionnelles,
              un kit de prompts IA et un plan d'action 30 jours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
              >
                Demander un programme
                <ArrowRight size={16} />
              </Link>
              <a
                href="#formations"
                className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
              >
                Voir les formations
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-site-border"
            >
              <div>
                <div className="text-3xl font-display font-medium tracking-tight">
                  490 €
                </div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  à partir de / personne
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-medium tracking-tight">
                  100%
                </div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  finançable OPCO
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-medium tracking-tight">
                  1-5j
                </div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  durée des formations
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-medium tracking-tight">
                  4-12
                </div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  participants / session
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* -- 3 formations disponibles ----------------------------- */}
        <section id="formations" className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              3 formations disponibles
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Du premier contact avec l'IA à la transformation complète de vos
              processus.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formations.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-6 rounded-2xl border transition-colors",
                    f.highlight
                      ? "border-site-accent bg-site-accent/[0.02]"
                      : "border-site-border"
                  )}
                >
                  {f.highlight && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent mb-3">
                      La plus demandée
                    </span>
                  )}
                  <f.icon size={20} className="text-site-accent mb-4" />
                  <h3 className="text-lg font-display font-medium">{f.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <Clock size={12} className="text-site-text-light" />
                    <span className="text-xs text-site-text-light">
                      {f.duration}
                    </span>
                  </div>
                  <p className="text-xs text-site-text-light mb-4">{f.desc}</p>

                  <div className="mb-1">
                    <span className="text-3xl font-display font-medium tracking-tight">
                      {f.priceInter}
                    </span>
                    <span className="text-lg text-site-text-light ml-1">€</span>
                  </div>
                  <p className="text-[10px] text-site-text-light mb-2">
                    {f.labelInter}
                  </p>
                  {f.priceIntra && (
                    <p className="text-[10px] text-site-text-light mb-4">
                      ou {f.priceIntra} € {f.labelIntra}
                    </p>
                  )}

                  <ul className="space-y-2 mt-4">
                    {f.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-site-text-light"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-site-accent mt-0.5 shrink-0"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Ce qui nous différencie ------------------------------ */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Ce qui nous différencie
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Pas de théorie abstraite. Chaque participant repart avec des
              livrables concrets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {differentiators.map((d, i) => (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                >
                  <d.icon size={20} className="text-site-accent mb-4" />
                  <h3 className="text-base font-display font-medium mb-2">
                    {d.title}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {d.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Financement ------------------------------------------ */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-10 rounded-2xl bg-site-text text-white">
              <div className="flex items-center gap-2 mb-4">
                <Landmark size={14} className="text-site-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  Financement
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-medium mb-3">
                OPCO : jusqu'à 100% de prise en charge
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Les entreprises de moins de 50 salariés peuvent bénéficier d'une
                prise en charge totale via leur OPCO. Le montage du dossier est
                inclus dans nos prestations — vous n'avez rien à gérer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    100%
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    OPCO (-50 salariés)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    0 €
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    reste à charge possible
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    Inclus
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    montage dossier
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- FAQ -------------------------------------------------- */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              Questions fréquentes
            </h2>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-site-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-medium">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-site-text-light shrink-0 transition-transform",
                        openFaq === i && "rotate-180"
                      )}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-site-text-light leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- CTA final -------------------------------------------- */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Prêt à former vos équipes ?
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Échangeons sur vos besoins. Je vous envoie un programme
                personnalisé et un devis sous 24h.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  Demander un programme
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:border-white/60 transition-colors"
                >
                  Diagnostic gratuit (2 min)
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
