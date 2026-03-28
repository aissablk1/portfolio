"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="bg-site-bg min-h-screen relative">
      <Header />

      <main className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent mb-8"
          >
            404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight tracking-tight"
          >
            {language === "fr"
              ? "Cette page n'existe pas."
              : "This page doesn't exist."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-site-text-light leading-relaxed mb-12 max-w-lg mx-auto"
          >
            {language === "fr"
              ? "L'URL que vous avez suivie ne mene nulle part. Revenez a la base."
              : "The URL you followed leads nowhere. Head back to base."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
            >
              {language === "fr" ? "Retour a l'accueil" : "Back to home"}
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
