"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Zap,
  Bot,
  BarChart3,
  Globe,
  Clock,
  BadgeEuro,
  CheckCircle2,
  Users,
  Landmark,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";

const stats = [
  { value: "93", label: "projets livres" },
  { value: "4+", label: "ans d'experience" },
  { value: "10j", label: "delai moyen" },
  { value: "800\u20ac", label: "TJM consulting" },
];

const services = [
  {
    icon: Zap,
    title: "Automatisation & Process",
    desc: "Emails, relances, devis, CRM — vos taches repetitives tournent toutes seules. 10 a 15h/semaine liberees.",
  },
  {
    icon: Bot,
    title: "Chatbot IA sur-mesure",
    desc: "Un assistant qui qualifie vos prospects, repond aux FAQ et prend les RDV. 24/7, sans pause.",
  },
  {
    icon: Globe,
    title: "Site web SEO + GEO",
    desc: "Visible sur Google ET recommande par ChatGPT. Donnees structurees, contenu expert, referencement regional Occitanie.",
  },
  {
    icon: BarChart3,
    title: "Dashboard decisionnel",
    desc: "Vos chiffres cles en temps reel. Alertes intelligentes, rapports auto-generes, decisions en 30 secondes.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "1 500",
    desc: "1 automatisation cle en main",
    features: ["Chatbot OU emails OU RDV", "Livre en 5 jours", "Formation 1h incluse"],
    highlight: false,
  },
  {
    name: "Accelerateur",
    price: "2 900",
    desc: "Systeme complet + maintenance",
    features: [
      "1 systeme livre cle en main",
      "3 mois maintenance offerts",
      "Bugs corriges sous 48h",
      "Rapport mensuel",
    ],
    highlight: true,
  },
  {
    name: "Partenaire",
    price: "6 900",
    desc: "Infrastructure IA + partenaire dedie",
    features: [
      "Systeme multi-briques (site + IA + data)",
      "3 mois evolution + support Premium",
      "Evolutions 10h/mois",
      "Reunion strategique mensuelle",
    ],
    highlight: false,
  },
];

const faqs = [
  {
    q: "Quelles villes d'Occitanie couvrez-vous ?",
    a: "Toute la region Occitanie : Albi, Toulouse, Castres, Montpellier, Perpignan, Nimes, Tarbes, Rodez, Cahors, et toutes les villes intermediaires. Base a Albi, je me deplace pour les reunions en personne et travaille en visio pour les echanges courants.",
  },
  {
    q: "Quels secteurs economiques en Occitanie beneficient le plus de l'IA ?",
    a: "L'aeronautique (Toulouse, Aerospace Valley), le BTP (toute la region), le textile (Castres-Mazamet), la viticulture (Herault, Gaillac), le tourisme (Lourdes, littoral), l'agroalimentaire et les PME industrielles. L'IA automatise les process, les devis, la relation client et le suivi de production.",
  },
  {
    q: "Est-ce que les aides regionales Occitanie couvrent les projets IA ?",
    a: "Oui. OPCO prend en charge jusqu'a 100% du volet formation pour les entreprises de moins de 50 salaries. OCCAL finance 70% (plafond 23 000 \u20ac) et Pass Occitanie 50% (plafond 10 000 \u20ac). BPI France finance egalement les startups innovantes de la region.",
  },
  {
    q: "Pourquoi choisir un expert IA local plutot qu'une agence parisienne ?",
    a: "Je connais le tissu economique regional, les aides Occitanie, les specificites de chaque bassin economique, et je me deplace pour des reunions en personne. Mes tarifs sont 2 a 3 fois inferieurs a Paris, sans compromettre la qualite technique.",
  },
  {
    q: "Combien de temps faut-il pour voir des resultats ?",
    a: "Les systemes sont livres en 5 a 10 jours ouvres. Les premiers resultats (leads, temps gagne, visibilite) arrivent sous 2 a 4 semaines. Le ROI complet est generalement atteint en 4 a 6 semaines.",
  },
];

const comparisonRows = [
  { label: "Prix journee", agence: "1 500 - 3 000 \u20ac", freelance: "800 \u20ac" },
  { label: "Delai de livraison", agence: "2 - 6 mois", freelance: "5 - 10 jours" },
  { label: "Interlocuteur", agence: "Chef de projet (pas technique)", freelance: "Le developpeur qui code" },
  { label: "Connaissance locale", agence: "Aucune", freelance: "13 departements Occitanie" },
  { label: "Aides regionales", agence: "Pas de montage", freelance: "OPCO, OCCAL, Pass Occitanie, BPI" },
  { label: "Apres la livraison", agence: "Ticket de support payant", freelance: "3 mois maintenance offerts" },
];

const cities = [
  "Albi", "Toulouse", "Castres", "Montpellier", "Perpignan",
  "Nimes", "Tarbes", "Rodez", "Cahors", "Auch",
  "Foix", "Mende", "Carcassonne",
];

