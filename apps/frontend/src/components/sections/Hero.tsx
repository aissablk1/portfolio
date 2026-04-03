"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import Link from "next/link";
// cn removed — FigmaSelector is now a separate component

const Hero = () => {
  const { dict } = useLanguage();
  // Note: FigmaSelector is now a separate component rendered in page.tsx

  return (
    <section className="px-container pt-32 pb-16 md:pt-60 md:pb-32" data-layer="Hero">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 md:gap-12 items-center">
        <div className="col-span-12 lg:col-span-7">
          <motion.h1
            data-layer="Headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-fluid-hero tracking-tight text-balance whitespace-pre-line"
          >
            {dict.hero.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="mt-8 md:mt-12"
          >
            <p data-layer="Subtitle" className="max-w-xl text-base md:text-lg lg:text-fluid-body text-site-text-light mb-8 md:mb-12">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" data-layer="CTA_Primary" className="bg-site-accent text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-105 transition-transform text-center">
                {dict.hero.ctaPrimary}
              </Link>
              <Link href="/services" data-layer="CTA_Secondary" className="border border-site-accent/40 text-site-accent px-8 py-4 rounded-full text-sm font-medium hover:bg-site-accent hover:text-white transition-all text-center">
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:block lg:block lg:col-span-4 relative h-[600px] -mr-20"
             style={{
                      mask: "linear-gradient(to bottom, transparent 0%, black 8%, black 82%, transparent 100%), linear-gradient(to left, transparent 0%, black 15%)",
                      WebkitMask: "linear-gradient(to bottom, transparent 0%, black 8%, black 82%, transparent 100%), linear-gradient(to left, transparent 0%, black 15%)",
                      maskComposite: "intersect",
                      WebkitMaskComposite: "destination-in",
                    }}
        >
           <div data-layer="Globe" className="absolute inset-0 bg-size-[32px_32px] bg-[radial-gradient(var(--color-site-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]">
              <Globe />
           </div>
           
           {/* Custom SVG Cursor */}
           <motion.div
             data-layer="Cursor"
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{
               opacity: 1,
               scale: 1,
               y: [0, -20, 0],
               x: [0, 50, 0]
             }}
             transition={{
               opacity: { duration: 1, delay: 1.5 },
               scale: { duration: 1, delay: 1.5 },
               y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
               x: { duration: 6, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute bottom-[20%] right-[10%] z-20 pointer-events-none"
           >
             <svg width="250" height="250" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              <g filter="url(#filter0_d_273_3983)">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.4308 23.9996L18.1958 23.0586L15.4215 17.857H19.025L11 9.81396V21.002L13.5298 18.5599L16.4308 23.9996Z" fill="black"/>
              <path d="M15.9896 24.2348L16.2249 24.676L16.666 24.4408L18.431 23.4998L18.8723 23.2645L18.637 22.8233L16.2548 18.357H19.025H20.2302L19.3789 17.5038L11.3539 9.46081L10.5 8.60494V9.81396V21.002V22.1796L11.3473 21.3617L13.4004 19.3798L15.9896 24.2348Z" stroke="white"/>
              </g>
              <defs>
              <filter id="filter0_d_273_3983" x="8" y="6.39594" width="15.4355" height="21.9565" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="1"/>
              <feGaussianBlur stdDeviation="1"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4049 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_273_3983"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_273_3983" result="shape"/>
              </filter>
              </defs>
              </svg>
           </motion.div>

        </div>
      </div>
      
      <div data-layer="Scroll_Indicator" className="sticky bottom-[-125px] w-full max-w-7xl mx-auto mb-0 px-container pb-0 overflow-hidden flex justify-center">
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-20 mb-0 w-full flex flex-col pt-20 pb-0 items-center gap-1"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "linear"
              }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] select-none"
            >
              Scroll ⭣
            </motion.span>
          ))}
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-linear-to-b from-white/20 to-transparent mt-4"
          />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
