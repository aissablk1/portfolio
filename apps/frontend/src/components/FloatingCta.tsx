"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { usePathname } from "next/navigation";

const FloatingCta = () => {
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();
  const pathname = usePathname();

  // Don't show on /services or /contact pages
  const hidden = pathname === "/services" || pathname === "/contact";

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-6 left-6 z-50 md:bottom-8 md:left-8"
        >
          <Link
            href="/services"
            className="flex items-center gap-2 bg-site-accent text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-site-accent/25 hover:shadow-site-accent/40 hover:scale-105 transition-all"
          >
            {language === "fr" ? "Voir les tarifs" : "View pricing"}
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCta;
