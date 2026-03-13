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
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
              {dict.systems.title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {dict.systems.items.map((system, idx) => (
            <Link key={system.id} href={`/projects/${system.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
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
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{system.title}</h3>
                <p className="text-sm font-medium mb-3">{system.sub}</p>
                <p className="text-xs text-site-text-light leading-relaxed">
                  {system.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Systems;
