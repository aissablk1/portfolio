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

        <div className="hidden md:block lg:block lg:col-span-4 relative h-[600px] -mr-20">
           <div className="absolute inset-0 bg-size-[32px_32px] bg-[radial-gradient(var(--color-site-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]">
              <Globe />
           </div>
           
           {/* Custom SVG Cursor */}
           <motion.div
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
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4308 23.9996L18.1958 23.0586L15.4215 17.857H19.025L11 9.81396V21.002L13.5298 18.5599L16.4308 23.9996Z" fill="black"/>
              <path d="M15.9896 24.2348L16.2249 24.676L16.666 24.4408L18.431 23.4998L18.8723 23.2645L18.637 22.8233L16.2548 18.357H19.025H20.2302L19.3789 17.5038L11.3539 9.46081L10.5 8.60494V9.81396V21.002V22.1796L11.3473 21.3617L13.4004 19.3798L15.9896 24.2348Z" stroke="white"/>
              </g>
              <defs>
              <filter id="filter0_d_273_3983" x="8" y="6.39594" width="15.4355" height="21.9565" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
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

            {/* Figma Selection Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute inset-0 z-10 pointer-events-none border border-[#18A0FB]/40 bg-[#18A0FB]/[0.02]"
            >
              {/* Corner Handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm" />
              
              {/* Selection Label (Optional but very Figma-esque) */}
              <div className="absolute -top-8 left-0 bg-[#18A0FB] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-tighter">
                Globe_Component
              </div>
            </motion.div>

           {/* Subtle glow behind globe */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-site-accent/5 blur-[120px] -z-10 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
