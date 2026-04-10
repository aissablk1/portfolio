"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  Building2,
  BadgeEuro,
  Rocket,
  ClipboardCheck,
  Stethoscope,
  Loader2,
  BookOpen,
  Award,
  MapPin,
} from "lucide-react";
import { cn } from "@/utils/cn";

const learnings = [
  {
    icon: Lightbulb,
    text: "Ce que l'IA fait concrètement pour une PME",
  },
  {
    icon: Building2,
    text: "5 cas d'usage par secteur (BTP, comptabilité, immobilier, commerce, courtage)",
  },
  {
    icon: BadgeEuro,
    text: "Les vrais prix : SaaS vs sur-mesure",
  },
  {
    icon: Rocket,
    text: "Comment démarrer sans compétence technique",
  },
  {
    icon: ClipboardCheck,
    text: "Checklist : votre entreprise est-elle prête pour l'IA ?",
  },
  {
    icon: Stethoscope,
    text: "Prochaine étape : le diagnostic gratuit",
  },
];

const sectorOptions = [
  { value: "", label: "Sélectionnez votre secteur" },
  { value: "btp", label: "BTP / Artisanat" },
  { value: "comptabilite", label: "Comptabilité / Finance" },
  { value: "immobilier", label: "Immobilier" },
  { value: "commerce", label: "Commerce / Retail" },
  { value: "courtage", label: "Courtage / Assurance" },
  { value: "autre", label: "Autre" },
];

const sizeOptions = [
  { value: "", label: "Taille de votre entreprise" },
  { value: "solo", label: "Indépendant" },
  { value: "2-10", label: "2-10 salariés" },
  { value: "11-50", label: "11-50 salariés" },
  { value: "50+", label: "50+ salariés" },
];

export default function GuideIAPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [sector, setSector] = React.useState("");
  const [companySize, setCompanySize] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setStatus("error");
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name.trim(),
          sector: sector || undefined,
          companySize: companySize || undefined,
          source: "guide-ia",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur lors de l'envoi. Veuillez réessayer.");
      }

      const data = await res.json();

      if (data.leadId) {
        document.cookie = `lead_id=${data.leadId};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      }

      window.location.href = "/guide-ia/merci";
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Erreur lors de l'envoi. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <BookOpen size={14} className="text-site-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-site-accent">
                Guide gratuit
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1] mb-6"
            >
              L'IA pour les dirigeants
              <br />
              <span className="text-site-text-light">
                ce qui marche vraiment en 2026
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-site-text-light leading-relaxed max-w-2xl"
            >
              15 pages, 5 cas d'usage par secteur, les vrais prix.
              Téléchargez le guide, recevez-le par email.
            </motion.p>
          </div>
        </section>

        {/* ── Ce que vous allez apprendre ──────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-10">
              Ce que vous allez apprendre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learnings.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-site-border hover:border-site-accent/30 transition-colors"
                >
                  <item.icon
                    size={20}
                    className="text-site-accent mt-0.5 shrink-0"
                  />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formulaire ──────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-2xl border border-site-accent/20 bg-site-accent/[0.02]"
            >
              <h2 className="text-2xl font-display font-medium tracking-tight mb-2">
                Recevez le guide gratuitement
              </h2>
              <p className="text-sm text-site-text-light mb-8">
                Remplissez le formulaire, le guide arrive dans votre boîte email en 2 minutes.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider mb-2">
                    Prénom *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 rounded-xl border border-site-border bg-site-bg text-sm focus:outline-none focus:border-site-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.fr"
                    className="w-full px-4 py-3 rounded-xl border border-site-border bg-site-bg text-sm focus:outline-none focus:border-site-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="sector" className="block text-xs font-medium uppercase tracking-wider mb-2">
                    Secteur
                  </label>
                  <select
                    id="sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-site-border bg-site-bg text-sm focus:outline-none focus:border-site-accent transition-colors"
                  >
                    {sectorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="companySize" className="block text-xs font-medium uppercase tracking-wider mb-2">
                    Taille de l'entreprise
                  </label>
                  <select
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-site-border bg-site-bg text-sm focus:outline-none focus:border-site-accent transition-colors"
                  >
                    {sizeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {status === "error" && errorMessage && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-3 bg-site-accent text-white px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-site-accent/90 transition-colors mt-4",
                    status === "sending" && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Recevoir le guide gratuitement
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* ── Preuve sociale ──────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-site-border"
            >
              <div className="text-center">
                <div className="text-3xl font-display font-medium tracking-tight">93</div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  projets livrés
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-medium tracking-tight">4+</div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  ans d'expérience
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <MapPin size={16} className="text-site-accent" />
                  <div className="text-3xl font-display font-medium tracking-tight">Albi</div>
                </div>
                <div className="text-xs text-site-text-light uppercase tracking-wider mt-1">
                  consultant IA
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Qui suis-je ─────────────────────────────── */}
        <section className="px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-medium tracking-tight mb-4">
              Qui suis-je
            </h2>
            <div className="max-w-2xl">
              <p className="text-sm text-site-text-light leading-relaxed mb-2">
                Aïssa Belkoussa, consultant IA freelance à Albi. Je conçois et livre des systèmes
                digitaux clé en main pour les PME et artisans : automatisation, chatbot IA, sites web,
                dashboards décisionnels.
              </p>
              <p className="text-sm text-site-text-light leading-relaxed mb-2">
                Plus de 93 projets livrés, 4 ans d'expérience, des prix fixes sans surprise.
              </p>
              <p className="text-sm text-site-text-light leading-relaxed mb-6">
                Mon objectif : rendre l'IA accessible aux entreprises qui n'ont ni le temps ni les
                compétences techniques pour s'en occuper.
              </p>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 text-sm font-display font-medium text-site-accent hover:underline"
              >
                En savoir plus
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
