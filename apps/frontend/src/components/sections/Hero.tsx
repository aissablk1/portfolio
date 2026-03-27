"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Hero = () => {
  const { dict } = useLanguage();
  const [rect, setRect] = React.useState({
    x: 0,
    y: 0,
    width: 400,
    height: 480,
  });

  // Handle resizing from the bottom-right for simplicity and high-fidelity feel
  // In a full implementation, we'd handle all 8 handles, but for a "Hero" demo,
  // smooth bottom-right resizing + full dragging is usually the "wow" factor.
  const handleResize = (event: any, info: any) => {
    setRect(prev => ({
      ...prev,
      width: Math.max(100, prev.width + info.delta.x),
      height: Math.max(100, prev.height + info.delta.y),
    }));
  };

  return (
    <section className="px-container pt-40 pb-20 md:pt-60 md:pb-32">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
        <div className="col-span-12 lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-tight text-balance whitespace-pre-line"
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

            {/* Interactive Figma Selection Box */}
            <motion.div
              drag
              dragMomentum={false}
              style={{
                width: rect.width,
                height: rect.height,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute top-10 left-10 z-10 border-2 border-[#18A0FB] bg-[#18A0FB]/5 shadow-[0_0_30px_rgba(24,160,251,0.1)] group active:cursor-grabbing hover:bg-[#18A0FB]/8 transition-colors cursor-grab"
            >
              {/* Corner Handles */}
              {[
                { pos: "-top-1.5 -left-1.5", cursor: "nw-resize" },
                { pos: "-top-1.5 -right-1.5", cursor: "ne-resize" },
                { pos: "-bottom-1.5 -left-1.5", cursor: "sw-resize" },
              ].map((handle, i) => (
                <div key={i} className={cn("absolute w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm shadow-sm z-20", handle.pos)} />
              ))}

              {/* Edge Handles (Visual Only) */}
              {[
                { pos: "top-1/2 -left-1.5 -translate-y-1/2", cursor: "e-resize" },
                { pos: "top-1/2 -right-1.5 -translate-y-1/2", cursor: "e-resize" },
                { pos: "-top-1.5 left-1/2 -translate-x-1/2", cursor: "n-resize" },
                { pos: "-bottom-1.5 left-1/2 -translate-x-1/2", cursor: "n-resize" },
              ].map((handle, i) => (
                <div key={i} className={cn("absolute w-3 h-3 bg-white border-2 border-[#18A0FB] rounded-sm shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity", handle.pos)} />
              ))}
              
              {/* Active Resize Handle (Bottom Right) */}
              <motion.div 
                className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-[#18A0FB] rounded-sm cursor-nwse-resize z-30 shadow-md hover:scale-150 transition-transform"
                drag
                dragMomentum={false}
                dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
                onDrag={handleResize}
                whileTap={{ scale: 1.2 }}
              />
              
              {/* Selection Label - Figma Brand Style */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-8 left-[-2px] bg-[#18A0FB] text-white text-[11px] px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl select-none"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="opacity-70 font-medium">Layer</span>
                <span className="border-l border-white/20 pl-2">Globe_Visual_Engine</span>
              </motion.div>

              {/* Real-time Dimensions HUD */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#18A0FB] text-white text-[9px] px-2 py-0.5 rounded-full font-mono shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-1">
                W: {Math.round(rect.width)}  H: {Math.round(rect.height)}
              </div>

              {/* Subtle grid pattern inside box */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#18A0FB_1px,transparent_1px),linear-gradient(to_bottom,#18A0FB_1px,transparent_1px)] bg-size-[20px_20px]" />
            </motion.div>

        </div>
      </div>
      
      <div className="sticky bottom-[-125px] w-full max-w-7xl mx-auto mb-0 px-container pb-0 overflow-hidden flex justify-center">
        <motion.div
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
