"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Zap, Layers, Building2, RotateCcw, ChevronDown, Shield, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const tierIcons = [Zap, Layers, Building2];

export default function ServicesPage() {
  const { language, dict } = useLanguage();
  const s = dict.services;
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faq = language === "fr" ? [
    { q: "Et si je ne sais pas exactement ce dont j'ai besoin ?", a: "C'est le cas de 80% de mes clients au premier appel. L'échange de 30 minutes sert exactement à ça : clarifier votre besoin, identifier la bonne approche, et vous proposer le format adapté. Aucun engagement." },
    { q: "Est-ce que je suis propriétaire du code ?", a: "Oui, à 100%. Le code source, les accès, la documentation — tout vous appartient dès la livraison. Pas de lock-in, pas de dépendance." },
    { q: "Que se passe-t-il si le projet prend plus de temps que prévu ?", a: "Les prix sont forfaitaires. Si le projet dépasse le cadre prévu pour des raisons de mon côté, je ne facture pas le surplus. Si le périmètre évolue de votre côté, on en discute et on ajuste ensemble." },
    { q: "Je peux commencer par un Sprint et passer au Build ensuite ?", a: "Absolument — c'est même le parcours le plus courant. Le Sprint permet de tester la collaboration avant de s'engager sur un projet plus large." },
    { q: "L'abonnement est-il obligatoire après livraison ?", a: "Non. L'abonnement est optionnel. Votre système est conçu pour tourner de manière autonome. L'abonnement est là si vous souhaitez des évolutions, du monitoring ou du support continu." },
  ] : [
    { q: "What if I don't know exactly what I need?", a: "That's the case for 80% of my clients on the first call. The 30-minute exchange is exactly for that: clarifying your need, identifying the right approach, and proposing the right format. No commitment." },
    { q: "Do I own the code?", a: "Yes, 100%. Source code, access credentials, documentation — everything belongs to you upon delivery. No lock-in, no dependency." },
    { q: "What if the project takes longer than expected?", a: "Prices are fixed. If the project exceeds scope due to my side, I don't charge extra. If scope evolves from your side, we discuss and adjust together." },
    { q: "Can I start with Sprint and upgrade to Build later?", a: "Absolutely — that's actually the most common path. The Sprint lets you test the collaboration before committing to a larger project." },
    { q: "Is the subscription mandatory after delivery?", a: "No. The subscription is optional. Your system is designed to run autonomously. The subscription is there if you want evolutions, monitoring, or ongoing support." },
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
              <p className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed">
                {s.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Tiers (elevated Build card) ───────────────────────────────── */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 lg:items-end">
              {s.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                const isHighlighted = idx === 1;

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
                      "relative flex flex-col border border-site-border rounded-2xl transition-all duration-500",
                      isHighlighted
                        ? "lg:scale-105 lg:z-10 border-site-accent shadow-[0_0_60px_-12px_rgba(0,0,0,0.15)] bg-site-bg"
                        : "bg-site-bg hover:border-site-accent/30",
                      hoveredTier === idx && !isHighlighted && "shadow-lg"
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
                      <div className="flex items-center gap-4 mb-8">
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

                      <p className="text-site-text-light text-sm leading-relaxed mb-8 min-h-[48px]">
                        {tier.description}
                      </p>

                      <div className="mb-8">
                        <span className="text-4xl md:text-5xl font-medium tracking-tighter">
                          {tier.price}
                        </span>
                        <p className="text-xs text-site-text-light/50 mt-2">{tier.priceNote}</p>
                      </div>

                      <Link
                        href="/contact"
                        className={cn(
                          "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all mb-8",
                          isHighlighted
                            ? "bg-site-accent text-white hover:bg-site-accent/85 hover:scale-105"
                            : "border border-site-border text-site-text hover:border-site-accent hover:text-site-accent"
                        )}
                      >
                        {idx === 0
                          ? (language === "fr" ? "Réserver mon sprint" : "Book my sprint")
                          : idx === 1
                          ? (language === "fr" ? "Lancer mon système" : "Launch my system")
                          : (language === "fr" ? "Échanger 30 min" : "Chat for 30 min")
                        }
                        <ArrowUpRight size={14} />
                      </Link>

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
          </div>
        </section>

        {/* ── Guarantees (inverted block like Approach) ─────────────────── */}
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

        {/* ── Recurring / Subscriptions ─────────────────────────────────── */}
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
              <p className="text-site-text-light max-w-2xl leading-relaxed">
                {s.recurring.subtitle}
              </p>
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
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-3xl md:text-4xl font-medium tracking-tighter">{plan.price}</span>
                    <span className="text-site-text-light text-sm">/mois</span>
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
              {/* Timeline line */}
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
                  {/* Dot */}
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
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-fluid-title tracking-tighter uppercase text-center">
                {language === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
              </h2>
            </motion.div>

            <div className="divide-y divide-site-border">
              {faq.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-medium pr-8 group-hover:text-site-accent transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "shrink-0 text-site-text-light transition-transform duration-300",
                        openFaq === idx && "rotate-180 text-site-accent"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-site-text-light leading-relaxed pb-6 pr-12">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
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
                  href="/contact"
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
    </div>
  );
}
