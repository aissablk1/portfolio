"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Send } from "lucide-react";
import { cn } from "@/utils/cn";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function DiagnosticPage() {
  const { dict, language } = useLanguage();
  const d = dict.diagnostic;
  const questions = d.questions;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [skipEmail, setSkipEmail] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Clamp step to valid range
  const maxStep = questions.length + 1;
  const safeStep = Math.min(Math.max(step, 0), maxStep);
  const isQuestionPhase = safeStep < questions.length;
  const isEmailPhase = safeStep === questions.length && !skipEmail;
  const isResultPhase = safeStep === questions.length + 1 || (safeStep === questions.length && skipEmail);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;

  function getResult(score: number) {
    const levels = d.results.levels;
    if (score >= 12) return { ...levels.advanced, icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50 border-green-200", plan: "partenaire" };
    if (score >= 7) return { ...levels.intermediate, icon: AlertTriangle, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", plan: "accelerateur" };
    return { ...levels.beginner, icon: XCircle, color: "text-red-600", bgColor: "bg-red-50 border-red-200", plan: "partenaire" };
  }

  const result = getResult(totalScore);

  // Focus management on step change
  useEffect(() => {
    if (containerRef.current) {
      const heading = containerRef.current.querySelector("h2, [role='status']");
      if (heading instanceof HTMLElement) heading.focus();
    }
  }, [safeStep, skipEmail]);

  const selectAnswer = (questionId: string, score: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, maxStep));
      setTransitioning(false);
    }, 400);
  };

  const goToQuestion = (index: number) => {
    if (answers[questions[index]?.id] !== undefined || index <= safeStep) {
      setStep(index);
    }
  };

  const handleEmailSubmit = async () => {
    if (!EMAIL_RE.test(email) || !name.trim()) return;
    setSending(true);
    setSendError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          need: `Diagnostic digital — Score ${totalScore}/${maxScore} (${result.level})`,
          message: `${d.results.answersLabel} :\n${questions.map((q) => `- ${q.question} → ${q.options.find((o) => o.score === answers[q.id])?.label || "?"}`).join("\n")}\n\nScore : ${totalScore}/${maxScore} — ${d.results.levelLabel} : ${result.level}`,
          lang: language,
          plan: result.plan,
          _honey: "",
        }),
      });
      if (!res.ok) setSendError(true);
    } catch {
      setSendError(true);
    }
    // Trigger sequence email post-diagnostic (fire and forget)
    const weakest = questions.reduce(
      (w, q) => ((answers[q.id] ?? 99) < (answers[w.id] ?? 99) ? q : w),
      questions[0]
    );
    fetch("/api/sequences/trigger-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        name: name.trim(),
        score: totalScore,
        maxScore,
        weakestId: weakest.id,
        weakestQuestion: weakest.question,
        weakestArea: weakest.options.find((o) => o.score === answers[weakest.id])?.label || "",
        recommendedPlan: result.plan,
        answers,
      }),
    }).catch(() => {});

    setSending(false);
    setSubmitted(true);
    setStep(questions.length + 1);
  };

  const emailValid = EMAIL_RE.test(email) && name.trim().length > 0;

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20 px-6">
        <h1 className="sr-only">{d.srTitle}</h1>
        <div className="max-w-2xl mx-auto" ref={containerRef}>
          {/* Progress bar — clickable steps */}
          {!isResultPhase && (
            <div className="mb-12">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-3">
                <span>{d.progressLabel}</span>
                <span>
                  {isEmailPhase
                    ? d.lastStep
                    : `${d.questionOf} ${Math.min(safeStep + 1, questions.length)} / ${questions.length}`}
                </span>
              </div>
              <div className="flex gap-1.5">
                {questions.map((q, i) => {
                  const answered = answers[q.id] !== undefined;
                  const isCurrent = i === safeStep;
                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(i)}
                      disabled={!answered && i > safeStep}
                      aria-label={`${d.questionOf} ${i + 1}`}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-300",
                        isCurrent ? "bg-site-text" : answered ? "bg-site-text/40 hover:bg-site-text/60 cursor-pointer" : "bg-site-border cursor-not-allowed"
                      )}
                    />
                  );
                })}
                {/* Email step indicator */}
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    isEmailPhase ? "bg-site-text" : "bg-site-border"
                  )}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Questions */}
            {isQuestionPhase && questions[safeStep] && (
              <motion.div
                key={`q-${safeStep}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-medium tracking-tighter uppercase mb-10 leading-tight outline-none" tabIndex={-1}>
                  {questions[safeStep].question}
                </h2>
                <div className="space-y-3" role="radiogroup" aria-label={questions[safeStep].question}>
                  {questions[safeStep].options.map((opt) => {
                    const selected = answers[questions[safeStep].id] === opt.score;
                    return (
                      <button
                        key={opt.score}
                        onClick={() => selectAnswer(questions[safeStep].id, opt.score)}
                        role="radio"
                        aria-checked={selected}
                        className={cn(
                          "w-full text-left p-5 rounded-xl border transition-all duration-200",
                          selected
                            ? "border-site-text bg-site-text text-site-bg"
                            : "border-site-border hover:border-site-text/30"
                        )}
                      >
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {safeStep > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
                  >
                    <ArrowLeft size={14} />
                    {d.back}
                  </button>
                )}
              </motion.div>
            )}

            {/* Email capture */}
            {isEmailPhase && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-medium tracking-tighter uppercase mb-4 leading-tight outline-none" tabIndex={-1}>
                  {d.emailPhase.title}
                </h2>
                <p className="text-site-text-light mb-10">
                  {d.emailPhase.subtitle}
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="diag-name" className="sr-only">{d.emailPhase.namePlaceholder}</label>
                    <input
                      id="diag-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={d.emailPhase.namePlaceholder}
                      className="w-full bg-transparent border-b border-site-border py-4 text-xl focus:border-site-text outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="diag-email" className="sr-only">{d.emailPhase.emailPlaceholder}</label>
                    <input
                      id="diag-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={d.emailPhase.emailPlaceholder}
                      className="w-full bg-transparent border-b border-site-border py-4 text-xl focus:border-site-text outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
                  >
                    <ArrowLeft size={14} />
                    {d.back}
                  </button>
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!emailValid || sending}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all",
                      emailValid && !sending
                        ? "bg-site-text text-site-bg hover:scale-105"
                        : "bg-site-border text-site-text-light/50 cursor-not-allowed"
                    )}
                  >
                    {sending ? d.emailPhase.sending : d.emailPhase.submit}
                    {!sending && <Send size={14} />}
                  </button>
                </div>
                {/* Skip email */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setSkipEmail(true)}
                    className="text-[11px] font-medium text-site-text-light/40 hover:text-site-text-light transition-colors underline underline-offset-2"
                  >
                    {d.emailPhase.skip}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {isResultPhase && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {sendError && (
                  <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm" role="alert">
                    {d.results.sendError}
                  </div>
                )}

                {/* Score + Level badge */}
                <div className="flex flex-col items-center gap-3 mb-10 outline-none" role="status" tabIndex={-1}>
                  <div className="flex items-baseline gap-1">
                    <span className={cn("text-8xl font-medium tracking-tighter leading-none", result.color)}>{totalScore}</span>
                    <span className="text-3xl text-site-text-light/40 tracking-tighter font-light">/ {maxScore}</span>
                  </div>
                  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest", result.bgColor)}>
                    <result.icon size={14} className={result.color} />
                    <span className={result.color}>{result.level}</span>
                  </div>
                </div>

                {/* Headline + Body + CTA */}
                <div className="border border-site-border rounded-2xl p-8 md:p-10 mb-6">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                    {result.headline}
                  </h3>
                  <p className="text-site-text-light leading-relaxed mb-8">{result.body}</p>

                  <Link
                    href={`/contact?plan=${result.plan}`}
                    className="inline-flex items-center gap-3 bg-site-text text-site-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    {result.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Audit CTA for low scores */}
                {totalScore < 12 && (
                  <div className="border border-site-border rounded-2xl p-6 md:p-8 mb-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-3">
                      {dict.audit.teaserBadge}
                    </p>
                    <p className="text-sm text-site-text-light mb-4">
                      {dict.audit.teaserDesc}
                    </p>
                    <Link
                      href="/audit"
                      className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:border-site-text transition-colors"
                    >
                      {dict.audit.teaserCta}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Answers recap — collapsible */}
                <details className="border border-site-border rounded-2xl overflow-hidden mb-8 group">
                  <summary className="p-6 cursor-pointer flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-site-text-light/60 hover:text-site-text-light transition-colors">
                    {d.results.answersLabel}
                    <ArrowRight size={12} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 space-y-3">
                    {questions.map((q) => {
                      const answer = q.options.find((o) => o.score === answers[q.id]);
                      const qScore = answers[q.id] ?? 0;
                      const isGood = qScore >= 2;
                      return (
                        <div key={q.id} className="flex items-start gap-3 text-sm">
                          <span className={cn("mt-0.5 shrink-0 text-xs font-bold w-5 text-center", isGood ? "text-green-500" : "text-red-400")}>
                            {qScore}
                          </span>
                          <div>
                            <span className="text-site-text-light">{q.question}</span>
                            <br />
                            <span className="font-medium">{answer?.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>

                <div className="text-center">
                  <Link href="/go" className="text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors">
                    {d.results.seeOffers}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
