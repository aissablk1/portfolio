"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

const Approach = () => {
  const { dict } = useLanguage();

  return (
    <section id="approach" data-layer="Approach" className="px-container section-padding bg-site-accent text-white rounded-4xl md:rounded-[4rem] mx-2 md:mx-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                {dict.nav.approach}
              </span>
            </div>
            <h2 className="text-fluid-display text-balance mb-8">
              {dict.approach.bio}
            </h2>
            <p className="text-lg opacity-60 max-w-md">
              {dict.approach.intro}
            </p>
          </div>
          <div className="lg:pt-12">
            <p className="text-fluid-subtitle opacity-80 leading-relaxed italic border-l border-white/30 pl-8">
              "{dict.approach.subtitle}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/10 pt-16">
          {dict.approach.pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="text-xl mb-4 font-medium">{idx + 1}. {pillar.title}</div>
              <p className="text-sm opacity-60 leading-relaxed">
                {pillar.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
