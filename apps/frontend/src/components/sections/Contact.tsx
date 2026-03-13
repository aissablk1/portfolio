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
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-site-accent text-white rounded-full flex items-center justify-center mx-auto mb-12 shadow-xl shadow-site-accent/20">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-16 whitespace-pre-line text-balance font-medium tracking-tighter uppercase">
            {dict.contact.title}
          </h2>
          <Link href="/contact" className="inline-block bg-site-accent text-white px-12 py-6 rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 hover:shadow-2xl transition-all shadow-xl shadow-site-accent/20">
            {dict.contact.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
