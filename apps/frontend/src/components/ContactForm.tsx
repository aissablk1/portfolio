"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { Check, ChevronRight, ChevronLeft, Send } from "lucide-react";

type FormState = {
  name: string;
  context: string;
  need: string;
  message: string;
  budget: string;
};

const ContactForm = () => {
  const { dict } = useLanguage();
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [useTemplate, setUseTemplate] = useState(true);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    context: "",
    need: "",
    message: "",
    budget: "",
  });

  const nextStep = () => {
    // When moving to step 2 (details), if using template, pre-fill message
    if (step === 1 && useTemplate) {
        const selectedNeed = dict.funnel.steps.needs.options.find(o => o.label === formData.need);
        if (selectedNeed) {
            setFormData(prev => ({ ...prev, message: selectedNeed.template }));
        }
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    // Step 0: Identity
    {
      title: dict.funnel.steps.identity.title,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
              {dict.funnel.steps.identity.nameLabel}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-b border-site-border py-4 text-2xl font-display focus:border-site-accent outline-none transition-colors"
              placeholder={dict.funnel.steps.identity.namePlaceholder}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
              {dict.funnel.steps.identity.contextLabel}
            </label>
            <input
              type="text"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="w-full bg-transparent border-b border-site-border py-4 text-2xl font-display focus:border-site-accent outline-none transition-colors"
              placeholder={dict.funnel.steps.identity.contextPlaceholder}
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 2,
    },
    // Step 1: Needs
    {
      title: dict.funnel.steps.needs.title,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dict.funnel.steps.needs.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFormData({ ...formData, need: option.label })}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden",
                formData.need === option.label
                  ? "border-site-accent bg-site-accent text-white"
                  : "border-site-border bg-white hover:border-site-accent/30"
              )}
            >
              <span className="text-sm font-bold uppercase tracking-wider relative z-10">{option.label}</span>
              {formData.need === option.label && (
                <motion.div
                  layoutId="activeNeed"
                  className="absolute inset-0 bg-site-accent"
                />
              )}
              <div className={cn(
                "absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-colors shadow-sm",
                formData.need === option.label ? "bg-white border-white text-site-accent" : "border-site-border bg-white/50"
              )}>
                {formData.need === option.label && <Check size={12} strokeWidth={4} />}
              </div>
            </button>
          ))}
        </div>
      ),
      isValid: formData.need.length > 0,
    },
    // Step 2: Details
    {
      title: dict.funnel.steps.details.title,
      content: (
        <div className="space-y-8">
          <div className="flex bg-site-border/20 p-1 rounded-full w-fit mb-6">
              <button 
                type="button"
                onClick={() => setUseTemplate(true)}
                className={cn(
                    "px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all",
                    useTemplate ? "bg-site-accent text-white shadow-lg" : "text-site-text-light/60 hover:text-site-text"
                )}
              >
                  {dict.funnel.steps.details.useTemplate}
              </button>
              <button 
                type="button"
                onClick={() => setUseTemplate(false)}
                className={cn(
                    "px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all",
                    !useTemplate ? "bg-site-accent text-white shadow-lg" : "text-site-text-light/60 hover:text-site-text"
                )}
              >
                  {dict.funnel.steps.details.customMessage}
              </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
              {dict.funnel.steps.details.messageLabel}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (useTemplate) setUseTemplate(false); // If user types, switch to custom mode
              }}
              className="w-full bg-transparent border border-site-border p-6 rounded-2xl text-lg min-h-[150px] focus:border-site-accent outline-none transition-colors resize-none leading-relaxed"
              placeholder="Dites-moi tout sur votre vision..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
              {dict.funnel.steps.details.budgetLabel}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {["< 10k", "10k - 30k", "30k - 100k", "100k+"].map((range) => (
                 <button
                    key={range}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: range })}
                    className={cn(
                        "py-3 px-4 rounded-xl border text-xs font-bold transition-all",
                        formData.budget === range ? "bg-site-accent text-white border-site-accent shadow-md shadow-site-accent/10" : "border-site-border text-site-text-light/60 hover:border-site-accent/30 hover:text-site-accent"
                    )}
                 >
                    {range}
                 </button>
               ))}
            </div>
          </div>
        </div>
      ),
      isValid: formData.message.length > 5 && formData.budget.length > 0,
    },
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-site-accent text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-display font-bold mb-4 uppercase tracking-tighter">
          {dict.funnel.success.title}
        </h2>
        <p className="text-site-text-light max-w-sm mx-auto mb-12">
          {dict.funnel.success.message}
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-8 py-4 bg-site-border/30 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-site-accent hover:text-white transition-all shadow-sm"
        >
          Back to base
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-20 space-y-4">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-site-text-light/40">
           <span>Progress</span>
           <span>Step {step + 1} / {steps.length}</span>
        </div>
        <div className="h-1 w-full bg-site-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-site-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-h-[400px]"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 uppercase tracking-tighter">
            {steps[step].title}
          </h2>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-16 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={cn(
            "flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all",
            step === 0 ? "opacity-0 pointer-events-none" : "hover:text-site-accent"
          )}
        >
          <ChevronLeft size={16} />
          {dict.funnel.cta.prev}
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={!steps[step].isValid}
            className={cn(
              "flex items-center gap-3 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg",
              steps[step].isValid 
                ? "bg-site-accent text-white hover:scale-105 active:scale-95" 
                : "bg-site-border text-site-text-light/50 cursor-not-allowed"
            )}
          >
            {dict.funnel.cta.next}
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!steps[step].isValid}
            className={cn(
              "flex items-center gap-3 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg",
              steps[step].isValid 
                ? "bg-site-accent text-white hover:scale-105 active:scale-95" 
                : "bg-site-border text-site-text-light/50 cursor-not-allowed"
            )}
          >
            {dict.funnel.cta.submit}
            <Send size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
