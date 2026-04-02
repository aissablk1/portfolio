"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  const { dict } = useLanguage();

  return (
    <section id="about" className="px-container section-padding border-t border-site-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
           <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 rounded-full bg-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
              {dict.nav.about}
            </span>
          </div>
          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-semibold text-site-text leading-relaxed">
              Je m&apos;appelle Aïssa. Je suis entrepreneur, builder, et architecte de systèmes — basé dans le sud de France, opérant partout.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-site-text leading-relaxed">
              Pas d&apos;héritage, pas de filet. Juste des années à apprendre, construire et tester — jusqu&apos;à maîtriser ce que beaucoup délèguent sans comprendre.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-site-text leading-relaxed">
              Ce qui me différencie ? Je vis dans les deux mondes à la fois : je comprends la stratégie business et je construis le système technique qui l&apos;exécute. Pas besoin de chef de projet entre vous et le code.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-site-text leading-relaxed">
              Si vous avez une idée de système — floue ou précise — je peux la transformer en quelque chose de réel.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative"
        >
             <div className="relative aspect-4/5 overflow-hidden rounded-4xl grayscale hover:grayscale-0 transition-all duration-700">
                <Image src="/assets/images/AISSABELKOUSSA.png" alt="AÏSSA BELKOUSSA" fill className="object-cover" />
                {/* Portrait Placeholder */}
                <div className="absolute inset-0 bg-linear-to-tr from-site-accent/20 to-transparent mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-site-text/10 font-display text-9xl font-bold select-none">AB</span>
                </div>
             </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-site-accent/10 blur-[100px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
