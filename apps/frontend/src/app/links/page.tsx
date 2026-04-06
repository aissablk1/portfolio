"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, FileText, Stethoscope, Mail, MessageCircle, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import MeshGradient from "@/components/MeshGradient";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aissabelkoussa",
    svg: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/aissablk1",
    svg: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function LinksPage() {
  const { dict, language, setLanguage } = useLanguage();
  const l = dict.links;

  const links = [
    {
      label: l.portfolio,
      desc: l.portfolioDesc,
      href: "https://www.aissabelkoussa.fr",
      icon: Globe,
      primary: true,
    },
    {
      label: l.pricing,
      desc: l.pricingDesc,
      href: "https://www.aissabelkoussa.fr/services",
      icon: FileText,
    },
    {
      label: l.diagnostic,
      desc: l.diagnosticDesc,
      href: "https://www.aissabelkoussa.fr/diagnostic",
      icon: Stethoscope,
    },
    {
      label: l.blog,
      desc: l.blogDesc,
      href: "https://www.aissabelkoussa.fr/blog",
      icon: BookOpen,
    },
    {
      label: l.contact,
      desc: l.contactDesc,
      href: "https://www.aissabelkoussa.fr/contact",
      icon: Mail,
    },
    {
      label: l.whatsapp,
      desc: l.whatsappDesc,
      href: "https://wa.me/33782721406?text=Bonjour%20A%C3%AFssa%2C%20je%20viens%20de%20votre%20site.",
      icon: MessageCircle,
      whatsapp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden selection:bg-white selection:text-black">
      {/* Interactive mesh gradient + built-in film grain */}
      <MeshGradient />

      <div className="relative z-10 max-w-[420px] mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Language toggle */}
        <motion.div {...fade(0)} className="flex justify-end mb-8">
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5 border border-white/10">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                language === "fr" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                language === "en" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              EN
            </button>
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div {...fade(0.05)} className="flex flex-col items-center mb-10">
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
              <Image
                src="/assets/images/AISSABELKOUSSA.png"
                alt="Aïssa BELKOUSSA"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-[#0A0A0A]" />
          </div>

          <h1 className="text-xl font-bold tracking-tight mb-1">
            Aïssa BELKOUSSA
          </h1>
          <p className="text-[13px] text-white/40 mb-3">
            {l.subtitle}
          </p>

          {/* Availability badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              {l.available}
            </span>
          </div>
        </motion.div>

        {/* Links */}
        <div className="flex-1 space-y-2.5 mb-10">
          {links.map((link, i) => {
            const Icon = link.icon;
            const isPrimary = "primary" in link && link.primary;
            const isWhatsapp = "whatsapp" in link && link.whatsapp;

            return (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                {...fade(0.1 + i * 0.05)}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                  isPrimary
                    ? "border-white/20 bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                    : isWhatsapp
                      ? "border-[#25D366]/20 bg-[#25D366]/5 hover:border-[#25D366]/40 hover:bg-[#25D366]/10"
                      : "border-white/6 bg-white/3 hover:border-white/15 hover:bg-white/6"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isPrimary
                      ? "bg-black/5"
                      : isWhatsapp
                        ? "bg-[#25D366]/10"
                        : "bg-white/5"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isPrimary
                        ? "text-black"
                        : isWhatsapp
                          ? "text-[#25D366]"
                          : "text-white/60"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[13px] font-bold ${
                      isPrimary ? "text-black" : ""
                    }`}
                  >
                    {link.label}
                  </p>
                  <p
                    className={`text-[11px] truncate ${
                      isPrimary ? "text-black/50" : "text-white/30"
                    }`}
                  >
                    {link.desc}
                  </p>
                </div>
                <ArrowUpRight
                  size={14}
                  className={`shrink-0 opacity-0 group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isPrimary ? "text-black" : ""
                  }`}
                />
              </motion.a>
            );
          })}
        </div>

        {/* Socials */}
        <motion.div {...fade(0.45)} className="flex justify-center gap-3 mb-8">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full border border-white/6 bg-white/3 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/6 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                {s.svg}
              </svg>
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div {...fade(0.5)} className="text-center space-y-2">
          <p className="text-[10px] text-white/15 font-bold uppercase tracking-[0.2em]">
            aissabelkoussa.fr
          </p>
        </motion.div>
      </div>
    </div>
  );
}
