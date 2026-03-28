"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldCheck,
  Globe,
  Server,
  Calendar,
  User,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Lock,
  Eye,
  FileCheck,
  Wifi,
  Cloud,
  ShieldX,
  Mail,
  Activity,
} from "lucide-react";

export default function DomainLegitPage() {
  const { dict } = useLanguage();
  const d = dict.domainLegit;

  return (
    <div className="bg-site-bg min-h-screen selection:bg-emerald-600 selection:text-white relative">
      <Header />

      {/* Background Ambience — green tint */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[150px] rounded-full -mr-80 -mt-80" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -ml-64 -mb-64" />
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
            <div className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-600/20">
              <ShieldCheck size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
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

          {/* Ownership */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.ownership.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-[30px]">
              {[
                {
                  icon: Globe,
                  label: "Domaine",
                  value: d.ownership.domain,
                },
                {
                  icon: User,
                  label: "Titulaire",
                  value: d.ownership.holder,
                },
                {
                  icon: Server,
                  label: "Registrar",
                  value: d.ownership.registrar,
                },
                {
                  icon: Calendar,
                  label: "Enregistre en",
                  value: d.ownership.createdOn,
                },
                {
                  icon: Wifi,
                  label: "DNS",
                  value: d.ownership.dns,
                },
                {
                  icon: Cloud,
                  label: "Hebergement",
                  value: d.ownership.hosting,
                },
                {
                  icon: ShieldX,
                  label: "SSL",
                  value: d.ownership.ssl,
                },
                {
                  icon: Globe,
                  label: "IP",
                  value: d.ownership.ip,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: d.ownership.email,
                },
                {
                  icon: Activity,
                  label: "Statut",
                  value: d.ownership.status,
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

          {/* Why this page */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileCheck size={18} className="text-site-text" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.whyThisPage.title}
              </h2>
            </div>
            <p className="text-site-text-light leading-relaxed pl-[30px]">
              {d.whyThisPage.description}
            </p>
          </motion.section>

          {/* Verification */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-emerald-600" />
              <h2 className="text-2xl font-display font-medium tracking-tight">
                {d.verification.title}
              </h2>
            </div>
            <ul className="space-y-4 pl-[30px]">
              {d.verification.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-site-text-light leading-relaxed text-[15px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Usurpation alert CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="p-8 md:p-12 rounded-[2rem] border border-red-600/20 bg-red-600/5">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={20} className="text-red-600" />
                <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight">
                  {d.usurpation.title}
                </h2>
              </div>
              <p className="text-site-text-light leading-relaxed mb-8 max-w-xl">
                {d.usurpation.description}
              </p>
              <Link
                href="/aissabelkoussa.com"
                className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-red-700 transition-colors"
              >
                {d.usurpation.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
