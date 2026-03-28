"use client";

import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from "next/link";

const Systems = () => {
  const { dict } = useLanguage();

  return (
    <section id="systems" className="px-container section-padding">
      <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:mb-28">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 rounded-full bg-site-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
                {dict.systems.title}
              </span>
            </div>
            <p className="text-fluid-subtitle text-site-text-light/60 max-w-2xl">
              {dict.systems.intro}
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {dict.systems.items.map((system, idx) => (
            <Link key={system.id} href={`/projects/${system.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="group cursor-pointer"
              >
                <div className="aspect-4/3 bg-site-border/30 rounded-2xl mb-6 overflow-hidden border border-site-border relative">
                  {/* Visual placeholder for system/project */}
                  <div className="absolute inset-x-8 -bottom-12 top-12 bg-white rounded-t-xl shadow-2xl transition-transform duration-700 group-hover:-translate-y-8 p-6 flex flex-col gap-4">
                      <div className="w-1/2 h-2 bg-site-border rounded" />
                      <div className="w-full h-px bg-site-border" />
                      <div className="grid grid-cols-2 gap-4 h-full">
                          <div className="bg-site-border/10 rounded-lg aspect-video" />
                          <div className="bg-site-border/10 rounded-lg aspect-video" />
                      </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-tight">{system.title}</h3>
                <p className="text-sm font-medium mb-3 text-site-text-light">{system.sub}</p>
                <p className="text-sm text-site-text-light/60 leading-relaxed mb-4">
                  {system.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {system.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-1 rounded-full border border-site-border/50 text-site-text-light/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Systems;
