"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpRight, Check, X, Zap, Rocket, Handshake, RotateCcw, ChevronDown, Shield, Clock, MessageSquare, TrendingUp, Gift } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import ROICalculator from "@/components/sections/ROICalculator";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import ExitIntentModal from "@/components/ExitIntentModal";

type SubBilling = "monthly" | "yearly";

const tierIcons = [Zap, Rocket, Handshake];

/* ── Count-up animation for metric numbers ─────────────────────────── */
function CountUpMetric({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  const match = value.match(/^([^\d]*)(\d+)(.*)/);

  const animateCount = useCallback(() => {
    if (!match || hasAnimated.current) return;
    hasAnimated.current = true;

    const target = parseInt(match[2]);
    const duration = Math.min(1.2 + target * 0.01, 2);
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(eased * target)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    setTimeout(() => requestAnimationFrame(tick), delay * 1000);
  }, [match, delay]);

  useEffect(() => {
    if (isInView) animateCount();
  }, [isInView, animateCount]);

  if (!match) return <span ref={ref}>{value}</span>;

  return (
    <span ref={ref}>
      {match[1]}{isInView ? display : "0"}{match[3]}
    </span>
  );
}

export default function ServicesPage() {
  const { language, dict } = useLanguage();
  const s = dict.services;
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subBilling, setSubBilling] = useState<SubBilling>("monthly");

  const faq = language === "fr" ? [
    { q: "Que se passe-t-il si j'arrête la maintenance ?", a: "Votre site reste en ligne et fonctionnel. Mais sans mises à jour régulières, les performances SEO se dégradent, les failles de sécurité ne sont plus corrigées, et votre système ne s'adapte plus aux évolutions du marché. En moyenne, un site non maintenu perd 20-35% de son trafic organique en 6 mois." },
    { q: "Pourquoi 3 mois offerts ?", a: "Un système digital a besoin de 3 mois pour atteindre son plein potentiel. Pendant cette période, on optimise, on ajuste, on mesure. Vous voyez les résultats concrets avant de vous engager sur la suite." },
    { q: "Et si je ne sais pas exactement ce dont j'ai besoin ?", a: "C'est le cas de 80% de mes clients au premier appel. L'échange de 30 minutes sert exactement à ça : clarifier votre besoin, identifier la bonne approche, et vous proposer le format adapté. Aucun engagement." },
    { q: "Est-ce que je suis propriétaire du code ?", a: "Vous bénéficiez d'une licence d'utilisation exclusive et illimitée dans le temps. Vous exploitez votre système en toute liberté. La propriété intellectuelle reste au prestataire, ce qui garantit la maintenance et l'évolution continue de vos outils." },
    { q: "Je peux gérer moi-même la maintenance ?", a: "Absolument, c'est le plan Autonome. Il convient aux entreprises qui ont une équipe technique en interne capable de gérer les mises à jour, la sécurité, le SEO technique et les intégrations IA." },
    { q: "Que se passe-t-il si le projet prend plus de temps ?", a: "Les prix sont forfaitaires. Si le projet dépasse le cadre prévu pour des raisons de mon côté, je ne facture pas le surplus. Si le périmètre évolue de votre côté, on en discute et on ajuste ensemble." },
    { q: "L'abonnement est-il avec engagement ?", a: "Non. Après les 3 mois offerts, la maintenance est sans engagement — vous pouvez arrêter à tout moment. L'engagement annuel est une option qui vous fait économiser 25% (3 mois gratuits sur 12)." },
  ] : [
    { q: "What happens if I stop maintenance?", a: "Your site stays online and functional. But without regular updates, SEO performance degrades, security vulnerabilities go unpatched, and your system stops adapting to market changes. On average, an unmaintained site loses 20-35% of organic traffic in 6 months." },
    { q: "Why 3 free months?", a: "A digital system needs 3 months to reach full potential. During this period, we optimize, adjust, and measure. You see concrete results before committing to ongoing maintenance." },
    { q: "What if I don't know exactly what I need?", a: "That's the case for 80% of my clients on the first call. The 30-minute exchange is exactly for that: clarifying your need, identifying the right approach, and proposing the right format. No commitment." },
    { q: "Do I own the code?", a: "You get an exclusive, unlimited usage license. You operate your system freely. Intellectual property remains with the provider, ensuring ongoing maintenance and evolution of your tools." },
    { q: "Can I handle maintenance myself?", a: "Absolutely, that's the Autonomous plan. It's suited for companies with an in-house technical team capable of managing updates, security, technical SEO, and AI integrations." },
    { q: "What if the project takes longer?", a: "Prices are fixed. If the project exceeds scope due to my side, I don't charge extra. If scope evolves from your side, we discuss and adjust together." },
    { q: "Is there a commitment on the subscription?", a: "No. After the 3 free months, maintenance is commitment-free — you can cancel anytime. Annual commitment is an option that saves you 25% (3 months free out of 12)." },
  ];

  const guarantees = language === "fr" ? [
    { icon: Shield, title: "Satisfait ou retravaillé", desc: "Si le livrable ne correspond pas au brief validé, je retravaille sans frais supplémentaires." },
    { icon: Clock, title: "Délais respectés", desc: "Les dates de livraison sont contractuelles. En cas de retard de mon côté, remise appliquée." },
    { icon: MessageSquare, title: "Transparence totale", desc: "Accès temps réel à l'avancement. Zéro surprise, zéro jargon." },
  ] : [
    { icon: Shield, title: "Satisfied or reworked", desc: "If the deliverable doesn't match the validated brief, I rework at no extra cost." },
    { icon: Clock, title: "Deadlines respected", desc: "Delivery dates are contractual. If I'm late, a discount is applied." },
    { icon: MessageSquare, title: "Full transparency", desc: "Real-time access to progress. Zero surprises, zero jargon." },
  ];

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <AvailabilityBanner />

      <main className="pt-40 pb-0">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.badge}
                </span>
              </div>
              <h1 className="text-fluid-display tracking-tighter uppercase max-w-4xl mb-8 whitespace-pre-line">
                {s.title}
              </h1>
              <p className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                {s.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?plan=accelerateur"
                  className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  {language === "fr" ? "Recevoir ma proposition" : "Get my proposal"}
                  <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-site-border text-xs font-bold uppercase tracking-widest text-site-text-light hover:border-site-accent hover:text-site-accent transition-all"
                >
                  {language === "fr" ? "Voir les plans" : "See plans"}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Time Savings / Gains de temps ─────────────────────────────── */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <TrendingUp size={16} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.timeSavings.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6 whitespace-pre-line">
                {s.timeSavings.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed">
                {s.timeSavings.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {s.timeSavings.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group relative border border-site-border rounded-2xl p-6 md:p-8 hover:border-site-accent/30 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-site-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="block text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-site-accent mb-3">
                    <CountUpMetric value={item.metric} delay={idx * 0.15} />
                  </span>
                  <span className="block text-sm md:text-base font-medium mb-2">
                    {item.label}
                  </span>
                  <span className="block text-xs md:text-sm text-site-text-light/60 leading-relaxed">
                    {item.detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Tiers (Autonome / Accélérateur / Partenaire) ──────── */}
        <section id="pricing" className="px-container mb-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                {language === "fr"
                  ? "Votre système complet :\nconstruction + évolution continue"
                  : "Your complete system:\nbuild + continuous evolution"}
              </h2>
              <p className="text-site-text-light max-w-2xl mx-auto mb-10">
                {language === "fr"
                  ? "Un site sans maintenance, c'est comme une voiture sans entretien : ça roule… quelques mois."
                  : "A site without maintenance is like a car without servicing: it runs… for a few months."}
              </p>

              {/* Social proof stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                {(language === "fr" ? [
                  { value: "100%", label: "projets livrés dans les délais" },
                  { value: "48h", label: "temps de réponse max" },
                  { value: "0", label: "intermédiaire" },
                  { value: "3 mois", label: "de maintenance offerts" },
                ] : [
                  { value: "100%", label: "projects delivered on time" },
                  { value: "48h", label: "max response time" },
                  { value: "0", label: "middlemen" },
                  { value: "3 months", label: "free maintenance" },
                ]).map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-medium tracking-tighter text-site-accent">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 lg:items-end">
              {s.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                const isHighlighted = idx === 1;
                const isDecoy = idx === 0;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
                    onMouseEnter={() => setHoveredTier(idx)}
                    onMouseLeave={() => setHoveredTier(null)}
                    className={cn(
                      "relative flex flex-col border rounded-2xl transition-all duration-500",
                      isHighlighted
                        ? "lg:scale-105 lg:z-10 border-site-accent shadow-[0_0_60px_-12px_rgba(0,0,0,0.15)] bg-site-bg"
                        : isDecoy
                        ? "bg-site-bg border-site-border/60 opacity-90 hover:opacity-100"
                        : "bg-site-bg border-site-border hover:border-site-accent/30",
                      hoveredTier === idx && !isHighlighted && "shadow-lg opacity-100"
                    )}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-site-accent px-4 py-1.5 rounded-full">
                          {s.popularBadge}
                        </span>
                      </div>
                    )}

                    <div className="p-8 md:p-10 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-full border flex items-center justify-center",
                          isHighlighted ? "border-site-accent text-site-accent" : "border-site-border text-site-text-light"
                        )}>
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium tracking-tight uppercase">{tier.name}</h3>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mb-6",
                        isDecoy ? "text-site-text-light/40" : "text-site-accent/60"
                      )}>
                        {tier.tag}
                      </span>

                      <p className="text-site-text-light text-sm leading-relaxed mb-8 min-h-[48px]">
                        {tier.description}
                      </p>

                      {/* Price */}
                      <div className="mb-8">
                        {isHighlighted && (
                          <div className="mb-2">
                            <span className="text-sm text-site-text-light/40 line-through">
                              {language === "fr" ? "5 370 € sans maintenance" : "€5,370 without maintenance"}
                            </span>
                          </div>
                        )}
                        <span className="text-4xl md:text-5xl font-medium tracking-tighter">
                          {tier.price}
                        </span>

                        {tier.monthlyPrice && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm text-site-text-light">
                              {language === "fr" ? "puis" : "then"}{" "}
                              <span className="font-medium text-site-text">{tier.monthlyPrice}</span>
                              /{language === "fr" ? "mois" : "mo"}
                            </span>
                          </div>
                        )}

                        {tier.monthlyNote && (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full">
                            <Gift size={12} />
                            {tier.monthlyNote}
                          </div>
                        )}

                        <p className="text-xs text-site-text-light/50 mt-3">
                          {tier.priceNote}
                        </p>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/contact?plan=${isDecoy ? "autonome" : isHighlighted ? "accelerateur" : "partenaire"}`}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all mb-8",
                          isHighlighted
                            ? "bg-site-accent text-white hover:bg-site-accent/85 hover:scale-105"
                            : "border border-site-border text-site-text hover:border-site-accent hover:text-site-accent"
                        )}
                      >
                        {isDecoy
                          ? (language === "fr" ? "Choisir l'autonomie" : "Choose autonomy")
                          : isHighlighted
                          ? (language === "fr" ? "Recevoir ma proposition en 48h" : "Get my proposal in 48h")
                          : (language === "fr" ? "Recevoir mon diagnostic gratuit" : "Get my free diagnostic")
                        }
                        <ArrowUpRight size={14} />
                      </Link>

                      {/* Micro-guarantee near CTA */}
                      {!isDecoy && (
                        <p className="text-[10px] text-site-text-light/40 text-center mb-6 flex items-center justify-center gap-1.5">
                          <Shield size={10} className="shrink-0" />
                          {language === "fr"
                            ? "Satisfait ou retravaillé — Prix garanti, zéro surprise"
                            : "Satisfied or reworked — Guaranteed price, zero surprises"}
                        </p>
                      )}

                      {/* Micro-testimonial on highlighted card */}
                      {isHighlighted && (
                        <div className="mb-8 flex items-start gap-3 text-xs text-site-text-light/60 italic">
                          <span className="text-lg leading-none">&ldquo;</span>
                          <p className="leading-relaxed">
                            {language === "fr"
                              ? "Mon site était en ligne en 8 jours. Les 3 mois de maintenance m'ont convaincu de continuer — je ne touche plus à rien."
                              : "My site was live in 8 days. The 3 months of maintenance convinced me to continue — I don't touch anything anymore."}
                            <span className="block mt-1 not-italic font-medium text-site-text-light/40">
                              {language === "fr" ? "— Gérant, entreprise BTP" : "— Owner, construction company"}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Features */}
                      <div className="border-t border-site-border pt-6 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-4">
                          {s.includesLabel}
                        </p>
                        <ul className="space-y-3">
                          {tier.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-3">
                              <Check size={14} className="mt-0.5 text-site-accent shrink-0" strokeWidth={2.5} />
                              <span className="text-sm text-site-text-light">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Excluded items (for decoy) */}
                        {tier.excluded.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-red-100">
                            <ul className="space-y-2">
                              {tier.excluded.map((item, eIdx) => (
                                <li key={eIdx} className="flex items-start gap-3">
                                  <X size={14} className="mt-0.5 text-red-400 shrink-0" strokeWidth={2.5} />
                                  <span className="text-sm text-red-400/80">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-site-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-1">
                            {s.durationLabel}
                          </p>
                          <p className="text-sm font-medium">{tier.duration}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ecosystem CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p className="text-site-text-light text-sm mb-4">
                {s.ecosystemCta.text}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-accent hover:underline"
              >
                {s.ecosystemCta.button}
                <ArrowUpRight size={12} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Guarantees ───────────────────────────────────────────────── */}
        <section className="bg-site-accent text-white rounded-4xl md:rounded-[4rem] mx-2 md:mx-4 px-container section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <h2 className="text-fluid-title tracking-tighter uppercase mb-4">
                {language === "fr" ? "Zéro risque" : "Zero risk"}
              </h2>
              <p className="text-lg opacity-60 max-w-xl">
                {language === "fr"
                  ? "Je m'engage sur le résultat, pas seulement sur l'effort."
                  : "I commit to the result, not just the effort."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
              {guarantees.map((g, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <g.icon size={24} className="mb-6 opacity-40" strokeWidth={1.5} />
                  <h4 className="text-xl font-medium mb-3">{g.title}</h4>
                  <p className="text-sm opacity-60 leading-relaxed">{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison table (Agence vs Freelance vs Aïssa) ──────────── */}
        <section className="px-container section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.comparison.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6 whitespace-pre-line">
                {s.comparison.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed">
                {s.comparison.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-x-auto -mx-container px-container"
            >
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr>
                    {s.comparison.columns.map((col, i) => (
                      <th
                        key={i}
                        className={cn(
                          "text-left py-4 px-5 text-xs font-bold uppercase tracking-widest",
                          i === 0
                            ? "text-site-text-light/40 w-[22%]"
                            : i === 3
                            ? "text-site-accent bg-site-accent/[0.04] rounded-t-xl"
                            : "text-site-text-light"
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.comparison.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-t border-site-border/50"
                    >
                      <td className="py-4 px-5 text-sm font-medium">
                        {row.label}
                      </td>
                      {row.values.map((val, vIdx) => (
                        <td
                          key={vIdx}
                          className={cn(
                            "py-4 px-5 text-sm",
                            vIdx === 2
                              ? "text-site-accent font-medium bg-site-accent/[0.04]"
                              : "text-site-text-light"
                          )}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ── ROI Calculator ──────────────────────────────────────────── */}
        <ROICalculator />

        {/* ── Recurring / Subscriptions (for existing clients) ──────────── */}
        <section className="px-container section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <RotateCcw size={16} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.recurring.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6 whitespace-pre-line">
                {s.recurring.title}
              </h2>
              <p className="text-site-text-light max-w-2xl leading-relaxed mb-10">
                {s.recurring.subtitle}
              </p>

              {/* Subscription Billing Toggle */}
              <div role="tablist" aria-label={language === "fr" ? "Fréquence de facturation" : "Billing frequency"} className="inline-flex items-center bg-[#f5f5f5] rounded-full p-1 gap-0.5">
                {(["monthly", "yearly"] as SubBilling[]).map((mode) => (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={subBilling === mode}
                    onClick={() => setSubBilling(mode)}
                    className={cn(
                      "relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer",
                      "flex items-center gap-2",
                      subBilling === mode
                        ? "bg-site-accent text-white shadow-md"
                        : "text-site-text-light hover:text-site-text"
                    )}
                  >
                    {mode === "monthly" && s.recurring.billingToggle.monthly}
                    {mode === "yearly" && (
                      <>
                        {s.recurring.billingToggle.yearly}
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors duration-300",
                          subBilling === "yearly"
                            ? "bg-white/20 text-white"
                            : "bg-green-100 text-green-700"
                        )}>
                          {s.recurring.billingToggle.saveBadge}
                        </span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {s.recurring.plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="border border-site-border rounded-2xl p-8 md:p-10 flex flex-col hover:border-site-accent/30 transition-colors"
                >
                  <h4 className="text-lg font-medium tracking-tight uppercase mb-4">{plan.name}</h4>

                  <div className="mb-8 min-h-[70px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={subBilling}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl md:text-4xl font-medium tracking-tighter">
                            {subBilling === "yearly" ? plan.priceYearly : plan.price}
                          </span>
                          <span className="text-site-text-light text-sm">
                            /{language === "fr" ? "mois" : "mo"}
                          </span>
                        </div>
                        {subBilling === "yearly" && (
                          <p className="text-xs text-site-text-light/50 mt-2">
                            {plan.priceYearlyTotal}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <Check size={12} className="mt-1 text-site-accent shrink-0" strokeWidth={2.5} />
                        <span className="text-sm text-site-text-light">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-site-border text-xs font-bold uppercase tracking-widest hover:border-site-accent hover:text-site-accent transition-all"
                  >
                    {s.cta}
                    <ArrowUpRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process (connected timeline) ──────────────────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.process.badge}
                </span>
              </div>
              <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl">
                {s.process.title}
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-site-border md:-translate-x-px" />

              {s.process.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={cn(
                    "relative flex items-start gap-8 mb-16 last:mb-0",
                    "md:w-1/2",
                    idx % 2 === 0 ? "md:pr-16 md:ml-0" : "md:pl-16 md:ml-auto"
                  )}
                >
                  <div className={cn(
                    "absolute w-10 h-10 rounded-full bg-site-bg border-2 border-site-accent flex items-center justify-center text-xs font-bold shrink-0 z-10",
                    "left-0 md:left-auto",
                    idx % 2 === 0 ? "md:right-[-20px]" : "md:left-[-20px]"
                  )}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div className="pl-16 md:pl-0">
                    <h4 className="text-lg font-medium uppercase tracking-tight mb-2">{step.title}</h4>
                    <p className="text-sm text-site-text-light leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="px-container pb-32 border-t border-site-border pt-32">
          <div className="max-w-7xl mx-auto">
            {/* Header row: title left, subtitle right */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-2 h-2 rounded-full bg-site-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">FAQ</span>
                </div>
                <h2 className="text-fluid-title tracking-tighter uppercase">
                  {language === "fr" ? "Vos questions,\nmes réponses." : "Your questions,\nmy answers."}
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-site-text-light max-w-sm text-sm leading-relaxed md:text-right"
              >
                {language === "fr"
                  ? "Tout ce que vous devez savoir avant de lancer votre système. Une question manque ? Échangeons."
                  : "Everything you need to know before launching your system. Missing a question? Let's talk."}
              </motion.p>
            </div>

            {/* FAQ cards — 2 columns on desktop */}
            {(() => {
              const left = faq.filter((_, i) => i % 2 === 0);
              const right = faq.filter((_, i) => i % 2 === 1);

              const renderCard = (item: typeof faq[0], realIdx: number, delayIdx: number) => {
                const isOpen = openFaq === realIdx;
                return (
                  <motion.div
                    key={realIdx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: delayIdx * 0.06 }}
                    className={cn(
                      "group border rounded-2xl overflow-hidden transition-colors duration-300",
                      isOpen
                        ? "border-site-accent bg-site-accent/[0.02] shadow-sm"
                        : "border-site-border hover:border-site-accent/30"
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : realIdx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${realIdx}`}
                      className="w-full p-6 md:p-8 flex items-start gap-5 text-left cursor-pointer"
                    >
                      <span className={cn(
                        "text-xs font-bold shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300",
                        isOpen
                          ? "bg-site-accent text-white"
                          : "bg-site-border/60 text-site-text-light"
                      )}>
                        {String(realIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm md:text-base font-medium leading-snug group-hover:text-site-accent transition-colors">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 mt-0.5 text-site-text-light transition-transform duration-300",
                          isOpen && "rotate-180 text-site-accent"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div id={`faq-answer-${realIdx}`} role="region" className="px-6 md:px-8 pb-6 md:pb-8 pl-[4.25rem] md:pl-[4.75rem]">
                            <p className="text-sm text-site-text-light leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              };

              return (
                <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                  <div className="flex-1 flex flex-col gap-4 md:gap-5">
                    {left.map((item, i) => renderCard(item, i * 2, i))}
                  </div>
                  <div className="flex-1 flex flex-col gap-4 md:gap-5">
                    {right.map((item, i) => renderCard(item, i * 2 + 1, i))}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="px-container pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border border-site-border rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-site-accent)_0%,transparent_70%)] opacity-[0.03]" />

              <div className="relative">
                <h2 className="text-fluid-title tracking-tighter uppercase mb-6">
                  {s.finalCta.title}
                </h2>
                <p className="text-site-text-light mb-10 max-w-lg mx-auto">
                  {s.finalCta.subtitle}
                </p>
                <Link
                  href="/contact?plan=accelerateur"
                  className="inline-flex items-center gap-3 bg-site-accent text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-site-accent/85 hover:scale-105 transition-all"
                >
                  {s.finalCta.button}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ExitIntentModal />

      {/* ── Sticky CTA mobile ──────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-site-bg/90 backdrop-blur-xl border-t border-site-border px-4 py-3 safe-area-pb">
        <Link
          href="/contact?plan=accelerateur"
          className="flex items-center justify-center gap-2 w-full bg-site-accent text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          {language === "fr" ? "Ma proposition en 48h — 2 900 €" : "My proposal in 48h — €2,900"}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
