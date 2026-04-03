"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function ExitIntentModal() {
  const { dict } = useLanguage();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // Only on desktop (no mouseout on mobile)
    if (window.innerWidth < 1024) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && !dismissed) {
        setShow(true);
      }
    };

    // Delay activation by 5 seconds to avoid false triggers
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handler);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handler);
    };
  }, [dismissed]);

  const close = () => {
    setShow(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="relative bg-site-bg rounded-3xl p-10 md:p-14 max-w-lg w-full shadow-2xl border border-site-border"
          >
            <button
              onClick={close}
              className="absolute top-5 right-5 text-site-text-light hover:text-site-text transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-site-accent mb-4">
                {dict.exitIntent.badge}
              </p>
              <h3 className="text-2xl md:text-3xl font-display font-medium tracking-tighter uppercase mb-4">
                {dict.exitIntent.title}
              </h3>
              <p className="text-site-text-light text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                {dict.exitIntent.subtitle}
              </p>

              <Link
                href="/contact?plan=accelerateur"
                onClick={close}
                className="inline-flex items-center gap-3 bg-site-accent text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
              >
                {dict.exitIntent.cta}
                <ArrowUpRight size={14} />
              </Link>

              <p className="text-[10px] text-site-text-light/40 mt-4">
                {dict.exitIntent.trust}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
