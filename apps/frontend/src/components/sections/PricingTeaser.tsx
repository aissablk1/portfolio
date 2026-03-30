"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap, Layers, Building2 } from "lucide-react";
import Link from "next/link";

const icons = [Zap, Layers, Building2];

const PricingTeaser = () => {
  const { dict } = useLanguage();
  const s = dict.services;

  return (
    <section className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 rounded-full bg-site-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
            {s.badge}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <h2
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
            className="font-medium tracking-tighter uppercase max-w-2xl whitespace-pre-line"
          >
            {s.title}
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-accent hover:underline underline-offset-4 shrink-0"
          >
            {s.cta} <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
          {s.tiers.map((tier, idx) => {
            const Icon = icons[idx];
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
                  className="h-full bg-site-bg p-8 md:p-12 flex flex-col justify-between hover:bg-site-bg/50 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Icon size={18} className="text-site-text-light" strokeWidth={1.5} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40">
                        {tier.duration}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tighter mb-4">
                      {tier.name}
                    </h3>
                    <p className="text-site-text-light text-sm leading-relaxed mb-6">
                      {tier.description}
                    </p>
                    <p className="text-lg font-medium tracking-tight">
                      {tier.price}
                    </p>
                  </div>
                  <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-site-accent transition-all">
                    {s.cta} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingTeaser;
