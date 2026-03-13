"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "@/components/ui/globe";

import Link from "next/link";

const Hero = () => {
  const { dict } = useLanguage();

  return (
    <section className="px-container pt-40 pb-20 md:pt-60 md:pb-32">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
        <div className="col-span-12 lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl text-balance line-clamp-4"
          >
            {dict.hero.title}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="mt-12"
          >
            <p className="max-w-xl text-lg md:text-xl text-site-text-light leading-relaxed mb-12">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-site-accent text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-105 transition-transform text-center">
                {dict.hero.ctaPrimary}
              </Link>
              <button className="border border-site-border px-8 py-4 rounded-full text-sm font-medium hover:bg-site-border/20 transition-colors">
                {dict.hero.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block lg:block lg:col-span-4 relative h-[500px]">
           <div className="absolute inset-0 bg-size-[32px_32px] bg-[radial-gradient(var(--color-site-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]">
              <Globe />
           </div>
           {/* Subtle glow behind globe */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-site-accent/5 blur-[120px] -z-10 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
