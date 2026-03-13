"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

const Expertises = () => {
  const { dict } = useLanguage();

  return (
    <section id="expertise" className="px-container section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-2 rounded-full bg-site-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
            {dict.nav.expertise}
          </span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-site-border">
          {dict.expertises.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Link
                href="/contact"
                className="bg-site-bg py-8 md:py-12 flex items-center justify-between group hover:px-8 transition-all duration-500 border-b border-site-border"
              >
                <h3 className="text-2xl md:text-4xl lg:text-5xl group-hover:italic transition-all uppercase tracking-tighter font-medium">
                  {item}
                </h3>
                <div className="w-12 h-12 rounded-full border border-site-border flex items-center justify-center group-hover:bg-site-accent group-hover:text-white transition-colors">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertises;
