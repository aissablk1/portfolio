"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

const Contact = () => {
  const { dict } = useLanguage();

  return (
    <section id="contact" className="px-container section-padding">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="w-16 h-16 bg-site-accent text-white rounded-full flex items-center justify-center mx-auto mb-12 shadow-xl shadow-site-accent/20">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-8 whitespace-pre-line text-balance font-medium tracking-tighter">
            {dict.contact.title}
          </h2>
          <p className="text-xl md:text-2xl text-site-text-light/60 mb-16 max-w-3xl mx-auto leading-relaxed">
            {dict.contact.subtitle}
          </p>
          <Link 
            href="/contact" 
            className="group relative inline-block px-12 py-6 rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-site-accent/20 overflow-hidden"
          >
            {/* Background Video */}
            <video 
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source data-src="/assets/videos/glitch-red.webm" type="video/webm" src="/assets/videos/glitch-red.webm" />
              <source data-src="/assets/videos/glitch-red.mp4" type="video/mp4" src="/assets/videos/glitch-red.mp4" />
            </video>
            
            {/* Button Content */}
            <span className="relative z-10 text-white flex items-center justify-center gap-2">
              {dict.contact.cta}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
