"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Download,
  Link2,
  Check,
  Loader2,
  Sparkles,
  Zap,
  Accessibility,
  Bot,
  Shield,
  Award,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import type { AuditResult, DimensionId } from "@/lib/audit/types";

/* ────────────────────────────────────────────────
   Page /audit — Diagnostic IA 360°
   ──────────────────────────────────────────────── */

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const smoothSpring = { type: "spring" as const, stiffness: 80, damping: 25 };

const DIMENSION_ICONS: Record<DimensionId, React.ElementType> = {
  seo: Search,
  performance: Zap,
  accessibility: Accessibility,
  geo: Bot,
  security: Shield,
  credibility: Award,
};

const VERDICT_CONFIG = {
  critical: { color: "text-red-500", bg: "bg-red-50/80 border-red-200", ring: "ring-red-500/20" },
  warning: { color: "text-amber-500", bg: "bg-amber-50/80 border-amber-200", ring: "ring-amber-500/20" },
  good: { color: "text-emerald-500", bg: "bg-emerald-50/80 border-emerald-200", ring: "ring-emerald-500/20" },
};

const content = {
  fr: {
    badge: "Audit 360°",
    headline: "L'audit complet de",
    headlineAccent: "votre écosystème digital",
    subtitle:
      "Pas juste du SEO. 6 dimensions analysées en profondeur : visibilité IA, performance, accessibilité, sécurité, crédibilité. Le diagnostic qu'un consultant IA ferait en 30 secondes.",
    placeholder: "votre-domaine.fr",
    cta: "Lancer l'audit",
    trust: "Gratuit — 6 dimensions — Résultats en 30 secondes",
    dimensions: {
      seo: "SEO technique",
      performance: "Performance",
      accessibility: "Accessibilité (WCAG)",
      geo: "Visibilité IA (GEO)",
      security: "Sécurité",
      credibility: "Crédibilité",
    },
    processing: {
      title: "Analyse en cours",
      steps: [
        { label: "Résolution du domaine", detail: "Vérification HTTPS et TTFB..." },
        { label: "Analyse SEO", detail: "Meta, titres, structure, sitemap..." },
        { label: "Performance", detail: "Temps de réponse, poids, scripts..." },
        { label: "Accessibilité", detail: "Heuristiques WCAG AA..." },
        { label: "Visibilité IA", detail: "llms.txt, schema, format Q&A..." },
        { label: "Sécurité", detail: "HTTPS, CSP, HSTS, headers..." },
        { label: "Crédibilité", detail: "Signaux de confiance..." },
        { label: "Pondération finale", detail: "Calcul du score global..." },
      ],
    },
    results: {
      globalLabel: "Score global 360°",
      verdicts: {
        critical: "Critique",
        warning: "À améliorer",
        good: "Bon niveau",
      },
      freeLabel: "Gratuit",
      gatedLabel: "Premium",
      unlockTitle: "Débloquez 3 dimensions supplémentaires",
      unlockBody: "Entrez votre email pour révéler la visibilité IA, la sécurité et la crédibilité.",
      unlockCta: "Débloquer l'audit complet",
      unlockEmailPlaceholder: "email@entreprise.fr",
      unlocking: "Vérification...",
      unlocked: "Débloqué !",
      share: "Partager",
      shareCopied: "Lien copié !",
      exportPdf: "Exporter PDF",
      sharing: "Création...",
      ctaTitle: "Transformez votre score en stratégie",
      ctaBody:
        "Les scores faibles révèlent des chantiers. Les scores forts indiquent des leviers. Dans les deux cas, la question est : comment transformer ce diagnostic en avantage compétitif ?",
      ctaButton: "Réserver un appel stratégique",
      ctaFree: "Gratuit — 30 minutes — Sans engagement",
      rescan: "Auditer un autre domaine",
      checks: "checks",
      showChecks: "voir",
      hideChecks: "masquer",
    },
    checkLabels: {
      "meta-description": "Meta description",
      "title-tag": "Balise title",
      "h1-structure": "Structure H1",
      "sitemap": "Sitemap XML",
      "ttfb": "Temps de réponse serveur",
      "html-size": "Taille du HTML",
      "script-count": "Scripts externes",
      "lazy-images": "Lazy loading des images",
      "preconnect": "Preconnect / DNS prefetch",
      "lang-attr": "Attribut lang",
      "alt-images": "Attributs alt sur les images",
      "heading-hierarchy": "Hiérarchie des titres",
      "landmarks": "Landmarks sémantiques",
      "form-labels": "Labels de formulaire",
      "skip-link": "Skip link (navigation clavier)",
      "llms-txt": "Fichier llms.txt",
      "schema-entity": "Entités structurées (Schema.org)",
      "faq-schema": "FAQ structurée",
      "qa-format": "Format question/réponse",
      "ai-crawlers": "Accès des crawlers IA",
      "https": "HTTPS",
      "hsts": "Strict-Transport-Security (HSTS)",
      "csp": "Content-Security-Policy",
      "frame-options": "Protection clickjacking",
      "referrer-policy": "Referrer-Policy",
      "permissions-policy": "Permissions-Policy",
      "legal": "Mentions légales",
      "privacy": "Politique de confidentialité",
      "contact": "Moyen de contact",
      "social-proof": "Présence sociale",
      "copyright": "Copyright à jour",
      "testimonials": "Témoignages / avis",
    },
    summaries: {
      seo: { good: "Bons fondamentaux SEO", warning: "SEO partiel", critical: "SEO insuffisant" },
      performance: { good: "Site rapide", warning: "Performance moyenne", critical: "Site lent" },
      accessibility: { good: "Bonnes bases WCAG", warning: "Accessibilité incomplète", critical: "Accessibilité critique" },
      geo: { good: "Site bien positionné pour les IA", warning: "Quelques signaux manquants", critical: "Invisible pour les IA" },
      security: { good: "Headers de sécurité bien configurés", warning: "Quelques headers manquants", critical: "Site exposé aux attaques courantes" },
      credibility: { good: "Site inspire confiance", warning: "Signaux de confiance incomplets", critical: "Manque de crédibilité" },
    },
  },
  en: {
    badge: "360° Audit",
    headline: "The complete audit of",
    headlineAccent: "your digital ecosystem",
    subtitle:
      "Not just SEO. 6 dimensions analyzed in depth: AI visibility, performance, accessibility, security, credibility. The diagnostic an AI consultant would run in 30 seconds.",
    placeholder: "your-domain.com",
    cta: "Run audit",
    trust: "Free — 6 dimensions — Results in 30 seconds",
    dimensions: {
      seo: "Technical SEO",
      performance: "Performance",
      accessibility: "Accessibility (WCAG)",
      geo: "AI Visibility (GEO)",
      security: "Security",
      credibility: "Credibility",
    },
    processing: {
      title: "Analyzing",
      steps: [
        { label: "Domain resolution", detail: "HTTPS and TTFB check..." },
        { label: "SEO analysis", detail: "Meta, titles, structure, sitemap..." },
        { label: "Performance", detail: "Response time, weight, scripts..." },
        { label: "Accessibility", detail: "WCAG AA heuristics..." },
        { label: "AI Visibility", detail: "llms.txt, schema, Q&A format..." },
        { label: "Security", detail: "HTTPS, CSP, HSTS, headers..." },
        { label: "Credibility", detail: "Trust signals..." },
        { label: "Final weighting", detail: "Computing global score..." },
      ],
    },
    results: {
      globalLabel: "Global 360° score",
      verdicts: {
        critical: "Critical",
        warning: "Needs work",
        good: "Good",
      },
      freeLabel: "Free",
      gatedLabel: "Premium",
      unlockTitle: "Unlock 3 more dimensions",
      unlockBody: "Enter your email to reveal AI visibility, security, and credibility.",
      unlockCta: "Unlock full audit",
      unlockEmailPlaceholder: "email@company.com",
      unlocking: "Verifying...",
      unlocked: "Unlocked!",
      share: "Share",
      shareCopied: "Link copied!",
      exportPdf: "Export PDF",
      sharing: "Creating...",
      ctaTitle: "Turn your score into strategy",
      ctaBody:
        "Low scores reveal projects. High scores indicate leverage. Either way, the question is: how do you turn this diagnostic into a competitive advantage?",
      ctaButton: "Book a strategy call",
      ctaFree: "Free — 30 minutes — No strings attached",
      rescan: "Audit another domain",
      checks: "checks",
      showChecks: "show",
      hideChecks: "hide",
    },
    checkLabels: {
      "meta-description": "Meta description",
      "title-tag": "Title tag",
      "h1-structure": "H1 structure",
      "sitemap": "XML Sitemap",
      "ttfb": "Server response time",
      "html-size": "HTML size",
      "script-count": "External scripts",
      "lazy-images": "Lazy loading images",
      "preconnect": "Preconnect / DNS prefetch",
      "lang-attr": "Lang attribute",
      "alt-images": "Image alt attributes",
      "heading-hierarchy": "Heading hierarchy",
      "landmarks": "Semantic landmarks",
      "form-labels": "Form labels",
      "skip-link": "Skip link (keyboard nav)",
      "llms-txt": "llms.txt file",
      "schema-entity": "Structured entities (Schema.org)",
      "faq-schema": "Structured FAQ",
      "qa-format": "Q&A format",
      "ai-crawlers": "AI crawler access",
      "https": "HTTPS",
      "hsts": "Strict-Transport-Security (HSTS)",
      "csp": "Content-Security-Policy",
      "frame-options": "Clickjacking protection",
      "referrer-policy": "Referrer-Policy",
      "permissions-policy": "Permissions-Policy",
      "legal": "Legal notice",
      "privacy": "Privacy policy",
      "contact": "Contact method",
      "social-proof": "Social presence",
      "copyright": "Up-to-date copyright",
      "testimonials": "Testimonials / reviews",
    },
    summaries: {
      seo: { good: "Good SEO fundamentals", warning: "Partial SEO", critical: "Insufficient SEO" },
      performance: { good: "Fast site", warning: "Average performance", critical: "Slow site" },
      accessibility: { good: "Good WCAG basics", warning: "Incomplete accessibility", critical: "Critical accessibility issues" },
      geo: { good: "Well positioned for AI", warning: "Some signals missing", critical: "Invisible to AI" },
      security: { good: "Security headers well configured", warning: "Some headers missing", critical: "Exposed to common attacks" },
      credibility: { good: "Site inspires trust", warning: "Incomplete trust signals", critical: "Lacks credibility" },
    },
  },
};

