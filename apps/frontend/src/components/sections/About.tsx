"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  const { dict } = useLanguage();

  return (
    <section id="about" className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
           <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 rounded-full bg-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
              {dict.nav.about}
            </span>
          </div>
          <div className="text-lg md:text-xl lg:text-2xl text-site-text-light leading-relaxed whitespace-pre-line">
            {dict.about.content}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative"
        >
             <div className="relative aspect-4/5 overflow-hidden rounded-4xl grayscale hover:grayscale-0 transition-all duration-700">
                <Image src="/assets/images/AISSABELKOUSSA.png" alt="AÏSSA BELKOUSSA" fill className="object-cover" />
                {/* Portrait Placeholder */}
                <div className="absolute inset-0 bg-linear-to-tr from-site-accent/20 to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-site-text/10 font-display text-9xl font-bold select-none">AB</span>
                </div>
             </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-site-accent/10 blur-[100px] rounded-full" />
             <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-site-border max-w-[200px]">
                <p className="text-xs font-bold leading-tight uppercase tracking-widest">
                    {dict.about.location}
                </p>
             </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
