"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Offers = () => {
  const { dict } = useLanguage();

  const pillars = [
    dict.offers.pillar1Props,
    dict.offers.pillar2Props,
    dict.offers.pillar3Props,
  ];

  return (
    <section id="offers" className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-2 rounded-full bg-site-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
            {dict.offers.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-site-bg p-8 md:p-12 flex flex-col justify-between hover:bg-site-bg/50 transition-colors group cursor-pointer"
            >
              <div>
                <h3 className="text-2xl md:text-3xl mb-4 leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-site-text-light leading-relaxed">
                  {pillar.sub}
                </p>
              </div>
              <div className="mt-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {dict.nav.expertise} <ArrowUpRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
