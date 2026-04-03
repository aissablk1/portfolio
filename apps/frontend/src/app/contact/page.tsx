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

      <main id="main-content" className="relative z-10 pt-40 pb-32 px-container">
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
                    {dict.contactPage.badge}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-medium mb-8 leading-tight tracking-tight">
                  {dict.contactPage.heading.split("\n").map((line, i, arr) => (
                    <React.Fragment key={i}>{line}{i < arr.length - 1 && <br/>}</React.Fragment>
                  ))}
                  <br/><span className="italic font-light">{dict.contactPage.headingItalic}</span>
                </h1>
                <p className="text-site-text-light leading-relaxed mb-12 max-w-sm">
                  {dict.contactPage.intro}
                </p>
                
                <div className="space-y-6 pt-8 border-t border-site-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border border-site-border rounded-lg bg-white/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{dict.contactPage.availability}</span>
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
                {dict.contactPage.calendlySection}
              </span>
              <div className="flex-1 h-px bg-site-border/50" />
            </div>
            <div className="bg-white/40 backdrop-blur-3xl border border-site-border rounded-[2rem] shadow-2xl shadow-site-accent/5">
              <div className="px-8 pt-10 pb-4 md:px-12 md:pt-12 md:pb-4">
                <h3 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-3">
                  {dict.contactPage.calendlyTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-site-text-light/60">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {dict.contactPage.calendlyDuration}
                  </span>
                  <span className="text-site-border">|</span>
                  <span>{dict.contactPage.calendlyLocation}</span>
                  <span className="text-site-border">|</span>
                  <span>{dict.contactPage.calendlyFree}</span>
                </div>
                <p className="mt-4 text-sm text-site-text-light/50 max-w-xl leading-relaxed">
                  {dict.contactPage.calendlyDesc}
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
