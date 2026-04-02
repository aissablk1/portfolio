"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import { cn } from "@/utils/cn";
import { Calculator, TrendingUp } from "lucide-react";

const trades = {
  fr: [
    { id: "plombier", label: "Plombier", hourlyValue: 65 },
    { id: "electricien", label: "Électricien", hourlyValue: 60 },
    { id: "macon", label: "Maçon", hourlyValue: 55 },
    { id: "menuisier", label: "Menuisier", hourlyValue: 58 },
    { id: "consultant", label: "Consultant / Formateur", hourlyValue: 80 },
    { id: "agence", label: "Agence / Prestataire B2B", hourlyValue: 75 },
    { id: "autre", label: "Autre métier", hourlyValue: 50 },
  ],
  en: [
    { id: "plumber", label: "Plumber", hourlyValue: 65 },
    { id: "electrician", label: "Electrician", hourlyValue: 60 },
    { id: "mason", label: "Mason", hourlyValue: 55 },
    { id: "carpenter", label: "Carpenter", hourlyValue: 58 },
    { id: "consultant", label: "Consultant / Trainer", hourlyValue: 80 },
    { id: "agency", label: "Agency / B2B provider", hourlyValue: 75 },
    { id: "other", label: "Other", hourlyValue: 50 },
  ],
};

export default function ROICalculator() {
  const { language } = useLanguage();
  const tradeList = trades[language];
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [hoursLost, setHoursLost] = useState(12);

  const trade = tradeList.find((t) => t.id === selectedTrade);
  const hourlyValue = trade?.hourlyValue ?? 60;
  const automationRatio = 0.85;
  const hoursSaved = Math.round(hoursLost * automationRatio);
  const weeklySaved = hoursSaved * hourlyValue;
  const yearlySaved = weeklySaved * 48;
  const weeksToROI = Math.ceil(2900 / weeklySaved);

  const hasResult = selectedTrade !== null;

  return (
    <section className="px-container section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <Calculator size={16} className="text-site-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">
              {language === "fr" ? "Calculez votre ROI" : "Calculate your ROI"}
            </span>
          </div>
          <h2 className="text-fluid-title tracking-tighter uppercase max-w-3xl mb-6 whitespace-pre-line">
            {language === "fr"
              ? "Combien vous coûte\nchaque semaine sans système ?"
              : "How much is each week\nwithout a system costing you?"}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trade selection */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60 mb-4 block">
                {language === "fr" ? "Votre métier" : "Your trade"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {tradeList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrade(t.id)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold uppercase tracking-wider text-left transition-all duration-200",
                      selectedTrade === t.id
                        ? "border-site-accent bg-site-accent text-white"
                        : "border-site-border hover:border-site-accent/30"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours slider */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60 mb-4 block">
                {language === "fr"
                  ? `Heures perdues en admin par semaine : ${hoursLost}h`
                  : `Hours lost on admin per week: ${hoursLost}h`}
              </label>
              <input
                type="range"
                min={3}
                max={30}
                value={hoursLost}
                onChange={(e) => setHoursLost(parseInt(e.target.value))}
                className="w-full accent-site-accent h-2 rounded-full appearance-none bg-site-border cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-site-text-light/40 mt-2">
                <span>3h</span>
                <span>30h</span>
              </div>
            </div>
          </motion.div>

          {/* Right: results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "border rounded-2xl p-8 md:p-10 transition-all duration-500",
              hasResult
                ? "border-site-accent bg-site-accent/[0.03]"
                : "border-site-border"
            )}
          >
            {hasResult ? (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={18} className="text-site-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-site-accent">
                    {language === "fr" ? "Votre projection" : "Your projection"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl md:text-4xl font-medium tracking-tighter text-site-accent">
                      {hoursSaved}h
                    </div>
                    <p className="text-xs text-site-text-light mt-1">
                      {language === "fr" ? "récupérées / semaine" : "saved / week"}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-medium tracking-tighter text-site-accent">
                      {weeklySaved.toLocaleString("fr-FR")} €
                    </div>
                    <p className="text-xs text-site-text-light mt-1">
                      {language === "fr" ? "de valeur / semaine" : "value / week"}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-medium tracking-tighter text-site-accent">
                      {yearlySaved.toLocaleString("fr-FR")} €
                    </div>
                    <p className="text-xs text-site-text-light mt-1">
                      {language === "fr" ? "économisés / an" : "saved / year"}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-medium tracking-tighter text-site-accent">
                      {weeksToROI} {language === "fr" ? "sem." : "wks"}
                    </div>
                    <p className="text-xs text-site-text-light mt-1">
                      {language === "fr" ? "pour rentabiliser" : "to break even"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-site-accent/10">
                  <p className="text-sm text-site-text-light leading-relaxed">
                    {language === "fr"
                      ? `En ${weeksToROI} semaines, votre système Accélérateur à 2 900 € est rentabilisé. Ensuite, c'est ${weeklySaved.toLocaleString("fr-FR")} € de valeur nette chaque semaine.`
                      : `In ${weeksToROI} weeks, your Accelerator system at €2,900 pays for itself. After that, it's €${weeklySaved.toLocaleString("fr-FR")} net value every week.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[250px] text-site-text-light/30">
                <p className="text-sm text-center">
                  {language === "fr"
                    ? "Sélectionnez votre métier pour voir votre ROI"
                    : "Select your trade to see your ROI"}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
