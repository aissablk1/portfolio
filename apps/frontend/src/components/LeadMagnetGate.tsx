"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/components/LanguageContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SECTORS = [
  { value: "btp", label: "BTP / Artisanat" },
  { value: "comptabilite", label: "Comptabilité / Finance" },
  { value: "immobilier", label: "Immobilier" },
  { value: "courtage", label: "Courtage / Assurance" },
  { value: "commerce", label: "Commerce / Retail" },
  { value: "autre", label: "Autre" },
];

const SIZES = [
  { value: "solo", label: "Indépendant" },
  { value: "2-10", label: "2-10 salariés" },
  { value: "11-50", label: "11-50 salariés" },
  { value: "50+", label: "50+ salariés" },
];

interface LeadMagnetGateProps {
  resourceSlug: string;
  resourceTitle: string;
  resourceDescription: string;
  downloadUrl: string;
  children?: React.ReactNode;
}

export default function LeadMagnetGate({
  resourceSlug,
  resourceTitle,
  resourceDescription,
  downloadUrl,
  children,
}: LeadMagnetGateProps) {
  const { dict } = useLanguage();
  const storageKey = `lm_${resourceSlug}`;

  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(storageKey)) {
      setUnlocked(true);
    }
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email) || !name.trim() || !sector || !companySize) return;
    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          sector,
          companySize,
          source: `lead-magnet-${resourceSlug}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.leadId) {
          document.cookie = `lead_id=${data.leadId};path=/;max-age=${60 * 60 * 24 * 90}`;
        }
        localStorage.setItem(storageKey, "1");
        setUnlocked(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const formValid =
    EMAIL_RE.test(email) &&
    name.trim().length > 0 &&
    sector !== "" &&
    companySize !== "";

  return (
    <div className="border border-site-border rounded-2xl overflow-hidden my-8">
      <AnimatePresence mode="wait">
        {unlocked ? (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-8 text-center"
          >
            <Download size={24} className="mx-auto mb-4 text-emerald-500" />
            <h3 className="text-lg font-medium tracking-tight mb-2">
              {resourceTitle}
            </h3>
            <p className="text-sm text-site-text-light mb-6">
              Votre ressource est prête.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-site-text text-site-bg px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
            >
              <Download size={14} />
              Télécharger
            </a>
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 md:p-8"
          >
            <h3 className="text-lg font-medium tracking-tight mb-2">
              {resourceTitle}
            </h3>
            <p className="text-sm text-site-text-light mb-6">
              {resourceDescription}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre prénom"
                required
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors"
              />
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors appearance-none"
              >
                <option value="">Votre secteur d&apos;activité</option>
                {SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                required
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors appearance-none"
              >
                <option value="">Taille de votre entreprise</option>
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!formValid || sending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  formValid && !sending
                    ? "bg-site-text text-site-bg hover:scale-[1.02]"
                    : "bg-site-border text-site-text-light/50 cursor-not-allowed"
                )}
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    Recevoir la ressource
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
              {error && (
                <p className="text-xs text-red-500 text-center">
                  Erreur. Réessayez ou contactez-moi directement.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
