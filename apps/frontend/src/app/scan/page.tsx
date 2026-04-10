"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Code2,
  Bot,
  Map,
  Share2,
  ShieldCheck,
  Heading1,
  Download,
  Link2,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";

/* ────────────────────────────────────────────────
   Scanner IA — Visibilite IA de votre entreprise
   ──────────────────────────────────────────────── */

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };
const smoothSpring = { type: "spring" as const, stiffness: 80, damping: 25 };

const content = {
  fr: {
    badge: "Scanner gratuit",
    headline: "Les IA recommandent-elles",
    headlineAccent: "votre entreprise ?",
    subtitle:
      "Quand un prospect demande a ChatGPT, Claude ou Perplexity le meilleur prestataire de votre secteur, votre nom apparait-il ? Decouvrez-le en 30 secondes.",
    placeholder: "votre-domaine.fr",
    cta: "Scanner",
    trust: "Gratuit — Sans inscription — Resultats en 30 secondes",
    aiPlatforms: ["ChatGPT", "Claude", "Perplexity", "Gemini"],
    processing: {
      title: "Analyse en cours",
      steps: [
        { id: "dns", label: "Verification du domaine", detail: "Resolution DNS et verification HTTPS..." },
        { id: "html", label: "Analyse de la page d'accueil", detail: "Meta tags, titres, structure HTML..." },
        { id: "schema", label: "Donnees structurees", detail: "Detection Schema.org et JSON-LD..." },
        { id: "crawl", label: "Fichiers d'indexation", detail: "robots.txt, sitemap.xml, llms.txt..." },
        { id: "social", label: "Signaux sociaux", detail: "Open Graph, partage social..." },
        { id: "score", label: "Calcul du score", detail: "Ponderation et verdict final..." },
      ],
    },
    results: {
      scoreLabel: "Score de visibilite IA",
      verdicts: {
        critical: { label: "Critique", desc: "Les IA ne vous connaissent pas. Vos concurrents captent ces clients." },
        warning: { label: "Insuffisant", desc: "Quelques signaux existent, mais les IA preferent vos concurrents." },
        good: { label: "Bon niveau", desc: "Votre site envoie les bons signaux. Quelques optimisations restent possibles." },
      },
      checksTitle: "Detail du diagnostic",
      ctaTitle: "Passez de invisible a recommande",
      ctaBody:
        "Je vous accompagne pour optimiser chaque signal et faire de votre entreprise la reponse par defaut des IA dans votre secteur.",
      ctaButton: "Reserver un appel strategique",
      ctaFree: "Gratuit — 30 minutes — Sans engagement",
      rescan: "Scanner un autre domaine",
      share: "Partager",
      shareCopied: "Lien copie !",
      shareExpiry: "Valide 1 heure",
      exportPdf: "Exporter PDF",
      sharing: "Creation...",
      googleVsAi: {
        google: "~2%",
        googleLabel: "de conversion",
        googleSub: "Google donne des options",
        ai: "~15%+",
        aiLabel: "de conversion",
        aiSub: "L'IA donne une reponse",
        conclusion: "Si l'IA recommande votre concurrent, c'est lui qui prend le client.",
      },
    },
  },
  en: {
    badge: "Free scanner",
    headline: "Does AI recommend",
    headlineAccent: "your business?",
    subtitle:
      "When a prospect asks ChatGPT, Claude, or Perplexity for the best provider in your industry, does your name show up? Find out in 30 seconds.",
    placeholder: "your-domain.com",
    cta: "Scan",
    trust: "Free — No signup — Results in 30 seconds",
    aiPlatforms: ["ChatGPT", "Claude", "Perplexity", "Gemini"],
    processing: {
      title: "Scanning",
      steps: [
        { id: "dns", label: "Domain verification", detail: "DNS resolution and HTTPS check..." },
        { id: "html", label: "Homepage analysis", detail: "Meta tags, headings, HTML structure..." },
        { id: "schema", label: "Structured data", detail: "Schema.org and JSON-LD detection..." },
        { id: "crawl", label: "Indexation files", detail: "robots.txt, sitemap.xml, llms.txt..." },
        { id: "social", label: "Social signals", detail: "Open Graph, social sharing..." },
        { id: "score", label: "Score calculation", detail: "Weighting and final verdict..." },
      ],
    },
    results: {
      scoreLabel: "AI Visibility Score",
      verdicts: {
        critical: { label: "Critical", desc: "AI doesn't know you. Your competitors are getting those customers." },
        warning: { label: "Insufficient", desc: "Some signals exist, but AI still prefers your competitors." },
        good: { label: "Good", desc: "Your site sends the right signals. A few optimizations remain." },
      },
      checksTitle: "Diagnostic breakdown",
      ctaTitle: "Go from invisible to recommended",
      ctaBody:
        "I help you optimize every signal so your business becomes the default AI answer in your industry.",
      ctaButton: "Book a strategy call",
      ctaFree: "Free — 30 minutes — No strings attached",
      rescan: "Scan another domain",
      share: "Share",
      shareCopied: "Link copied!",
      shareExpiry: "Valid 1 hour",
      exportPdf: "Export PDF",
      sharing: "Creating...",
      googleVsAi: {
        google: "~2%",
        googleLabel: "conversion",
        googleSub: "Google gives options",
        ai: "~15%+",
        aiLabel: "conversion",
        aiSub: "AI gives an answer",
        conclusion: "If AI recommends your competitor, they get the customer.",
      },
    },
  },
};

