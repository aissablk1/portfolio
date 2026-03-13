"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react";

const Expertises = () => {
  const { dict } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="expertise" className="px-container section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-24">
          <div className="w-2 h-2 rounded-full bg-site-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-site-text-light/60">
            {dict.nav.expertise}
          </span>
        </div>

        <div className="grid grid-cols-1 border-t border-site-border">
          {dict.expertises.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
              className="border-b border-site-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full py-10 md:py-14 flex items-center justify-between group text-left cursor-pointer outline-none"
              >
                <div className="max-w-[70%]">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-site-accent mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.microcopy}
                    </span>
                    <h3 className={cn(
                        "text-3xl md:text-5xl lg:text-6xl tracking-tighter transition-all duration-500 font-medium uppercase",
                        openIndex === idx ? "text-site-accent italic md:translate-x-4" : "opacity-80 group-hover:opacity-100 group-hover:translate-x-4"
                    )}>
                      {item.title}
                    </h3>
                </div>
                
                <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-full border border-site-border flex items-center justify-center transition-all duration-500",
                    openIndex === idx ? "bg-site-accent border-site-accent text-white rotate-45" : "group-hover:border-site-accent group-hover:text-site-accent"
                )}>
                  <Plus size={window?.innerWidth < 768 ? 20 : 28} strokeWidth={1.5} />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-14 md:pb-20 max-w-2xl md:pl-4">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertises;
