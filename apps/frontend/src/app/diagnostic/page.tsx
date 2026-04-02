"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Send } from "lucide-react";
import { cn } from "@/utils/cn";

/* ── Questions ─────────────────────────────────────────────────────── */
const questions = [
  {
    id: "site",
    question: "Votre site web actuel vous rapporte-t-il des clients ?",
    options: [
      { label: "Oui, régulièrement", score: 3 },
      { label: "Quelques-uns, mais pas assez", score: 2 },
      { label: "Non, c'est juste une vitrine", score: 1 },
      { label: "Je n'ai pas de site", score: 0 },
    ],
  },
  {
    id: "rdv",
    question: "Comment vos clients prennent-ils rendez-vous ?",
    options: [
      { label: "En ligne (Calendly, formulaire...)", score: 3 },
      { label: "Par email", score: 2 },
      { label: "Par téléphone uniquement", score: 1 },
      { label: "Bouche-à-oreille", score: 0 },
    ],
  },
  {
    id: "devis",
    question: "Combien de temps pour envoyer un devis ?",
    options: [
      { label: "Automatique (moins de 5 min)", score: 3 },
      { label: "Moins d'1 heure", score: 2 },
      { label: "Quelques heures à 1 jour", score: 1 },
      { label: "Plusieurs jours", score: 0 },
    ],
  },
  {
    id: "relance",
    question: "Relancez-vous vos prospects non convertis ?",
    options: [
      { label: "Oui, automatiquement", score: 3 },
      { label: "Oui, manuellement", score: 2 },
      { label: "Parfois, quand j'y pense", score: 1 },
      { label: "Jamais", score: 0 },
    ],
  },
  {
    id: "temps",
    question: "Combien d'heures/semaine passez-vous sur des tâches admin répétitives ?",
    options: [
      { label: "Moins de 2h", score: 3 },
      { label: "2 à 5h", score: 2 },
      { label: "5 à 10h", score: 1 },
      { label: "Plus de 10h", score: 0 },
    ],
  },
];