interface ScanCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  points: number;
  maxPoints: number;
}

interface ScanResult {
  domain: string;
  score: number;
  maxScore: number;
  verdict: "critical" | "warning" | "good";
  checks: ScanCheck[];
  scannedAt: string;
}

const CHECK_ICONS: Record<string, React.ElementType> = {
  homepage: Globe,
  "meta-description": FileText,
  title: Heading1,
  schema: Code2,
  h1: Heading1,
  robots: Bot,
  sitemap: Map,
  "llms-txt": Bot,
  "og-tags": Share2,
};

const VERDICT_CONFIG = {
  critical: { icon: XCircle, color: "text-red-500", bg: "bg-red-50/80 border-red-200" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50/80 border-amber-200" },
  good: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50/80 border-emerald-200" },
};

const STATUS_ICON = {
  pass: { icon: CheckCircle2, color: "text-emerald-500" },
  warn: { icon: AlertTriangle, color: "text-amber-500" },
  fail: { icon: XCircle, color: "text-red-400" },
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

/* ── Floating orb background ── */
function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,0,0,0.015) 0%, transparent 70%)" }}
      />
    </div>
  );
}

export default function ScannerIAPage() {
  const { language } = useLanguage();
  const t = content[language] || content.fr;

  const [domain, setDomain] = useState("");
  const [phase, setPhase] = useState<"input" | "processing" | "results">("input");
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [shareState, setShareState] = useState<"idle" | "loading" | "copied">("idle");
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Magnetic CTA button
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

  const handleBtnLeave = useCallback(() => {
    btnX.set(0);
    btnY.set(0);
  }, [btnX, btnY]);

  const runScan = async () => {
    const d = domain.trim();
    if (d.length < 3) return;

    setError("");
    setPhase("processing");
    setActiveStep(0);
    setResult(null);

    const steps = t.processing.steps;
    const stepDuration = 800;
    const stepTimers: NodeJS.Timeout[] = [];

    for (let i = 1; i < steps.length; i++) {
      stepTimers.push(setTimeout(() => setActiveStep(i), stepDuration * i));
    }

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: d }),
        signal: abortRef.current.signal,
      });

      stepTimers.forEach(clearTimeout);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur lors du scan");
        setPhase("input");
        return;
      }

      const data: ScanResult = await res.json();
      setActiveStep(steps.length - 1);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setResult(data);
      setPhase("results");
    } catch {
      stepTimers.forEach(clearTimeout);
      setError("Erreur de connexion");
      setPhase("input");
    }
  };

  const shareResult = async () => {
    if (!result || shareState === "loading") return;
    setShareState("loading");
    try {
      const res = await fetch("/api/scan/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      const shareUrl = `${window.location.origin}/scan/r/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 3000);
    } catch {
      setShareState("idle");
    }
  };

  const exportPdf = useCallback(() => {
    window.print();
  }, []);

  const reset = () => {
    setDomain("");
    setPhase("input");
    setResult(null);
    setActiveStep(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="bg-site-bg min-h-[100dvh] relative">
      <Header />
      <OrbBackground />

      <main className="pt-36 md:pt-44 pb-24 px-[var(--spacing-container)]">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════
              PHASE 1 — Landing / Input
              ═══════════════════════════════════════ */}
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero — split layout on desktop */}
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,0.8fr] gap-16 lg:gap-24 items-start">
                {/* Left — copy */}
                <div>
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, ...smoothSpring }}
                    className="mb-8"
                  >
                    <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-site-border text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {t.badge}
                    </span>
                  </motion.div>

                  {/* Headline — staggered word reveal */}
                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[0.95] mb-8"
                  >
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

                  {/* AI platforms ticker */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="flex items-center gap-3 mb-12"
                  >
                    {t.aiPlatforms.map((name, i) => (
                      <motion.span
                        key={name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.08, ...spring }}
                        className="px-3 py-1.5 rounded-full bg-site-text/[0.03] text-[11px] font-medium text-site-text-light/60 border border-transparent hover:border-site-border transition-colors"
                      >
                        {name}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Right — input card */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 4 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:mt-8"
                  style={{ perspective: "1000px" }}
                >
                  <div className={cn(
                    "relative border rounded-3xl p-8 md:p-10 transition-all duration-500",
                    inputFocused ? "border-site-text/20 shadow-[0_8px_40px_rgba(0,0,0,0.06)]" : "border-site-border"
                  )}>
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

                    <div className="relative">
                      <label htmlFor="scan-domain" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40 mb-4">
                        {language === "fr" ? "Entrez votre domaine" : "Enter your domain"}
                      </label>

                      <div className="relative mb-5">
                        <Globe size={18} className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                          inputFocused ? "text-site-text" : "text-site-text-light/25"
                        )} />
                        <input
                          id="scan-domain"
                          ref={inputRef}
                          type="text"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && runScan()}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          placeholder={t.placeholder}
                          className="w-full pl-12 pr-5 py-4.5 bg-transparent border-b-2 border-site-border text-lg tracking-tight focus:border-site-text outline-none transition-all duration-300 placeholder:text-site-text-light/25"
                        />
                      </div>

                      {/* CTA — magnetic button */}
                      <motion.button
                        onClick={runScan}
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
                        <ArrowRight size={14} className={cn(
                          "transition-transform duration-300",
                          domain.trim().length >= 3 ? "translate-x-0" : "-translate-x-1 opacity-0"
                        )} />
                      </motion.button>

                      {/* Trust */}
                      <p className="mt-5 text-center text-[11px] text-site-text-light/30 tracking-wide">
                        {t.trust}
                      </p>

                      {/* Error */}
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

              {/* Google vs AI — below-the-fold persuasion */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl mx-auto mt-32 md:mt-40"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr] gap-6">
                  {/* Google card */}
                  <div className="rounded-2xl border border-site-border p-8 md:p-10 text-center">
                    <p className="text-5xl md:text-6xl font-medium tracking-tighter text-site-text-light/15 mb-1">
                      {t.results.googleVsAi.google}
                    </p>
                    <p className="text-sm text-site-text-light/30 mb-3">{t.results.googleVsAi.googleLabel}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/25">
                      {t.results.googleVsAi.googleSub}
                    </p>
                  </div>

                  {/* AI card — emphasized */}
                  <div className="rounded-2xl border border-site-text/10 bg-site-text/[0.02] p-8 md:p-10 text-center">
                    <p className="text-5xl md:text-6xl font-medium tracking-tighter text-site-text mb-1">
                      {t.results.googleVsAi.ai}
                    </p>
                    <p className="text-sm text-site-text-light mb-3">{t.results.googleVsAi.aiLabel}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/60">
                      {t.results.googleVsAi.aiSub}
                    </p>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-center text-sm text-site-text-light mt-8 max-w-[50ch] mx-auto"
                >
                  {t.results.googleVsAi.conclusion}
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              PHASE 2 — Processing
              ═══════════════════════════════════════ */}
          {phase === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg mx-auto"
            >
              {/* Domain pill */}
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

              {/* Steps — timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-site-border" />
                <motion.div
                  className="absolute left-[11px] top-2 w-px bg-site-text origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: activeStep / (t.processing.steps.length - 1) }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "calc(100% - 1rem)" }}
                />

                <div className="space-y-1">
                  {t.processing.steps.map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, ...smoothSpring }}
                        className="flex items-start gap-5 py-3 pl-0 relative"
                      >
                        {/* Dot */}
                        <div className="relative z-10 mt-1">
                          {isDone ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ ...spring }}
                            >
                              <CheckCircle2 size={22} className="text-emerald-500" strokeWidth={2.5} />
                            </motion.div>
                          ) : isActive ? (
                            <div className="relative">
                              <motion.div
                                animate={{ scale: [1, 1.6, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-site-text/10"
                              />
                              <div className="w-[22px] h-[22px] rounded-full bg-site-text flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 border-[1.5px] border-site-bg border-t-transparent rounded-full"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-site-border bg-site-bg" />
                          )}
                        </div>

                        <div className="pt-0.5">
                          <p className={cn(
                            "text-sm font-medium transition-colors duration-300",
                            isActive ? "text-site-text" : isDone ? "text-site-text-light/60" : "text-site-text-light/25"
                          )}>
                            {step.label}
                          </p>
                          <AnimatePresence>
                            {(isActive || isDone) && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-site-text-light/40 mt-0.5"
                              >
                                {isDone ? step.detail.replace("...", "") : step.detail}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════
              PHASE 3 — Results
              ═══════════════════════════════════════ */}
          {phase === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl mx-auto"
              id="scan-report"
            >
              {/* Domain bar + actions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, ...smoothSpring }}
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
                        day: "numeric",
                        month: "long",
                        year: "numeric",
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
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300",
                      shareState === "copied"
                        ? "border border-emerald-300 text-emerald-600 bg-emerald-50/80"
                        : "border border-site-border text-site-text-light hover:border-site-text hover:text-site-text"
                    )}
                  >
                    {shareState === "loading" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : shareState === "copied" ? (
                      <Check size={12} />
                    ) : (
                      <Link2 size={12} />
                    )}
                    {shareState === "copied" ? t.results.shareCopied : shareState === "loading" ? t.results.sharing : t.results.share}
                  </motion.button>
                  <motion.button
                    onClick={exportPdf}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-site-border text-xs font-bold uppercase tracking-[0.12em] text-site-text-light hover:border-site-text hover:text-site-text transition-all duration-300"
                  >
                    <Download size={12} />
                    {t.results.exportPdf}
                  </motion.button>
                </div>
              </motion.div>

              {/* Score hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, ...spring }}
                className="mb-16"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40 mb-6">
                  {t.results.scoreLabel}
                </p>

                <div className="flex items-end gap-3 mb-5">
                  <AnimatedScore
                    value={result.score}
                    className={cn(
                      "text-8xl md:text-[120px] font-medium tracking-tighter leading-none tabular-nums",
                      VERDICT_CONFIG[result.verdict].color
                    )}
                  />
                  <span className="text-3xl md:text-4xl text-site-text-light/15 tracking-tighter font-light mb-3">
                    / {result.maxScore}
                  </span>
                </div>

                {/* Verdict badge */}
                {(() => {
                  const v = VERDICT_CONFIG[result.verdict];
                  const VIcon = v.icon;
                  const verdictText = t.results.verdicts[result.verdict];
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, ...smoothSpring }}
                      className="flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-[0.12em] w-fit", v.bg)}>
                        <VIcon size={14} className={v.color} />
                        <span className={v.color}>{verdictText.label}</span>
                      </div>
                      <p className="text-sm text-site-text-light">{verdictText.desc}</p>
                    </motion.div>
                  );
                })()}
              </motion.div>

              {/* Checks breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, ...smoothSpring }}
                className="mb-16"
              >
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light/40 mb-6">
                  {t.results.checksTitle}
                </h2>

                <div className="border border-site-border rounded-2xl overflow-hidden divide-y divide-site-border">
                  {result.checks.map((check, i) => {
                    const s = STATUS_ICON[check.status];
                    const SIcon = s.icon;
                    const CIcon = CHECK_ICONS[check.id] ?? ShieldCheck;
                    const pct = check.maxPoints > 0 ? (check.points / check.maxPoints) * 100 : 0;
                    return (
                      <motion.div
                        key={check.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05, ...smoothSpring }}
                        className="flex items-start gap-4 p-5 md:p-6 group hover:bg-site-text/[0.01] transition-colors"
                      >
                        <CIcon size={18} className="text-site-text-light/20 mt-0.5 shrink-0 group-hover:text-site-text-light/40 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className="text-sm font-medium">{check.label}</span>
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="text-xs text-site-text-light/40 tabular-nums font-medium">
                                {check.points}/{check.maxPoints}
                              </span>
                              <SIcon size={14} className={s.color} />
                            </div>
                          </div>
                          <p className="text-xs text-site-text-light/50 mb-2">{check.detail}</p>
                          {/* Progress micro-bar */}
                          <div className="h-0.5 w-full bg-site-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                              className={cn(
                                "h-full rounded-full",
                                check.status === "pass" ? "bg-emerald-400" : check.status === "warn" ? "bg-amber-400" : "bg-red-300"
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Google vs AI */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, ...smoothSpring }}
                className="grid grid-cols-2 gap-px bg-site-border rounded-2xl overflow-hidden mb-16 print:break-inside-avoid"
              >
                <div className="bg-site-bg p-8 md:p-10 text-center">
                  <p className="text-3xl md:text-4xl font-medium tracking-tighter text-site-text-light/20">
                    {t.results.googleVsAi.google}
                  </p>
                  <p className="text-xs text-site-text-light/30 mt-1">{t.results.googleVsAi.googleLabel}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-site-text-light/25 mt-3">
                    {t.results.googleVsAi.googleSub}
                  </p>
                </div>
                <div className="bg-site-bg p-8 md:p-10 text-center">
                  <p className="text-3xl md:text-4xl font-medium tracking-tighter">
                    {t.results.googleVsAi.ai}
                  </p>
                  <p className="text-xs text-site-text-light mt-1">{t.results.googleVsAi.aiLabel}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-site-text-light/60 mt-3">
                    {t.results.googleVsAi.aiSub}
                  </p>
                </div>
              </motion.div>

              {/* CTA block */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, ...smoothSpring }}
                className="border border-site-border rounded-2xl p-8 md:p-12 mb-10 print:break-inside-avoid"
              >
                <h3 className="text-2xl md:text-3xl font-medium tracking-tighter leading-tight mb-4">
                  {t.results.ctaTitle}
                </h3>
                <p className="text-site-text-light leading-relaxed mb-8 max-w-[55ch]">
                  {t.results.ctaBody}
                </p>

                <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link
                    href="/contact?plan=accelerateur"
                    className="inline-flex items-center gap-3 bg-site-text text-site-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.12em] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.18)] transition-all duration-300"
                  >
                    {t.results.ctaButton}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
                <p className="text-[11px] text-site-text-light/30 mt-5">{t.results.ctaFree}</p>
              </motion.div>

              {/* Rescan */}
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
