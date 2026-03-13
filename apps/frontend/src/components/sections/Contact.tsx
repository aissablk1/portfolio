"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

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
          <div className="w-16 h-16 bg-site-accent text-white rounded-full flex items-center justify-center mx-auto mb-12">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl leading-tight mb-16 whitespace-pre-line text-balance">
            {dict.contact.title}
          </h2>
          <button className="bg-site-accent text-white px-12 py-6 rounded-full text-lg font-medium hover:scale-105 transition-transform shadow-2xl shadow-black/20">
            {dict.contact.cta}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
