"use client";

import { ArrowUpRight, Calendar } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/aissabelkoussa/30min";

const CalendlyWidget = () => {
  return (
    <div className="w-full flex flex-col items-center gap-6 py-12">
      <div className="w-16 h-16 rounded-full bg-site-accent/10 flex items-center justify-center">
        <Calendar size={28} className="text-site-accent" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-display font-medium tracking-tight mb-2">
          Réserver un appel découverte
        </h3>
        <p className="text-sm text-site-text-light max-w-md">
          30 minutes pour cadrer votre projet. Gratuit, zéro engagement.
        </p>
      </div>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-site-accent text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
      >
        Choisir un créneau
        <ArrowUpRight size={14} />
      </a>
    </div>
  );
};

export default CalendlyWidget;
