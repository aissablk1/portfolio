"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, HardHat, Briefcase, Zap, GraduationCap, Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import CheckoutButton from "@/components/CheckoutButton";

type Niche = null | "btp" | "b2b";

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — FR / EN
   ──────────────────────────────────────────────────────────────────────────── */

const content = {
  fr: {
    /* ── Hook ── */
    badge: "Offres & Résultats",
    h1Line1: "Automatisez votre acquisition client dès 1 500 €",
    h1Line2: "— système livré en 5 jours",
    introDefault:
      "Un artisan BTP récupère 10h/semaine en automatisant ses relances et devis. Un consultant B2B gagne 1 à 3 clients supplémentaires par mois avec un tunnel de conversion. Voici les systèmes, les prix et le ROI attendu.",
    nicheBtp: "Je suis artisan / BTP",
    nicheB2b: "Je suis prestataire B2B",
    notSure: "Pas sûr ? Faites le diagnostic gratuit",

    /* ── Niche content ── */
    niche: {
      btp: {
        subtitle:
          "Vous passez 10h/semaine au téléphone, à envoyer des devis par mail et relancer les clients. Votre site ne vous rapporte aucun client. Vos concurrents, eux, reçoivent des demandes de devis à 23h.",
        roiTitle: "Scénario type — Artisan BTP, 5-10 salariés",
        roiDesc:
          "Accélérateur à 2 900 € pour artisan BTP (5-10 salariés) : site pro + prise de RDV en ligne + devis automatisé + 3 mois de maintenance inclus. Résultat estimé : 10h/semaine libérées, soit 800 € de valeur récupérée par semaine. Rentabilisé en 4 semaines.",
        stats: [
          { value: "10h", label: "libérées chaque semaine" },
          { value: "800 €", label: "de valeur récupérée par semaine" },
          { value: "4 sem.", label: "pour rentabiliser l'Accélérateur" },
        ],
      },
      b2b: {
        subtitle:
          "Vous prospectez à la main — LinkedIn, bouche-à-oreille. Votre site ne capture aucun lead. Vos relances sont oubliées. Chaque semaine, des prospects disparaissent sans que vous le sachiez.",
        roiTitle: "Scénario type — Consultant B2B, 200-500K€ CA",
        roiDesc:
          "Accélérateur à 2 900 € pour consultant B2B (200-500K € CA) : landing page + formulaire qualifié + séquence de relance automatique + 3 mois de maintenance. Résultat estimé : 1 à 3 clients supplémentaires par mois, 5 000 € de CA additionnel. Rentabilisé dès le premier client signé.",
        stats: [
          { value: "1-3", label: "clients supplémentaires par mois" },
          { value: "5 000 €", label: "de CA additionnel mensuel" },
          { value: "1 client", label: "pour rentabiliser l'Accélérateur" },
        ],
      },
    },

    /* ── Pilote Automatique ── */
    pilote: {
      tagNew: "Nouveau — Offre d'entrée",
      tagName: "Pilote Automatique",
      title: "Votre business tourne tout seul",
      titleLine2: "en 5 jours.",
      desc: "L'essentiel pour automatiser votre acquisition — emails, chatbot IA, notifications prospect chaud. Livré clé en main en 5 jours ouvrés.",
      features: [
        "5 emails automatiques personnalisés",
        "Chatbot IA entraîné sur vos FAQ",
        "Notifications prospect chaud",
        "Dashboard de suivi",
      ],
      delivery: "Livraison : 5 jours ouvrés",
      maintenanceOption: "Option maintenance : 290 €/mois",
      cta: "Automatiser mon business",
    },

    /* ── Situations ── */
    situationBadge: "Dans quelle situation êtes-vous ?",

    autonome: {
      label: "Autonome — Projet seul",
      title: "J'ai une équipe technique.",
      titleLine2: "Je veux juste le livrable.",
      desc: "Votre système livré clé en main. Vous gérez la suite — documentation technique renforcée et formation autonomie incluses.",
      features: [
        "1 système livré (site, automation ou dashboard)",
        "Brief + maquette validée",
        "Licence d'usage non exclusive",
        "Documentation technique renforcée",
        "Formation autonomie (2h)",
      ],
      priceNote: "Paiement unique. Aucune maintenance incluse.",
      cta: "Choisir l'autonomie",
    },

    accelerateur: {
      recommended: "Recommandé",
      label: "Accélérateur — Projet + maintenance",
      title: "Je veux un système qui tourne.",
      titleLine2: "Sans m'en occuper.",
      desc: "Votre système livré et maintenu. 3 mois de maintenance offerts — monitoring 24/7, bugs sous 48h, mises à jour sécurité. Vous ne touchez à rien.",
      features: [
        "1 système livré clé en main",
        "Licence d'usage non exclusive",
        "3 mois monitoring + support offerts",
        "Corrections de bugs sous 48h",
        "Mises à jour sécurité continues",
        "Rapport mensuel de performance",
      ],
      priceAfter: "puis 490 €/mois après 3 mois offerts",
      freeMonths: "3 mois offerts (valeur 1 470 €)",
      cta: "Lancer mon système",
    },

    partenaire: {
      label: "Partenaire — Système + évolution continue",
      title: "J'ai besoin d'un partenaire technique.",
      titleLine2: "Qui fait évoluer mon système.",
      desc: "Votre infrastructure complète — site, IA, données — avec un partenaire technique dédié. Évolutions mensuelles, support prioritaire, stratégie digitale.",
      features: [
        "Système multi-briques (site + IA + data)",
        "Intégration IA sur-mesure",
        "3 mois évolution + support Premium offerts",
        "Évolutions 10h/mois + support 24h",
        "Réunion stratégique mensuelle",
        "Accès prioritaire nouvelles technos IA",
      ],
      priceAfter: "puis 1 900 €/mois après 3 mois offerts",
      freeMonths: "3 mois offerts (valeur 5 700 €)",
      cta: "Devenir partenaire",
    },

    /* ── Formation IA ── */
    formation: {
      badge: "Formation IA",
      title: "Rendez votre équipe autonome.",
      items: [
        {
          name: "IA Pratique",
          duration: "1 jour",
          price: "490 €",
          priceUnit: "/pers.",
          desc: "Prompt engineering + cas d'usage métier. Votre équipe repart avec des compétences IA opérationnelles.",
        },
        {
          name: "Automatiser son business",
          duration: "2 jours",
          price: "890 €",
          priceUnit: "/pers.",
          desc: "Automatisations déployées pendant la formation. Vos process tournent avant la fin du jour 2.",
        },
        {
          name: "Sur-mesure",
          duration: "À définir",
          price: "800 €",
          priceUnit: "/jour",
          desc: "Programme personnalisé + suivi 3 mois. Conçu autour de vos enjeux spécifiques.",
        },
      ],
      learnMore: "En savoir plus",
      opcoNote: "Finançable OPCO jusqu'à 100 %",
    },

    /* ── ROI ── */
    roi: {
      badge: "Scénario type",
    },

    /* ── Maintenance ── */
    maintenance: {
      badge: "Après la livraison",
      title: "Maintenance incluse 3 mois, puis 490 €/mois sans engagement",
      desc: "Les 3 premiers mois sont inclus dans votre projet (plans Accélérateur et Partenaire). Ensuite, la maintenance continue sans engagement.",
      perMonth: "/mois",
      plans: [
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
      ],
    },

    /* ── Garanties ── */
    garanties: [
      {
        title: "Prix final garanti",
        desc: "Pas de devis surprise. Le prix annoncé est le prix payé. Si je dépasse, c'est pour moi.",
      },
      {
        title: "Satisfait ou retravaillé",
        desc: "Si le livrable ne correspond pas au brief validé, je retravaille sans frais supplémentaires.",
      },
      {
        title: "Licence d'usage incluse",
        desc: "Accès complet au code, documentation, déploiement — vous exploitez librement votre projet. Propriété intellectuelle maintenue par le prestataire.",
      },
    ],

    /* ── Aides financières ── */
    aides: {
      badge: "Aides financières",
      title: "Financez jusqu'à 100 % de votre projet.",
      items: [
        { name: "OPCO", detail: "100 % pour entreprises < 50 salariés", scope: "Formation" },
        { name: "OCCAL", detail: "70 %, plafond 23 000 €", scope: "Artisans Occitanie" },
        { name: "Pass Occitanie", detail: "50 %, plafond 10 000 €", scope: "Projets numériques" },
        { name: "IA Booster France 2030", detail: "Diagnostic gratuit", scope: "Bpifrance" },
      ],
      footer: "Je vous accompagne dans le montage du dossier — de l'éligibilité au versement.",
    },

    /* ── CTA final ── */
    cta: {
      title: "Premier échange gratuit — 30 min, zéro engagement, proposition en 48h",
      desc: "30 minutes suffisent pour cadrer votre projet. Gratuit, zéro engagement.",
      button: "Recevoir ma proposition en 48h",
    },
  },

  en: {
    /* ── Hook ── */
    badge: "Offers & Results",
    h1Line1: "Automate your client acquisition from €1,500",
    h1Line2: "— system delivered in 5 days",
    introDefault:
      "A construction craftsman saves 10h/week by automating follow-ups and quotes. A B2B consultant gains 1 to 3 extra clients per month with a conversion funnel. Here are the systems, prices and expected ROI.",
    nicheBtp: "I'm a craftsman / construction",
    nicheB2b: "I'm a B2B service provider",
    notSure: "Not sure? Take the free diagnostic",

    /* ── Niche content ── */
    niche: {
      btp: {
        subtitle:
          "You spend 10h/week on the phone, sending quotes by email and chasing clients. Your website brings you zero clients. Your competitors receive quote requests at 11pm.",
        roiTitle: "Typical scenario — Construction craftsman, 5-10 employees",
        roiDesc:
          "Accelerator at €2,900 for a construction craftsman (5-10 employees): professional website + online booking + automated quotes + 3 months of maintenance included. Estimated result: 10h/week freed, i.e. €800 in recovered value per week. Pays for itself in 4 weeks.",
        stats: [
          { value: "10h", label: "freed every week" },
          { value: "€800", label: "recovered value per week" },
          { value: "4 wks", label: "to pay off the Accelerator" },
        ],
      },
      b2b: {
        subtitle:
          "You prospect by hand — LinkedIn, word of mouth. Your website captures zero leads. Your follow-ups get forgotten. Every week, prospects disappear without you knowing.",
        roiTitle: "Typical scenario — B2B Consultant, €200-500K revenue",
        roiDesc:
          "Accelerator at €2,900 for a B2B consultant (€200-500K revenue): landing page + qualified form + automatic follow-up sequence + 3 months of maintenance. Estimated result: 1 to 3 additional clients per month, €5,000 in extra revenue. Pays for itself from the first signed client.",
        stats: [
          { value: "1-3", label: "additional clients per month" },
          { value: "€5,000", label: "in extra monthly revenue" },
          { value: "1 client", label: "to pay off the Accelerator" },
        ],
      },
    },

    /* ── Pilote Automatique ── */
    pilote: {
      tagNew: "New — Entry offer",
      tagName: "Autopilot",
      title: "Your business runs itself",
      titleLine2: "in 5 days.",
      desc: "The essentials to automate your acquisition — emails, AI chatbot, hot prospect notifications. Delivered turnkey in 5 business days.",
      features: [
        "5 personalized automated emails",
        "AI chatbot trained on your FAQ",
        "Hot prospect notifications",
        "Tracking dashboard",
      ],
      delivery: "Delivery: 5 business days",
      maintenanceOption: "Maintenance option: €290/month",
      cta: "Automate my business",
    },

    /* ── Situations ── */
    situationBadge: "What's your situation?",

    autonome: {
      label: "Autonomous — Solo project",
      title: "I have a technical team.",
      titleLine2: "I just want the deliverable.",
      desc: "Your system delivered turnkey. You handle the rest — enhanced technical documentation and autonomy training included.",
      features: [
        "1 delivered system (website, automation or dashboard)",
        "Brief + validated mockup",
        "Non-exclusive usage license",
        "Enhanced technical documentation",
        "Autonomy training (2h)",
      ],
      priceNote: "One-time payment. No maintenance included.",
      cta: "Choose autonomy",
    },

    accelerateur: {
      recommended: "Recommended",
      label: "Accelerator — Project + maintenance",
      title: "I want a system that runs.",
      titleLine2: "Without me handling it.",
      desc: "Your system delivered and maintained. 3 months of free maintenance — 24/7 monitoring, bugs fixed within 48h, security updates. You don't touch a thing.",
      features: [
        "1 turnkey delivered system",
        "Non-exclusive usage license",
        "3 months monitoring + support included",
        "Bug fixes within 48h",
        "Continuous security updates",
        "Monthly performance report",
      ],
      priceAfter: "then €490/month after 3 free months",
      freeMonths: "3 months free (€1,470 value)",
      cta: "Launch my system",
    },

    partenaire: {
      label: "Partner — System + continuous evolution",
      title: "I need a technical partner.",
      titleLine2: "Who evolves my system.",
      desc: "Your complete infrastructure — website, AI, data — with a dedicated technical partner. Monthly evolutions, priority support, digital strategy.",
      features: [
        "Multi-component system (website + AI + data)",
        "Custom AI integration",
        "3 months evolution + Premium support included",
        "10h/month evolutions + 24h support",
        "Monthly strategic meeting",
        "Priority access to new AI technologies",
      ],
      priceAfter: "then €1,900/month after 3 free months",
      freeMonths: "3 months free (€5,700 value)",
      cta: "Become a partner",
    },

    /* ── Formation IA ── */
    formation: {
      badge: "AI Training",
      title: "Make your team autonomous.",
      items: [
        {
          name: "Practical AI",
          duration: "1 day",
          price: "€490",
          priceUnit: "/pers.",
          desc: "Prompt engineering + business use cases. Your team leaves with operational AI skills.",
        },
        {
          name: "Automate your business",
          duration: "2 days",
          price: "€890",
          priceUnit: "/pers.",
          desc: "Automations deployed during training. Your processes run before the end of day 2.",
        },
        {
          name: "Custom",
          duration: "To be defined",
          price: "€800",
          priceUnit: "/day",
          desc: "Customized program + 3-month follow-up. Designed around your specific challenges.",
        },
      ],
      learnMore: "Learn more",
      opcoNote: "Up to 100% fundable via OPCO",
    },

    /* ── ROI ── */
    roi: {
      badge: "Typical scenario",
    },

    /* ── Maintenance ── */
    maintenance: {
      badge: "After delivery",
      title: "Maintenance included for 3 months, then €490/month with no commitment",
      desc: "The first 3 months are included in your project (Accelerator and Partner plans). Then, maintenance continues with no commitment.",
      perMonth: "/month",
      plans: [
        {
          name: "Essential",
          price: "€490",
          desc: "24/7 monitoring, bugs within 48h, security updates, monthly report. Annual: €368/month (3 months free).",
        },
        {
          name: "Premium",
          price: "€1,900",
          desc: "Essential + 10h/month evolutions, 24h support, monthly strategic review. Annual: €1,425/month.",
        },
      ],
    },

    /* ── Garanties ── */
    garanties: [
      {
        title: "Guaranteed final price",
        desc: "No surprise quotes. The announced price is the price paid. If I go over, it's on me.",
      },
      {
        title: "Satisfied or reworked",
        desc: "If the deliverable doesn't match the validated brief, I rework it at no extra cost.",
      },
      {
        title: "Usage license included",
        desc: "Full access to code, documentation, deployment — you freely operate your project. Intellectual property maintained by the provider.",
      },
    ],

    /* ── Aides financières ── */
    aides: {
      badge: "Financial aid",
      title: "Fund up to 100% of your project.",
      items: [
        { name: "OPCO", detail: "100% for companies < 50 employees", scope: "Training" },
        { name: "OCCAL", detail: "70%, cap €23,000", scope: "Craftsmen in Occitanie" },
        { name: "Pass Occitanie", detail: "50%, cap €10,000", scope: "Digital projects" },
        { name: "IA Booster France 2030", detail: "Free diagnostic", scope: "Bpifrance" },
      ],
      footer: "I support you through the entire application process — from eligibility to disbursement.",
    },

    /* ── CTA final ── */
    cta: {
      title: "Free first call — 30 min, zero commitment, proposal within 48h",
      desc: "30 minutes is all it takes to scope your project. Free, zero commitment.",
      button: "Get my proposal within 48h",
    },
  },
};

