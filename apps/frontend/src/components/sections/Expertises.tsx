"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";

const letterVariants: Variants = {
  initial: { 
    opacity: 0.8, 
    y: 0, 
    fontStyle: "normal",
  },
  hover: (i: number) => {
    // Custom sequential delay with acceleration and deceleration
    // Sequential: one after the other
    let totalDelay = 0;
    for (let j = 0; j < i; j++) {
      // Delta between delays
      // If j < 10: slow (0.04)
      // If 10 <= j < 25: fast (0.015)
      // If j >= 25: slow again (0.03)
      if (j < 12) totalDelay += 0.04;
      else if (j < 28) totalDelay += 0.015;
      else totalDelay += 0.03;
    }
    
    return {
      opacity: 1,
      y: -4,
      fontStyle: "italic",
      color: "#ff3366", // Use exact accent color for perfect visual
      transition: {
        duration: 0.4,
        delay: totalDelay,
        ease: "easeOut"
      }
    };
  }
};

const Expertises = () => {
  const { dict } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="expertise" className="section-padding overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-container mb-24">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-site-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-site-text-light/60">
            {dict.nav.expertise}
          </span>
        </div>
      </div>

      <div className="border-t border-site-border">
        {dict.expertises.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.05 }}
            className="border-b border-site-border relative group"
          >
            <div className="max-w-7xl mx-auto px-container">
              <motion.button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                whileHover="hover"
                initial="initial"
                className="w-full py-10 md:py-14 flex items-center justify-between group text-left cursor-pointer outline-none"
              >
                <div className="max-w-[85%]">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-site-accent mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.microcopy}
                    </span>
                    <motion.h3 
                      className={cn(
                        "text-3xl md:text-5xl lg:text-7xl tracking-tighter font-medium uppercase flex flex-wrap gap-x-[0.25em] transition-transform duration-700",
                        openIndex === idx ? "text-site-accent italic md:translate-x-4" : "group-hover:translate-x-4"
                      )}
                    >
                      {item.title.split(" ").map((word, wordIdx, wordsArr) => {
                        const cumulativeIndex = wordsArr
                          .slice(0, wordIdx)
                          .reduce((acc, w) => acc + w.length + 1, 0);
                        
                        return (
                          <motion.span key={wordIdx} className="flex whitespace-nowrap">
                            {word.split("").map((char, charIdx) => (
                              <motion.span
                                key={charIdx}
                                variants={letterVariants}
                                custom={cumulativeIndex + charIdx}
                                className="inline-block"
                              >
                                {char}
                              </motion.span>
                            ))}
                          </motion.span>
                        );
                      })}
                    </motion.h3>
                </div>
                
                <div className={cn(
                    "w-10 h-10 md:w-16 md:h-16 rounded-full border border-site-border flex items-center justify-center transition-all duration-500 shrink-0 ml-4",
                    openIndex === idx ? "bg-site-accent border-site-accent text-white rotate-45" : "group-hover:border-site-accent group-hover:text-site-accent"
                )}>
                  <Plus className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
              </motion.button>
            </div>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden relative"
                >
                  {/* Background Scrolling Text - BLEED TO EDGE */}
                  <div className="absolute inset-0 pointer-events-none -z-10 select-none flex items-center">
                    <motion.div
                      initial={{ x: "0%" }}
                      animate={{ x: "-50%" }}
                      transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                      className="flex flex-row gap-20 whitespace-nowrap opacity-[0.03]"
                    >
                      {[...Array(4)].map((_, i) => (
                        <span 
                          key={i} 
                          className="text-[18rem] md:text-[35rem] font-display font-black uppercase leading-none"
                        >
                          {item.title}
                        </span>
                      ))}
                    </motion.div>
                  </div>

                  <div className="max-w-7xl mx-auto px-container relative z-10 pb-14 md:pb-20">
                    <div className="max-w-2xl md:pl-4">
                      <p className="text-lg md:text-2xl text-site-text-light leading-relaxed mb-10">
                        {item.description}
                      </p>
                      <Link 
                        href="/contact" 
                        className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-site-accent group/link"
                      >
                         <span className="border-b border-site-accent/30 group-hover/link:border-site-accent pb-1 transition-all">
                            {dict.contact.cta}
                         </span>
                         <Plus size={14} className="rotate-0 group-hover/link:rotate-90 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Expertises;
