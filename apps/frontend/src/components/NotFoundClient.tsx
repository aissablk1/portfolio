"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";

function NotFoundContent() {
  const { dict } = useLanguage();
  const t = dict.notFound;

  return (
    <div className="bg-site-bg min-h-screen relative">
      <Header />

      <main id="main-content" className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent mb-8"
          >
            {t.code}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight tracking-tight"
          >
            {t.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-site-text-light leading-relaxed mb-12 max-w-lg mx-auto"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
            >
              {t.seePlans}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-3 border border-site-border px-8 py-4 rounded-full font-display font-medium text-sm hover:border-site-accent hover:text-site-accent transition-colors"
            >
              {t.backHome}
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NotFoundClient() {
  return (
    <LanguageProvider>
      <NotFoundContent />
    </LanguageProvider>
  );
}
