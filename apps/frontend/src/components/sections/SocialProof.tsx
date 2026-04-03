"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

const SocialProof = () => {
  const { dict } = useLanguage();
  const s = dict.socialProof;

  return (
    <section data-layer="Social_Proof" className="relative overflow-hidden">
      <div className="relative px-container section-padding border-t border-site-border">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 rounded-full bg-site-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-site-accent">
                {s.badge}
              </span>
            </div>
            <h2
              style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
              className="font-medium tracking-tighter uppercase max-w-2xl"
            >
              {s.title}
            </h2>
          </div>

          {/* Project cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-site-border border border-site-border rounded-2xl overflow-hidden mb-16">
            {s.projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.25, 1, 0.5, 1],
                }}
                data-layer="Project_Card"
                className="bg-site-bg p-8 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium tracking-tight uppercase">
                    {project.name}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-site-accent bg-site-accent/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {project.sector}
                  </span>
                </div>
                <p className="text-sm text-site-text-light leading-relaxed">
                  {project.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-16 md:gap-24">
            {s.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.15 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-medium tracking-tighter text-site-accent">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/50 mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialProof;