export default function ExpertIAOccitaniePage() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

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
              <MapPin size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Occitanie — 13 departements
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              Expert IA en Occitanie
              <br />
              <span className="text-site-text-light">
                pour PME et ETI de toute la region
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl mb-10"
            >
              Automatisation, chatbot IA, sites web, dashboards — je concois et
              livre des systemes digitaux cle en main pour les entreprises
              d'Occitanie. D'Albi a Montpellier, de Toulouse a Perpignan.
              Aeronautique, BTP, textile, viticulture, tourisme. Prix fixe,
              resultat garanti, livre en 10 jours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
              >
                Diagnostic gratuit (2 min)
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
              >
                Voir les offres
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-site-border"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-display font-medium tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Couverture regionale ──────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Couverture regionale
              <br />
              <span className="text-site-text-light">
                13 departements, toute l'Occitanie
              </span>
            </h2>
            <p className="text-site-text-light mb-8 max-w-xl">
              Base a Albi, je me deplace sur toute la region pour les reunions
              en personne. Visio pour les echanges courants.
            </p>

            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <span
                  key={city}
                  className="px-4 py-2 rounded-full border border-site-border text-sm font-display font-medium hover:border-site-accent hover:text-site-accent transition-colors"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Ce qu'un expert IA fait
              <br />
              <span className="text-site-text-light">
                concretement pour votre entreprise en Occitanie
              </span>
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Pas de theorie, pas de slides. Des systemes qui tournent et qui
              rapportent — adaptes a l'economie regionale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                >
                  <s.icon
                    size={20}
                    className="text-site-accent mb-4"
                  />
                  <h3 className="text-base font-display font-medium mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparatif agence vs freelance ────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Agence parisienne vs expert local Occitanie
            </h2>
            <p className="text-site-text-light mb-8 max-w-xl">
              Meme expertise technique, 3x moins cher, 10x plus rapide.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-site-text">
                    <th className="text-left py-3 pr-4 font-display font-medium text-xs uppercase tracking-wider text-site-text-light">
                      Critere
                    </th>
                    <th className="text-left py-3 px-4 font-display font-medium text-xs uppercase tracking-wider text-red-600/70">
                      Agence parisienne
                    </th>
                    <th className="text-left py-3 pl-4 font-display font-medium text-xs uppercase tracking-wider text-site-accent">
                      Aissa Belkoussa (Occitanie)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-site-border"
                    >
                      <td className="py-3 pr-4 font-medium">{row.label}</td>
                      <td className="py-3 px-4 text-site-text-light">
                        {row.agence}
                      </td>
                      <td className="py-3 pl-4 font-medium text-site-accent">
                        {row.freelance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Tarifs — prix fixe, zero surprise
            </h2>
            <p className="text-site-text-light mb-10 max-w-xl">
              Le prix annonce est le prix paye. Satisfait ou retravaille.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricing.map((p) => (
                <div
                  key={p.name}
                  className={cn(
                    "p-6 rounded-2xl border transition-colors",
                    p.highlight
                      ? "border-site-accent bg-site-accent/[0.02]"
                      : "border-site-border"
                  )}
                >
                  {p.highlight && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent mb-3">
                      Recommande
                    </span>
                  )}
                  <h3 className="text-lg font-display font-medium">
                    {p.name}
                  </h3>
                  <p className="text-xs text-site-text-light mb-4">
                    {p.desc}
                  </p>
                  <div className="text-3xl font-display font-medium tracking-tight mb-1">
                    {p.price} <span className="text-lg text-site-text-light">{"\u20ac"}</span>
                  </div>
                  <p className="text-[10px] text-site-text-light mb-4">
                    Paiement unique — licence incluse
                  </p>
                  <ul className="space-y-2">
                    {p.features.map((f) => (
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
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-site-accent/5 border border-site-accent/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Landmark size={14} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-site-accent">
                  Financable OPCO jusqu'a 100%
                </span>
              </div>
              <p className="text-xs text-site-text-light">
                Je vous accompagne dans le montage du dossier. OCCAL (70%),
                Pass Occitanie (50%) et BPI France aussi mobilisables.
              </p>
            </div>
          </div>
        </section>

        {/* ── ROI concret ──────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-10 rounded-2xl bg-site-text text-white">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-site-accent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-accent">
                  Exemple concret — entreprise BTP en Occitanie, 20 salaries
                </span>
              </div>
              <h3 className="text-xl font-display font-medium mb-3">
                Accelerateur a 2 900 {"\u20ac"} : site pro + prise de RDV + devis
                automatise + suivi chantier + 3 mois maintenance
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Le dirigeant perd 12h/semaine a repondre au telephone, generer
                des devis manuels et suivre l'avancement des chantiers sur
                Excel. L'Accelerateur automatise tout et maintient le systeme.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    12h
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    liberees / semaine
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    960 {"\u20ac"}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    valeur / semaine
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-medium text-site-accent">
                    3 sem.
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">
                    pour rentabiliser
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-8">
              Questions frequentes
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

        {/* ── CTA final ────────────────────────────────── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 md:p-12 rounded-2xl border border-site-accent bg-site-accent text-white text-center">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4">
                Premier echange gratuit — 30 min, zero engagement
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                On regarde ensemble ou l'IA peut vous faire gagner du temps et
                de l'argent. Pas de jargon, pas de vente forcee.
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
