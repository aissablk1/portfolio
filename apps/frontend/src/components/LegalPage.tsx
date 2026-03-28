"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

interface LegalSection {
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  badge: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPage({
  badge,
  title,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <div className="bg-site-bg min-h-screen relative">
      <Header />

      <main className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2 rounded-xl bg-site-accent/10 border border-site-accent/20">
              <Scale size={16} className="text-site-accent" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
              {badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-medium mb-4 leading-tight tracking-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-site-text-light mb-16"
          >
            Dernière mise à jour : {lastUpdated}
          </motion.p>

          {/* Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-12"
          >
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-lg font-display font-medium tracking-tight mb-4 flex items-baseline gap-3">
                  <span className="text-site-accent text-sm font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="text-site-text-light leading-relaxed text-[15px] space-y-3 pl-[36px]">
                  {section.content}
                </div>
              </section>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
