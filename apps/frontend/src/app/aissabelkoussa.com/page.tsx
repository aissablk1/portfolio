"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import {
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  Scale,
  Eye,
  FileWarning,
  ArrowRight,
  Globe,
  Server,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";

export default function DomainAlertPage() {
  const { dict, language } = useLanguage();
  const d = dict.domainAlert;

  const [isOnLegitDomain, setIsOnLegitDomain] = React.useState(false);

  React.useEffect(() => {
    setIsOnLegitDomain(
      window.location.hostname.endsWith("aissabelkoussa.fr")
    );
  }, []);

  return (
    <div className="bg-site-bg min-h-screen selection:bg-red-600 selection:text-white relative">
      <Header />

      {/* Background Ambience — red tint */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full -mr-80 -mt-80" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full -ml-64 -mb-64" />
      </div>

      <main className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-600/20">
              <ShieldAlert size={16} className="text-red-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">
              {d.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-medium mb-6 leading-tight tracking-tight"
          >
            {d.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-site-text-light leading-relaxed mb-16 max-w-2xl"
          >
            {d.subtitle}
          </motion.p>

          {/* What Happened */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileWarning size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.whatHappened.title}
              </h2>
            </div>
            <p className="text-site-text-light leading-relaxed pl-[30px]">
              {d.whatHappened.description}
            </p>
          </motion.section>

          {/* Facts — card grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.facts.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-[30px]">
              {[
                {
                  icon: Globe,
                  label: "Domaine",
                  value: d.facts.domain,
                },
                {
                  icon: User,
                  label: "Detenteur",
                  value: d.facts.holder,
                },
                {
                  icon: Server,
                  label: "Registrar",
                  value: d.facts.registrar,
                },
                {
                  icon: Calendar,
                  label: "Enregistre le",
                  value: d.facts.registeredOn,
                },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="p-5 rounded-2xl border border-site-border bg-white/50 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <fact.icon
                      size={14}
                      className="text-site-text-light"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light">
                      {fact.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-site-text">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Violations */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={18} className="text-red-600" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.violations.title}
              </h2>
            </div>
            <ul className="space-y-4 pl-[30px]">
              {d.violations.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span className="text-site-text-light leading-relaxed text-[15px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Actions taken */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.actions.title}
              </h2>
            </div>
            <ul className="space-y-4 pl-[30px]">
              {d.actions.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-site-accent shrink-0" />
                  <span className="text-site-text-light leading-relaxed text-[15px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Legal basis */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Scale size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.legal.title}
              </h2>
            </div>
            <div className="pl-[30px] space-y-3">
              {d.legal.articles.map((article, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-site-border bg-white/50 backdrop-blur-sm"
                >
                  <p className="text-sm text-site-text-light">{article}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Legitimate domain CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="p-8 md:p-12 rounded-[2rem] border border-site-border bg-site-accent text-white">
              <h2 className="text-2xl md:text-3xl font-display font-medium mb-4 tracking-tight">
                {d.legitimateDomain.title}
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-xl">
                {d.legitimateDomain.description}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="https://www.aissabelkoussa.fr"
                  className="inline-flex items-center gap-3 bg-white text-site-accent px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  {d.legitimateDomain.cta}
                  <ArrowRight size={16} />
                </Link>
                {isOnLegitDomain && (
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    {language === "fr" ? "Vous y \u00eates d\u00e9j\u00e0" : "You are already here"}
                  </span>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
