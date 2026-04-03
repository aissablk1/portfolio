"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Offers = () => {
  const { dict } = useLanguage();

  const pillars = [
    dict.offers.pillar1Props,
    dict.offers.pillar2Props,
    dict.offers.pillar3Props,
  ];

  return (
    <section id="offers" data-layer="Offers" className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-2 rounded-full bg-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
              {dict.offers.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
            >
              <Link
                href="/contact"
                data-layer="Offer_Card"
                className="h-full bg-site-bg p-8 md:p-12 flex flex-col justify-between hover:bg-site-bg/50 transition-colors group"
              >
                <div>
                  <h3 data-layer="Offer_Title" className="text-fluid-title mb-6 font-medium uppercase tracking-tighter">
                    {pillar.title}
                  </h3>
                  <p className="text-site-text-light leading-relaxed text-[15px]">
                    {pillar.sub}
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-site-accent transition-all">
                  Initier <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-accent transition-colors"
          >
            {dict.nav.services} & Tarifs <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Offers;
