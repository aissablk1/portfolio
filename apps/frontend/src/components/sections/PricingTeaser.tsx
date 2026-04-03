"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, Rocket, Handshake, GraduationCap, Gift } from "lucide-react";
import Link from "next/link";

const icons = [Zap, Rocket, Handshake, GraduationCap];

const PricingTeaser = () => {
  const { dict } = useLanguage();
  const s = dict.services;
  const pt = dict.pricingTeaser;

  return (
    <section id="pricing" data-layer="Pricing" className="relative overflow-hidden">
      {/* Fond accent subtil pour casser le scroll */}
      <div className="absolute inset-0 bg-site-accent/[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-site-accent)_0%,transparent_70%)] opacity-[0.04]" />

      <div className="relative px-container section-padding border-t border-b border-site-accent/10">
        <div className="max-w-7xl mx-auto">

          {/* Header + stats */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-2 rounded-full bg-site-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-site-accent">
                  {s.badge}
                </span>
              </div>
              <h2
                style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
                className="font-medium tracking-tighter uppercase max-w-2xl whitespace-pre-line"
              >
                {s.title}
              </h2>
            </div>

            {/* Social proof stats */}
            <div className="flex gap-12">
              {pt.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-medium tracking-tighter text-site-accent">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
            {s.tiers.map((tier, idx) => {
              const Icon = icons[idx];
              const isHighlight = idx === 1;
              const tierBadge = tier.badge;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Link
                    href="/services"
                    data-layer="Pricing_Card"
                    className={`h-full bg-site-bg p-8 md:p-10 flex flex-col justify-between transition-colors group ${isHighlight ? "bg-site-accent/[0.04] hover:bg-site-accent/[0.08]" : "hover:bg-black/[0.02]"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isHighlight ? "text-site-accent" : "text-site-text-light"} strokeWidth={1.5} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40">
                            {tier.tag}
                          </span>
                        </div>
                        {tierBadge && (
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isHighlight ? "text-site-accent bg-site-accent/10" : "text-site-accent bg-site-accent/10"}`}>
                            {tierBadge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium uppercase tracking-tighter mb-4">
                        {tier.name}
                      </h3>
                      <p className="text-site-text-light text-sm leading-relaxed mb-8">
                        {tier.description}
                      </p>
                      <div>
                        <p className="text-xl md:text-2xl font-medium tracking-tight">
                          {tier.price}
                        </p>
                        {tier.monthlyPrice && (
                          <p className="text-xs text-site-text-light mt-1">
                            {pt.then} {tier.monthlyPrice}{pt.month}
                          </p>
                        )}
                        {tier.monthlyNote && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <Gift size={10} />
                            {tier.monthlyNote}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-site-accent transition-all">
                      {s.cta} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-site-accent/85 transition-all hover:scale-105"
            >
              {pt.allDetails}
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
