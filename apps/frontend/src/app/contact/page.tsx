"use client";

import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import CalendlyWidget from "@/components/CalendlyWidget";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

const ContactPage = () => {
  const { dict } = useLanguage();

  return (
    <div className="bg-site-bg min-h-screen selection:bg-black selection:text-white relative">
      <Header />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-site-accent/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-site-accent/5 blur-[150px] rounded-full -ml-80 -mb-80" />
      </div>

      <main className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            
            {/* Left Column: Context / Branding */}
            <div className="lg:col-span-4 lg:sticky lg:top-40 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-2 rounded-full bg-site-accent" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-text-light">
                    Initiation de projet
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-medium mb-8 leading-tight tracking-tight">
                  Construisons<br/>votre futur<br/><span className="italic font-light">système.</span>
                </h1>
                <p className="text-site-text-light leading-relaxed mb-12 max-w-sm">
                  Dites-moi tout sur vos ambitions. Que ce soit pour une architecture complexe, une automation intelligente ou un cockpit de données, je suis là pour structurer votre chaos.
                </p>
                
                <div className="space-y-6 pt-8 border-t border-site-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border border-site-border rounded-lg bg-white/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Disponibilité : Projets T2-T3</span>
                    </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: The Funnel */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/40 backdrop-blur-3xl border border-site-border p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-site-accent/5"
              >
                <Suspense fallback={<div className="min-h-[400px]" />}>
                  <ContactForm />
                </Suspense>
              </motion.div>
            </div>

          </div>

          {/* Calendly — Réservation directe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24"
          >
            <div className="flex items-center gap-6 mb-10">
              <div className="flex-1 h-px bg-site-border/50" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-text-light">
                Ou réservez directement
              </span>
              <div className="flex-1 h-px bg-site-border/50" />
            </div>
            <div className="bg-white/40 backdrop-blur-3xl border border-site-border rounded-[3rem] shadow-2xl shadow-site-accent/5 overflow-hidden">
              <div className="px-8 pt-10 pb-4 md:px-16 md:pt-14 md:pb-6">
                <h3 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-3">
                  Appel découverte
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-site-text-light/60">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    30 min
                  </span>
                  <span className="text-site-border">|</span>
                  <span>Google Meet</span>
                  <span className="text-site-border">|</span>
                  <span>Gratuit, sans engagement</span>
                </div>
                <p className="mt-4 text-sm text-site-text-light/50 max-w-xl leading-relaxed">
                  On fait le point sur votre besoin, votre budget et vos délais. Vous repartez avec une vision claire de ce qui est possible — même si on ne travaille pas ensemble.
                </p>
              </div>
              <Suspense fallback={<div className="min-h-[700px]" />}>
                <CalendlyWidget />
              </Suspense>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