/* ── Score interpretation ──────────────────────────────────────────── */
function getResult(score: number) {
  if (score >= 12) {
    return {
      level: "Avancé",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      icon: CheckCircle2,
      headline: "Votre système digital est solide.",
      body: "Vous avez déjà une bonne base. L'étape suivante : automatiser ce qui reste manuel et optimiser votre tunnel de conversion pour maximiser chaque visite.",
      cta: "Passer au niveau supérieur",
      plan: "partenaire",
    };
  }
  if (score >= 7) {
    return {
      level: "Intermédiaire",
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
      icon: AlertTriangle,
      headline: "Vous perdez du temps et des clients chaque semaine.",
      body: "Les fondations sont là, mais votre système a des trous. Des devis trop lents, des relances oubliées, un site qui n'amène pas de leads — chaque semaine, c'est du CA qui s'évapore.",
      cta: "Colmater les fuites",
      plan: "accelerateur",
    };
  }
  return {
    level: "Débutant",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    icon: XCircle,
    headline: "Votre activité tourne sans filet digital.",
    body: "Pas de site efficace, pas de prise de RDV en ligne, pas de relance automatique. Vous faites tout à la main — et vous laissez de l'argent sur la table chaque jour. La bonne nouvelle : un système complet se met en place en 10 jours.",
    cta: "Construire mon système",
    plan: "accelerateur",
  };
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const isQuestionPhase = step < questions.length;
  const isEmailPhase = step === questions.length;
  const isResultPhase = step === questions.length + 1;

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 3;
  const result = getResult(totalScore);

  const selectAnswer = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setTimeout(() => setStep((s) => s + 1), 300);
  };

  const handleEmailSubmit = async () => {
    if (!email || !name) return;
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          context: "",
          need: `Diagnostic digital — Score ${totalScore}/${maxScore} (${result.level})`,
          message: `Résultats du diagnostic :\n${questions.map((q) => `- ${q.question} → ${q.options.find((o) => o.score === answers[q.id])?.label || "?"}`).join("\n")}\n\nScore : ${totalScore}/${maxScore} — Niveau : ${result.level}`,
          budget: totalScore <= 6 ? "~ 3 000 €" : "~ 7 000 €",
          lang: "fr",
          plan: result.plan,
          _honey: "",
        }),
      });
    } catch {
      // Fire and forget — show results anyway
    }
    setSending(false);
    setSubmitted(true);
    setStep(questions.length + 1);
  };

  return (
    <div className="bg-site-bg min-h-screen">
      {/* ── Topbar ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-site-bg/80 backdrop-blur-xl border-b border-site-border">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Aïssa Belkoussa
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-site-text-light">
            Diagnostic gratuit
          </span>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* ── Progress bar ────────────────────────────────────── */}
          {!isResultPhase && (
            <div className="mb-12">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-3">
                <span>Diagnostic</span>
                <span>
                  {isEmailPhase
                    ? "Dernière étape"
                    : `Question ${step + 1} / ${questions.length}`}
                </span>
              </div>
              <div className="h-1 w-full bg-site-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-site-text"
                  animate={{
                    width: `${((step + 1) / (questions.length + 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Questions ──────────────────────────────────── */}
            {isQuestionPhase && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-medium tracking-tighter uppercase mb-10 leading-tight">
                  {questions[step].question}
                </h2>
                <div className="space-y-3">
                  {questions[step].options.map((opt) => {
                    const selected = answers[questions[step].id] === opt.score;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => selectAnswer(questions[step].id, opt.score)}
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

                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Retour
                  </button>
                )}
              </motion.div>
            )}

            {/* ── Email capture ──────────────────────────────── */}
            {isEmailPhase && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-medium tracking-tighter uppercase mb-4 leading-tight">
                  Vos résultats sont prêts.
                </h2>
                <p className="text-site-text-light mb-10">
                  Entrez votre nom et email pour voir votre score et recevoir
                  des recommandations personnalisées.
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full bg-transparent border-b border-site-border py-4 text-xl focus:border-site-text outline-none transition-colors"
                    autoFocus
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full bg-transparent border-b border-site-border py-4 text-xl focus:border-site-text outline-none transition-colors"
                  />
                </div>
                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Retour
                  </button>
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!email.includes("@") || !name || sending}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all",
                      email.includes("@") && name && !sending
                        ? "bg-site-text text-site-bg hover:scale-105"
                        : "bg-site-border text-site-text-light/50 cursor-not-allowed"
                    )}
                  >
                    {sending ? "Envoi..." : "Voir mes résultats"}
                    {!sending && <Send size={14} />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Results ────────────────────────────────────── */}
            {isResultPhase && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Score header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <span className="text-7xl font-medium tracking-tighter">
                      {totalScore}
                    </span>
                    <span className="text-2xl text-site-text-light tracking-tighter">
                      / {maxScore}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold",
                      result.bgColor
                    )}
                  >
                    <result.icon size={16} />
                    <span className={result.color}>Niveau {result.level}</span>
                  </div>
                </div>

                {/* Result card */}
                <div className="border border-site-border rounded-2xl p-8 md:p-10 mb-8">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tighter uppercase mb-4">
                    {result.headline}
                  </h3>
                  <p className="text-site-text-light leading-relaxed mb-8">
                    {result.body}
                  </p>

                  {/* Answer recap */}
                  <div className="space-y-3 mb-8 border-t border-site-border pt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-site-text-light/40 mb-4">
                      Vos réponses
                    </p>
                    {questions.map((q) => {
                      const answer = q.options.find(
                        (o) => o.score === answers[q.id]
                      );
                      const isGood = (answers[q.id] ?? 0) >= 2;
                      return (
                        <div
                          key={q.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span
                            className={cn(
                              "mt-0.5 shrink-0",
                              isGood ? "text-green-500" : "text-red-400"
                            )}
                          >
                            {isGood ? "+" : "-"}
                          </span>
                          <div>
                            <span className="text-site-text-light">
                              {q.question}
                            </span>
                            <br />
                            <span className="font-medium">
                              {answer?.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/contact?plan=${result.plan}`}
                    className="inline-flex items-center gap-3 bg-site-text text-site-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    {result.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Secondary CTA */}
                <div className="text-center">
                  <Link
                    href="/go"
                    className="text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors"
                  >
                    Voir toutes les offres
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