/* ── Animated counter ── */
function AnimatedScore({ value, className }: { value: number; className?: string }) {
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionVal.set(value);
    const unsub = springVal.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [value, motionVal, springVal]);

  return <span className={className}>{display}</span>;
}

export default function AuditPage() {
  const { language } = useLanguage();
  const t = content[language] || content.fr;

  const [domain, setDomain] = useState("");
  const [phase, setPhase] = useState<"input" | "processing" | "results">("input");
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "loading" | "copied">("idle");
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const btnSpringX = useSpring(btnX, { stiffness: 150, damping: 15 });
  const btnSpringY = useSpring(btnY, { stiffness: 150, damping: 15 });

  const handleBtnMouse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      btnX.set((e.clientX - cx) * 0.15);
      btnY.set((e.clientY - cy) * 0.15);
    },
    [btnX, btnY]
  );
  const handleBtnLeave = useCallback(() => { btnX.set(0); btnY.set(0); }, [btnX, btnY]);

  const runAudit = async () => {
    const d = domain.trim();
    if (d.length < 3) return;

    setError("");
    setPhase("processing");
    setActiveStep(0);
    setResult(null);
    setUnlocked(false);

    const steps = t.processing.steps;
    const stepDuration = 600;
    const stepTimers: NodeJS.Timeout[] = [];
    for (let i = 1; i < steps.length; i++) {
      stepTimers.push(setTimeout(() => setActiveStep(i), stepDuration * i));
    }

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d }),
        signal: abortRef.current.signal,
      });

      stepTimers.forEach(clearTimeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur lors de l'audit");
        setPhase("input");
        return;
      }

      const data: AuditResult = await res.json();
      setActiveStep(steps.length - 1);
      await new Promise((r) => setTimeout(r, 600));

      setResult(data);
      setPhase("results");
    } catch {
      stepTimers.forEach(clearTimeout);
      setError("Erreur de connexion");
      setPhase("input");
    }
  };

  const unlockGated = async () => {
    if (unlocking) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) return;

    setUnlocking(true);
    // Fire-and-forget lead capture
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: email.trim().split("@")[0],
        email: email.trim(),
        need: `Audit 360° — ${result?.domain} — Score ${result?.globalScore}/100`,
        message: `Debloquage de l'audit complet via /audit pour ${result?.domain}`,
        lang: language,
        _honey: "",
      }),
    }).catch(() => {});

    setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
    }, 900);
  };

  const shareResult = async () => {
    if (!result || shareState === "loading") return;
    setShareState("loading");
    try {
      const res = await fetch("/api/audit/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      const shareUrl = `${window.location.origin}/audit/r/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 3000);
    } catch {
      setShareState("idle");
    }
  };

  const exportPdf = useCallback(() => { window.print(); }, []);

  const reset = () => {
    setDomain("");
    setPhase("input");
    setResult(null);
    setActiveStep(0);
    setUnlocked(false);
    setEmail("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="bg-site-bg min-h-[100dvh]">
      <Header />

      <main className="pt-36 md:pt-44 pb-24 px-[var(--spacing-container)]">
        <AnimatePresence mode="wait">
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,0.8fr] gap-16 lg:gap-24 items-start">
                {/* Left — copy */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, ...smoothSpring }}
                    className="mb-8"
                  >
                    <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-site-border text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light">
                      <Sparkles size={12} />
                      {t.badge}
                    </span>
                  </motion.div>

                  <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-8">
                    {t.headline.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.06, ...smoothSpring }}
                        className="inline-block mr-[0.3em]"
                      >
                        {word}
                      </motion.span>
                    ))}
                    <br />
                    {t.headlineAccent.split(" ").map((word, i) => (
                      <motion.span
                        key={`a-${i}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 0.2, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06, ...smoothSpring }}
                        className="inline-block mr-[0.3em] text-site-text-light"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, ...smoothSpring }}
                    className="text-base md:text-lg text-site-text-light leading-relaxed max-w-[52ch] mb-10"
                  >
                    {t.subtitle}
                  </motion.p>

                  {/* Dimensions preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-12 max-w-md"
                  >
                    {(Object.keys(t.dimensions) as DimensionId[]).map((id, i) => {
                      const Icon = DIMENSION_ICONS[id];
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + i * 0.06, ...spring }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-site-text/[0.02] border border-transparent"
                        >
                          <Icon size={14} className="text-site-text-light/50" />
                          <span className="text-[11px] font-medium text-site-text-light/70">{t.dimensions[id]}</span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Right — input card */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:mt-8"
                >
                  <div className={cn(
                    "relative border rounded-3xl p-8 md:p-10 transition-all duration-500",
                    inputFocused ? "border-site-text/20 shadow-[0_8px_40px_rgba(0,0,0,0.06)]" : "border-site-border"
                  )}>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                    <div className="relative">
                      <label htmlFor="audit-domain" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40 mb-4">
                        {language === "fr" ? "Entrez votre domaine" : "Enter your domain"}
                      </label>
                      <div className="relative mb-5">
                        <Globe size={18} className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                          inputFocused ? "text-site-text" : "text-site-text-light/25"
                        )} />
                        <input
                          id="audit-domain"
                          ref={inputRef}
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && runAudit()}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          placeholder={t.placeholder}
                          className="w-full pl-12 pr-5 py-4.5 bg-transparent border-b-2 border-site-border text-lg tracking-tight focus:border-site-text outline-none transition-all duration-300 placeholder:text-site-text-light/25"
                        />
                      </div>
                      <motion.button
                        onClick={runAudit}
                        onMouseMove={handleBtnMouse}
                        onMouseLeave={handleBtnLeave}
                        disabled={domain.trim().length < 3}
                        style={{ x: btnSpringX, y: btnSpringY }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "w-full flex items-center justify-center gap-3 py-4.5 rounded-full text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300",
                          domain.trim().length >= 3
                            ? "bg-site-text text-site-bg shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.2)]"
                            : "bg-site-border/60 text-site-text-light/30 cursor-not-allowed"
                        )}
                      >
                        <Search size={16} />
                        {t.cta}
                        <ArrowRight size={14} />
                      </motion.button>
                      <p className="mt-5 text-center text-[11px] text-site-text-light/30 tracking-wide">{t.trust}</p>
                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 text-sm text-red-500 text-center"
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...spring }}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-site-border mb-12"
              >
                <div className="w-8 h-8 rounded-full bg-site-text text-site-bg flex items-center justify-center text-xs font-bold uppercase">
                  {domain.trim()[0]}
                </div>
                <span className="text-sm font-medium tracking-tight">{domain.trim()}</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-site-text-light/20 border-t-site-text rounded-full"
                />
              </motion.div>

              <div className="space-y-1">
                {t.processing.steps.map((step, i) => {
                  const isActive = i === activeStep;
                  const isDone = i < activeStep;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ...smoothSpring }}
                      className="flex items-start gap-5 py-3"
                    >
                      <div className="mt-1">
                        {isDone ? (
                          <CheckCircle2 size={20} className="text-emerald-500" strokeWidth={2.5} />
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-site-text flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-[1.5px] border-site-bg border-t-transparent rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-site-border" />
                        )}
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          isActive ? "text-site-text" : isDone ? "text-site-text-light/60" : "text-site-text-light/25"
                        )}>
                          {step.label}
                        </p>
                        {(isActive || isDone) && (
                          <p className="text-xs text-site-text-light/40 mt-0.5">{step.detail.replace("...", "")}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {phase === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              {/* Domain bar */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14 print:mb-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-site-text text-site-bg flex items-center justify-center text-sm font-bold uppercase shrink-0">
                    {result.domain[0]}
                  </div>
                  <div>
                    <p className="text-lg font-medium tracking-tight">{result.domain}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40">
                      {new Date(result.scannedAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <motion.button
                    onClick={shareResult}
                    disabled={shareState === "loading"}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.12em] border transition-all duration-300",
                      shareState === "copied"
                        ? "border-emerald-300 text-emerald-600 bg-emerald-50/80"
                        : "border-site-border text-site-text-light hover:border-site-text hover:text-site-text"
                    )}
                  >
                    {shareState === "loading" ? <Loader2 size={12} className="animate-spin" /> : shareState === "copied" ? <Check size={12} /> : <Link2 size={12} />}
                    {shareState === "copied" ? t.results.shareCopied : shareState === "loading" ? t.results.sharing : t.results.share}
                  </motion.button>
                  <motion.button
                    onClick={exportPdf}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-site-border text-xs font-bold uppercase tracking-[0.12em] text-site-text-light hover:border-site-text hover:text-site-text transition-all"
                  >
                    <Download size={12} />
                    {t.results.exportPdf}
                  </motion.button>
                </div>
              </motion.div>

              {/* Global score hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, ...spring }}
                className="mb-16"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40 mb-6">
                  {t.results.globalLabel}
                </p>
                <div className="flex items-end gap-3 mb-5">
                  <AnimatedScore
                    value={result.globalScore}
                    className={cn(
                      "text-8xl md:text-[120px] font-medium tracking-tighter leading-none tabular-nums",
                      VERDICT_CONFIG[result.verdict].color
                    )}
                  />
                  <span className="text-3xl md:text-4xl text-site-text-light/15 tracking-tighter font-light mb-3">
                    / {result.maxGlobalScore}
                  </span>
                </div>
                <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.12em]", VERDICT_CONFIG[result.verdict].bg)}>
                  <span className={VERDICT_CONFIG[result.verdict].color}>
                    {t.results.verdicts[result.verdict]}
                  </span>
                </div>
              </motion.div>

              {/* 6 dimensions grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                {result.dimensions.map((dim, i) => {
                  const Icon = DIMENSION_ICONS[dim.id];
                  const isGated = dim.tier === "gated" && !unlocked;
                  const pct = dim.maxScore > 0 ? (dim.score / dim.maxScore) * 100 : 0;
                  return (
                    <motion.div
                      key={dim.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.06, ...smoothSpring }}
                      className={cn(
                        "relative border rounded-2xl p-6 transition-all duration-300",
                        isGated ? "border-site-border bg-site-text/[0.01]" : "border-site-border hover:border-site-text/20"
                      )}
                    >
                      {isGated && (
                        <div className="absolute inset-0 rounded-2xl backdrop-blur-[6px] bg-site-bg/60 flex items-center justify-center z-10">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-site-border bg-site-bg">
                            <Lock size={14} className="text-site-text-light" />
                            <span className="text-xs font-bold uppercase tracking-[0.12em] text-site-text-light">{t.results.gatedLabel}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-site-text/[0.03] flex items-center justify-center">
                            <Icon size={18} className="text-site-text-light" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t.dimensions[dim.id]}</p>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-site-text-light/40">
                              {dim.tier === "free" ? t.results.freeLabel : t.results.gatedLabel}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-3xl font-medium tracking-tighter tabular-nums", VERDICT_CONFIG[dim.verdict].color)}>
                            {Math.round(pct)}
                          </p>
                          <p className="text-[10px] text-site-text-light/30">/ 100</p>
                        </div>
                      </div>

                      <p className="text-xs text-site-text-light mb-4">{(t.summaries as Record<string, Record<string, string>>)[dim.id]?.[dim.verdict] ?? dim.summary}</p>

                      <div className="h-1 w-full bg-site-border rounded-full overflow-hidden mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.8 }}
                          className={cn(
                            "h-full rounded-full",
                            dim.verdict === "good" ? "bg-emerald-400" : dim.verdict === "warning" ? "bg-amber-400" : "bg-red-300"
                          )}
                        />
                      </div>

                      <details className="group">
                        <summary className="text-[10px] font-bold uppercase tracking-[0.12em] text-site-text-light/40 cursor-pointer hover:text-site-text-light transition-colors">
                          {dim.checks.length} {t.results.checks} ·  <span className="group-open:hidden">{t.results.showChecks}</span><span className="hidden group-open:inline">{t.results.hideChecks}</span>
                        </summary>
                        <div className="mt-3 space-y-2">
                          {dim.checks.map((c) => {
                            const Icon = c.status === "pass" ? CheckCircle2 : c.status === "warn" ? AlertTriangle : XCircle;
                            const color = c.status === "pass" ? "text-emerald-500" : c.status === "warn" ? "text-amber-500" : "text-red-400";
                            return (
                              <div key={c.id} className="flex items-start gap-2 text-xs">
                                <Icon size={12} className={cn(color, "mt-0.5 shrink-0")} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium">{(t.checkLabels as Record<string, string>)[c.id] ?? c.label}</p>
                                  <p className="text-site-text-light/50">{c.detail}</p>
                                </div>
                                <span className="text-[10px] text-site-text-light/40 tabular-nums">{c.points}/{c.maxPoints}</span>
                              </div>
                            );
                          })}
                        </div>
                      </details>
                    </motion.div>
                  );
                })}
              </div>

              {/* Unlock block */}
              {!unlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="border border-site-border rounded-2xl p-8 md:p-10 mb-16 print:hidden"
                >
                  <div className="flex items-start gap-3 mb-5">
                    <Lock size={20} className="text-site-text-light mt-1" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium tracking-tighter mb-2">{t.results.unlockTitle}</h3>
                      <p className="text-sm text-site-text-light">{t.results.unlockBody}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.results.unlockEmailPlaceholder}
                      className="flex-1 px-5 py-4 bg-transparent border border-site-border rounded-full focus:border-site-text outline-none text-sm transition-colors"
                    />
                    <motion.button
                      onClick={unlockGated}
                      disabled={unlocking || !email.includes("@")}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-site-text text-site-bg text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {unlocking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {unlocking ? t.results.unlocking : t.results.unlockCta}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Final CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="border border-site-border rounded-2xl p-8 md:p-12 mb-10"
              >
                <h3 className="text-2xl md:text-3xl font-medium tracking-tighter leading-tight mb-4">{t.results.ctaTitle}</h3>
                <p className="text-site-text-light leading-relaxed mb-8 max-w-[55ch]">{t.results.ctaBody}</p>
                <Link
                  href="/contact?plan=accelerateur"
                  className="inline-flex items-center gap-3 bg-site-text text-site-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.12em] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.18)] transition-all"
                >
                  {t.results.ctaButton}
                  <ArrowRight size={14} />
                </Link>
                <p className="text-[11px] text-site-text-light/30 mt-5">{t.results.ctaFree}</p>
              </motion.div>

              <div className="text-center print:hidden">
                <button
                  onClick={reset}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-site-text-light/40 hover:text-site-text transition-colors"
                >
                  {t.results.rescan}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