export default function GoPage() {
  const { language } = useLanguage();
  const t = content[language as "fr" | "en"] || content.fr;
  const [niche, setNiche] = useState<Niche>(null);
  const roi = niche ? t.niche[niche] : t.niche.btp;

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
  });

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />
      <AvailabilityBanner />

      <main id="main-content" className="pt-40 pb-0">
        {/* ── 1. Hook ──────────────────────────────────────────────── */}
        <section className="pb-32 px-container">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade()}>
              <p className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-8">
                {t.badge}
              </p>
              <h1 className="text-fluid-display tracking-tighter uppercase leading-[1.05] mb-8">
                {t.h1Line1}
                <br />
                {t.h1Line2}
              </h1>
              <AnimatePresence mode="wait">
                <motion.p
                  key={niche || "default"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed"
                >
                  {niche
                    ? t.niche[niche].subtitle
                    : t.introDefault}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* ── Niche selector ─────────────────────────────── */}
            <motion.div {...fade(0.3)} className="mt-12 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setNiche("btp");
                  setTimeout(() => document.getElementById("roi-section")?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
                }}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-medium transition-all duration-300",
                  niche === "btp"
                    ? "border-site-text bg-site-text text-site-bg"
                    : "border-site-border hover:border-site-text/30"
                )}
              >
                <HardHat size={18} />
                {t.nicheBtp}
              </button>
              <button
                onClick={() => {
                  setNiche("b2b");
                  setTimeout(() => document.getElementById("roi-section")?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
                }}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-medium transition-all duration-300",
                  niche === "b2b"
                    ? "border-site-text bg-site-text text-site-bg"
                    : "border-site-border hover:border-site-text/30"
                )}
              >
                <Briefcase size={18} />
                {t.nicheB2b}
              </button>
              <Link
                href="/diagnostic"
                className="flex items-center gap-2 px-6 py-4 rounded-xl border border-dashed border-site-border text-sm text-site-text-light hover:border-site-text/30 hover:text-site-text transition-all duration-300"
              >
                {t.notSure}
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Offre d'entrée — Pilote Automatique ──────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...fade()}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-site-accent to-site-accent/80 p-8 md:p-12"
            >
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full">
                  {t.pilote.tagNew}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start text-white">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Zap size={20} className="text-white/80" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      {t.pilote.tagName}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                    {t.pilote.title}
                    <br className="hidden md:block" />
                    {t.pilote.titleLine2}
                  </h3>

                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                    {t.pilote.desc}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {t.pilote.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <Check size={13} className="mt-0.5 shrink-0 text-white" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:text-right md:min-w-[200px]">
                  <div className="text-4xl md:text-5xl font-medium tracking-tighter">1 500 €</div>
                  <p className="text-xs text-white/40 mt-1 mb-2">
                    {t.pilote.delivery}
                  </p>
                  <p className="text-xs text-white/40 mb-6">
                    {t.pilote.maintenanceOption}
                  </p>
                  <CheckoutButton
                    plan="pilote-automatique"
                    label={t.pilote.cta}
                    className="inline-flex items-center gap-2 bg-white text-site-accent px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
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
              {t.situationBadge}
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
                          {t.autonome.label}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        {t.autonome.title}<br className="hidden md:block" />
                        {t.autonome.titleLine2}
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        {t.autonome.desc}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {t.autonome.features.map((f, i) => (
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
                        {t.autonome.priceNote}
                      </p>
                      <Link
                        href="/contact?plan=autonome"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        {t.autonome.cta}
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
                      {t.accelerateur.recommended}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/30">
                          02
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-bg/60">
                          {t.accelerateur.label}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        {t.accelerateur.title}<br className="hidden md:block" />
                        {t.accelerateur.titleLine2}
                      </h3>

                      <p className="text-site-bg/60 text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        {t.accelerateur.desc}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {t.accelerateur.features.map((f, i) => (
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
                        {t.accelerateur.priceAfter}
                      </p>
                      <p className="inline-block mt-2 mb-6 text-[10px] font-bold bg-site-bg/10 text-site-bg px-3 py-1 rounded-full">
                        {t.accelerateur.freeMonths}
                      </p>
                      <CheckoutButton
                        plan="pro"
                        label={t.accelerateur.cta}
                        className="inline-flex items-center gap-2 bg-site-bg text-site-text px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
                      />
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
                          {t.partenaire.label}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                        {t.partenaire.title}<br className="hidden md:block" />
                        {t.partenaire.titleLine2}
                      </h3>

                      <p className="text-site-text-light text-sm md:text-base leading-relaxed max-w-xl mb-6">
                        {t.partenaire.desc}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {t.partenaire.features.map((f, i) => (
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
                        {t.partenaire.priceAfter}
                      </p>
                      <p className="inline-block mt-2 mb-6 text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        {t.partenaire.freeMonths}
                      </p>
                      <Link
                        href="/contact?plan=partenaire"
                        className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                      >
                        {t.partenaire.cta}
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Formation IA ──────────────────────────────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fade()} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap size={20} className="text-site-text-light" />
                <p className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {t.formation.badge}
                </p>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                {t.formation.title}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: "/contact?plan=formation-ia-pratique", checkoutPlan: "formation-ia-pratique" as string | null },
                { href: "/contact?plan=formation-automatisation", checkoutPlan: "formation-automatisation" as string | null },
                { href: "/contact?plan=formation-sur-mesure", checkoutPlan: null as string | null },
              ].map((meta, i) => {
                const formation = { ...t.formation.items[i], ...meta };
                return (
                <motion.div
                  key={i}
                  {...fade(i * 0.1)}
                  className="border border-site-border rounded-2xl p-8 hover:border-site-text/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest">
                      {formation.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light bg-site-border/50 px-3 py-1 rounded-full">
                      {formation.duration}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl md:text-4xl font-medium tracking-tighter">{formation.price}</span>
                    <span className="text-site-text-light text-sm">{formation.priceUnit}</span>
                  </div>
                  <p className="text-sm text-site-text-light leading-relaxed mb-6">{formation.desc}</p>
                  {formation.checkoutPlan ? (
                    <CheckoutButton
                      plan={formation.checkoutPlan}
                      label={t.formation.learnMore}
                      className="inline-flex items-center gap-2 border border-site-border px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                    />
                  ) : (
                    <Link
                      href={formation.href}
                      className="inline-flex items-center gap-2 border border-site-border px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
                    >
                      {t.formation.learnMore}
                      <ArrowUpRight size={11} />
                    </Link>
                  )}
                </motion.div>
                );
              })}
            </div>

            <motion.p
              {...fade(0.3)}
              className="mt-6 text-sm text-site-text-light flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
              {t.formation.opcoNote}
            </motion.p>
          </div>
        </section>

        {/* ── 3. ROI — preuve concrète (dynamique selon niche) ────── */}
        <section id="roi-section" className="bg-site-text text-site-bg rounded-3xl md:rounded-[3rem] mx-2 md:mx-4 px-container py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={niche || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-site-bg/30 mb-8">
                  {t.roi.badge}
                </p>
                <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                  {roi.roiTitle}
                </h2>
                <p className="text-site-bg/50 text-base md:text-lg max-w-2xl leading-relaxed mb-12">
                  {roi.roiDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {roi.stats.map((stat, i) => (
                    <div key={i} className="text-center md:text-left">
                      <div className="text-4xl md:text-5xl font-medium tracking-tighter mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-site-bg/40">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── 4. Après la livraison ────────────────────────────────── */}
        <section className="px-container py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fade()} className="mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-6">
                {t.maintenance.badge}
              </p>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                {t.maintenance.title}
              </h2>
            </motion.div>

            <p className="text-site-text-light text-sm mb-8 max-w-2xl">
              {t.maintenance.desc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.maintenance.plans.map((plan, i) => (
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
                    <span className="text-site-text-light text-sm">{t.maintenance.perMonth}</span>
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
              {t.garanties.map((g, i) => (
                <motion.div key={i} {...fade(i * 0.1)}>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{g.title}</h4>
                  <p className="text-sm text-site-text-light leading-relaxed">{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Aides financières ──────────────────────────────────── */}
        <section className="px-container pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...fade()}
              className="bg-site-text text-site-bg rounded-2xl md:rounded-3xl p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Landmark size={20} className="text-site-bg/60" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-site-bg/40">
                  {t.aides.badge}
                </p>
              </div>

              <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-8">
                {t.aides.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {t.aides.items.map((aide, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-site-bg/5 rounded-xl p-4"
                  >
                    <Check size={14} className="mt-0.5 shrink-0 text-site-bg/60" strokeWidth={2.5} />
                    <div>
                      <span className="text-sm font-bold">{aide.name}</span>
                      <span className="text-sm text-site-bg/50"> — {aide.detail}</span>
                      <p className="text-xs text-site-bg/30 mt-0.5">{aide.scope}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-site-bg/50 leading-relaxed">
                {t.aides.footer}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 6. CTA final ─────────────────────────────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fade()}>
              <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                {t.cta.title}
              </h2>
              <p className="text-site-text-light mb-10 max-w-lg mx-auto">
                {t.cta.desc}
              </p>
              <CheckoutButton
                plan="pro"
                label={t.cta.button}
                className="inline-flex items-center gap-3 bg-site-text text-site-bg px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
