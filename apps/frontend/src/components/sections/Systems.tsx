"use client";

import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const Systems = () => {
  const { dict } = useLanguage();

  return (
    <section id="systems" className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-2 rounded-full bg-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-accent">
              {dict.systems.title}
            </span>
          </div>
          <h2
            style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
            className="font-medium tracking-tighter uppercase max-w-2xl"
          >
            {dict.systems.intro}
          </h2>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {dict.systems.items.map((system, idx) => (
            <Link key={system.id} href={`/projects/${system.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="group cursor-pointer"
              >
                {/* Visual card — abstract system preview */}
                <div
                  className="aspect-[4/3] rounded-2xl mb-8 overflow-hidden relative border border-site-border"
                  style={{ backgroundColor: system.color }}
                >
                  {/* Grid pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Floating UI mockup */}
                  <div className="absolute inset-x-8 sm:inset-x-10 -bottom-16 top-10 sm:top-14 bg-white rounded-t-xl shadow-[0_-8px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 ease-out group-hover:-translate-y-4">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-red-300" />
                      <div className="w-2 h-2 rounded-full bg-yellow-300" />
                      <div className="w-2 h-2 rounded-full bg-green-300" />
                      <div className="ml-3 h-4 w-28 bg-gray-100 rounded-full" />
                    </div>
                    {/* Content skeleton */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: `${system.color}30` }}
                        />
                        <div className="h-2.5 w-24 bg-gray-100 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-50 rounded" />
                        <div className="h-2 w-3/4 bg-gray-50 rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div
                          className="h-16 rounded-lg"
                          style={{ backgroundColor: `${system.color}08` }}
                        />
                        <div
                          className="h-16 rounded-lg"
                          style={{ backgroundColor: `${system.color}08` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Glow accent */}
                  <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: system.color }}
                  />
                </div>

                {/* Text content */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl font-bold uppercase tracking-tight leading-tight">
                    {system.title}
                  </h3>
                  <div className="mt-1 w-8 h-8 rounded-full border border-site-border flex items-center justify-center shrink-0 group-hover:bg-site-accent group-hover:border-site-accent transition-colors duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 text-site-text-light group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <p className="text-sm font-medium text-site-text-light mb-3">
                  {system.sub}
                </p>

                <p className="text-sm text-site-text-light/60 leading-relaxed mb-5">
                  {system.desc}
                </p>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-2">
                  {system.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-site-border/50 text-site-text-light/60 group-hover:border-site-text/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Systems;
