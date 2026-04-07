"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/components/LanguageContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  const { language } = useLanguage();
  const fr = language !== "en";
  const storageKey = `lm_${resourceSlug}`;

  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(storageKey)) {
      setUnlocked(true);
    }
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email) || !name.trim()) return;
    setSending(true);

    // Capture lead + trigger sequence
    fetch("/api/lead-magnet/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        name: name.trim(),
        resourceSlug,
        resourceTitle,
        downloadUrl,
        lang: language,
      }),
    }).catch(() => {});

    localStorage.setItem(storageKey, "1");
    setSending(false);
    setUnlocked(true);
  };

  const emailValid = EMAIL_RE.test(email) && name.trim().length > 0;

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
              {fr ? "Votre ressource est prete." : "Your resource is ready."}
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-site-text text-site-bg px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
            >
              <Download size={14} />
              {fr ? "Telecharger" : "Download"}
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
                placeholder={fr ? "Votre prenom" : "Your first name"}
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={fr ? "votre@email.com" : "your@email.com"}
                className="w-full bg-transparent border border-site-border rounded-xl px-4 py-3 text-sm focus:border-site-text outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!emailValid || sending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  emailValid && !sending
                    ? "bg-site-text text-site-bg hover:scale-[1.02]"
                    : "bg-site-border text-site-text-light/50 cursor-not-allowed"
                )}
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    {fr ? "Recevoir la ressource" : "Get the resource"}
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
