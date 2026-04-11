"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { Check, Send, Rocket, Zap, Handshake, Shield, ArrowUpRight, Bot } from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type FormState = {
  name: string;
  email: string;
  need: string;
  message: string;
  _honey: string;
};

const planDetails: Record<string, { fr: string; en: string; price: string; icon: typeof Rocket }> = {
  autonome: { fr: "Autonome", en: "Autonomous", price: "3 900 €", icon: Zap },
  accelerateur: { fr: "Accélérateur", en: "Accelerator", price: "2 900 €", icon: Rocket },
  partenaire: { fr: "Partenaire", en: "Partner", price: "6 900 €", icon: Handshake },
  starter: { fr: "Starter", en: "Starter", price: "1 500 €", icon: Zap },
  pro: { fr: "Pro", en: "Pro", price: "2 900 €", icon: Rocket },
  "sur-mesure": { fr: "Sur-mesure", en: "Custom", price: "6 900 €", icon: Handshake },
  "pilote-automatique": { fr: "Pilote Automatique", en: "Auto Pilot", price: "1 500 €", icon: Bot },
};

const ContactForm = () => {
  const { dict, language } = useLanguage();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const plan = selectedPlan && planDetails[selectedPlan] ? planDetails[selectedPlan] : null;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<false | "generic" | "rate" | "captcha">(false);
  const [cfToken, setCfToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    need: "",
    message: "",
    _honey: "",
  });

  const isValid = formData.name.length > 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    && formData.need.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lang: language,
          plan: selectedPlan || "",
          cf_turnstile_token: cfToken,
        }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("rate");
        if (res.status === 403) throw new Error("captcha");
        throw new Error("generic");
      }
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof Error && err.message === "rate") setSubmitError("rate");
      else if (err instanceof Error && err.message === "captcha") setSubmitError("captcha");
      else setSubmitError("generic");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="text-site-text-light max-w-sm mx-auto mb-8">
          {dict.funnel.success.message}
        </p>

        {/* Calendly CTA — strike while the iron is hot */}
        <a
          href="https://calendly.com/aissabelkoussa/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-site-accent text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg mb-4"
        >
          {dict.funnel.success.bookCall}
          <ArrowUpRight size={14} />
        </a>
        <p className="text-[10px] text-site-text-light/40 mb-6">
          {dict.funnel.success.bookCallSubtext}
        </p>
        <a
          href={`https://wa.me/33782721406?text=${encodeURIComponent(dict.funnel.success.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold uppercase tracking-widest text-site-text-light hover:text-site-accent transition-colors mb-10 inline-flex items-center gap-2"
        >
          {dict.funnel.success.whatsappCta}
          <ArrowUpRight size={10} />
        </a>

        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 bg-site-border/20 rounded-full font-bold uppercase tracking-widest text-[10px] text-site-text-light hover:text-site-text transition-all"
        >
          {dict.funnel.success.backHome}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Selected Plan Banner */}
      {plan && (
        <div className="flex items-center gap-4 p-5 bg-site-accent/[0.04] border border-site-accent/20 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-site-accent/10 flex items-center justify-center shrink-0">
            <plan.icon size={18} className="text-site-accent" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-site-accent">
              {dict.funnel.plan.selectedLabel}
            </p>
            <p className="text-lg font-medium tracking-tight">
              {plan[language]} — {plan.price}
            </p>
          </div>
          <Check size={18} className="text-site-accent shrink-0" />
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter">
        {dict.funnel.steps.identity.title}
      </h2>

      {/* Honeypot */}
      <input
        type="text"
        name="_honey"
        value={formData._honey}
        onChange={(e) => setFormData({ ...formData, _honey: e.target.value })}
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Name + Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
            {dict.funnel.steps.identity.nameLabel}
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-site-border py-3 text-xl font-display focus:border-site-accent outline-none transition-colors"
            placeholder={dict.funnel.steps.identity.namePlaceholder}
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
            {dict.funnel.steps.identity.emailLabel}
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-site-border py-3 text-xl font-display focus:border-site-accent outline-none transition-colors"
            placeholder={dict.funnel.steps.identity.emailPlaceholder}
          />
        </div>
      </div>

      {/* Need selection */}
      <div className="space-y-3">
        <label id="contact-need-label" className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
          {dict.funnel.steps.needs.title}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3" aria-labelledby="contact-need-label">
          {dict.funnel.steps.needs.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFormData({ ...formData, need: option.label })}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 relative",
                formData.need === option.label
                  ? "border-site-accent bg-site-accent text-white"
                  : "border-site-border hover:border-site-accent/30"
              )}
            >
              <span className="text-xs font-bold uppercase tracking-wider">{option.label}</span>
              {formData.need === option.label && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white text-site-accent flex items-center justify-center">
                  <Check size={10} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message (optional) */}
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/60">
          {dict.funnel.steps.message.label}
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border border-site-border p-5 rounded-2xl text-base min-h-[120px] focus:border-site-accent outline-none transition-colors resize-none leading-relaxed"
          placeholder={dict.funnel.steps.message.placeholder}
        />
      </div>

      {/* Cloudflare Turnstile (anti-bot) — affiché seulement si la site key est configurée */}
      {TURNSTILE_SITE_KEY && (
        <div className="flex justify-center pt-2">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCfToken(token)}
            onError={() => setCfToken(null)}
            onExpire={() => setCfToken(null)}
            options={{ theme: "dark", size: "flexible" }}
          />
        </div>
      )}

      {submitError && (
        <p className="text-sm text-red-500 text-center">
          {submitError === "rate"
            ? dict.funnel.errors.rate
            : submitError === "captcha"
            ? dict.funnel.errors.captcha
            : dict.funnel.errors.generic}
        </p>
      )}

      {/* Submit */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg",
            isValid && !isSubmitting
              ? "bg-site-accent text-white hover:scale-[1.02] active:scale-[0.98]"
              : "bg-site-border text-site-text-light/50 cursor-not-allowed"
          )}
        >
          {isSubmitting
            ? dict.funnel.cta.submitting
            : dict.funnel.cta.submit}
          {!isSubmitting && <Send size={16} />}
        </button>
        <p className="text-[10px] text-site-text-light/40 flex items-center gap-1.5">
          <Shield size={10} />
          {dict.funnel.cta.guarantee}
        </p>
      </div>
    </motion.form>
  );
};

export default ContactForm;
