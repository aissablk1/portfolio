"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Zap, Layers, Building2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const tierIcons = [Zap, Layers, Building2];

export default function ServicesPage() {
  const { dict } = useLanguage();
  const s = dict.services;
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main className="pt-40 pb-32">
        {/* Hero */}
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
              <h1
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 1.05 }}
                className="font-medium tracking-tighter uppercase max-w-4xl mb-8"
              >
                {s.title}
              </h1>
              <p className="text-site-text-light text-lg md:text-xl max-w-2xl leading-relaxed">
                {s.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
              {s.tiers.map((tier, idx) => {
                const Icon = tierIcons[idx];
                const isHighlighted = idx === 1;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
                    onMouseEnter={() => setHoveredTier(idx)}
                    onMouseLeave={() => setHoveredTier(null)}
                    className={cn(
                      "relative bg-site-bg p-8 md:p-12 flex flex-col transition-colors duration-500",
                      isHighlighted && "bg-site-accent/[0.03]",
                      hoveredTier === idx && "bg-site-bg/50"
                    )}
                  >
                    {isHighlighted && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-site-accent" />
                    )}

                    <div className="flex items-center justify-between mb-8">
                      <div className={cn(
                        "w-12 h-12 rounded-full border flex items-center justify-center transition-colors",
                        isHighlighted ? "border-site-accent text-site-accent" : "border-site-border text-site-text-light"
                      )}>
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      {isHighlighted && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-site-accent bg-site-accent/10 px-3 py-1 rounded-full">
                          {s.popularBadge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-3">
                      {tier.name}
                    </h3>
                    <p className="text-site-text-light text-sm leading-relaxed mb-8 min-h-[60px]">
                      {tier.description}
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-medium tracking-tight">
                          {tier.price}
                        </span>
                      </div>
                      <p className="text-xs text-site-text-light/60 mt-1">{tier.priceNote}</p>
                    </div>

                    <div className="border-t border-site-border pt-8 mb-8 flex-1">
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
                    </div>

                    <div className="border-t border-site-border pt-6 mb-8">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-3">
                        {s.durationLabel}
                      </p>
                      <p className="text-sm text-site-text-light">{tier.duration}</p>
                    </div>

                    <Link
                      href="/contact"
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                        isHighlighted
                          ? "bg-site-accent text-white hover:bg-site-accent/90"
                          : "border border-site-border text-site-text hover:border-site-accent hover:text-site-accent"
                      )}
                    >
                      {s.cta}
                      <ArrowUpRight size={14} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Abonnement / Maintenance */}
        <section className="px-container mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <RotateCcw size={16} className="text-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.recurring.badge}
                </span>
              </div>

              <h2
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
                className="font-medium tracking-tighter uppercase max-w-3xl mb-6"
              >
                {s.recurring.title}
              </h2>
              <p className="text-site-text-light max-w-2xl mb-16 leading-relaxed">
                {s.recurring.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
              {s.recurring.plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-site-bg p-8 md:p-10 flex flex-col"
                >
                  <h4 className="text-lg font-medium tracking-tight uppercase mb-2">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl md:text-3xl font-medium tracking-tight">{plan.price}</span>
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
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-site-border text-xs font-bold uppercase tracking-widest hover:border-site-accent hover:text-site-accent transition-all"
                  >
                    {s.cta}
                    <ArrowUpRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
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
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                  {s.process.badge}
                </span>
              </div>
              <h2
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
                className="font-medium tracking-tighter uppercase max-w-3xl"
              >
                {s.process.title}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              {s.process.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="text-5xl font-medium tracking-tighter text-site-accent/20 mb-4">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3">{step.title}</h4>
                  <p className="text-sm text-site-text-light leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="px-container">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.2 }}
                className="font-medium tracking-tighter uppercase mb-6"
              >
                {s.finalCta.title}
              </h2>
              <p className="text-site-text-light mb-10 max-w-lg mx-auto">{s.finalCta.subtitle}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-site-accent/90 transition-colors"
              >
                {s.finalCta.button}
                <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
