"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Sparkles,
} from "lucide-react";

export default function GuideIAMerciPage() {
  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        <section className="px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <CheckCircle2 size={64} className="text-green-500 mx-auto" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-display font-medium tracking-tight leading-[1.1] mb-4"
            >
              Votre guide est en route !
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-site-text-light leading-relaxed mb-10"
            >
              Vérifiez votre boîte email. Le guide arrive dans les 2 prochaines minutes.
            </motion.p>

            {/* Lien direct PDF */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <a
                href="/assets/guides/guide-ia-dirigeants-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-site-border px-6 py-3 rounded-full font-display font-medium text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
              >
                <Download size={16} />
                Vous pouvez aussi le télécharger directement ici
                <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* CTA secondaires */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-2xl border border-site-accent/20 bg-site-accent/[0.02]">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={16} className="text-site-accent" />
                  <h2 className="text-base font-display font-medium">
                    En attendant, testez votre maturité digitale
                  </h2>
                </div>
                <p className="text-sm text-site-text-light mb-4">
                  2 minutes pour savoir où en est votre entreprise avec l'IA.
                </p>
                <Link
                  href="/diagnostic"
                  className="inline-flex items-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors"
                >
                  Lancer le diagnostic
                  <ArrowRight size={16} />
                </Link>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-display font-medium text-site-text-light hover:text-site-accent transition-colors"
              >
                Voir les offres
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
