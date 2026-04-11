"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal "Claude Certified Architect" — ouvre depuis un bouton de la navbar
 * et redirige vers https://claude-architect.fr (micro-site spécialisé).
 *
 * Palette inspirée du micro-site : cream #f5f1ea + clay #b04918 + ink #1a1816.
 * Cohabite avec le thème du portfolio (sombre ou clair) grâce à un overlay.
 */
export default function ClaudeArchitectModal({ open, onClose }: Props) {
  const { dict } = useLanguage();

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const t = dict.claudeArchitect;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label={t.closeLabel}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cca-f-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[71] flex items-center justify-center px-4 py-10"
          >
            <div
              className="relative w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl"
              style={{
                background: "#f5f1ea",
                color: "#1a1816",
                fontFamily:
                  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label={t.closeLabel}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#3a342e] transition-colors hover:bg-[#ede6d8]"
              >
                <X size={16} strokeWidth={2} />
              </button>

              {/* Top accent stripe */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #b04918 0%, #e98152 50%, #b04918 100%)",
                }}
              />

              {/* Content */}
              <div className="px-8 py-10 md:px-10">
                {/* Eyebrow */}
                <div
                  className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#7a3a22" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/claude.svg"
                    alt=""
                    width="14"
                    height="14"
                    aria-hidden="true"
                  />
                  <span>{t.eyebrow}</span>
                </div>

                {/* Title (serif mimicry via system fonts stack) */}
                <h2
                  id="cca-f-modal-title"
                  className="text-[2rem] md:text-[2.4rem] leading-[1.05] tracking-tight"
                  style={{
                    fontFamily:
                      '"Instrument Serif", "Times New Roman", Georgia, serif',
                    fontWeight: 400,
                  }}
                >
                  {t.titleBefore}{" "}
                  <em style={{ color: "#b04918", fontStyle: "italic" }}>
                    {t.titleAccent}
                  </em>
                </h2>

                {/* Body */}
                <p
                  className="mt-5 text-[15px] leading-relaxed"
                  style={{ color: "#3a342e" }}
                >
                  {t.description}
                </p>

                {/* 5 domains mini-list */}
                <div
                  className="mt-7 grid grid-cols-1 gap-y-2.5 border-y py-5 text-[13px]"
                  style={{ borderColor: "rgba(42, 38, 34, 0.12)" }}
                >
                  {t.domains.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: "#8a8268" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{d.label}</span>
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: "#8a3414" }}
                      >
                        {d.weight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://claude-architect.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: "#1a1816",
                      color: "#f5f1ea",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#b04918")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#1a1816")
                    }
                    onClick={onClose}
                  >
                    {t.ctaPrimary}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                  <a
                    href="https://claude-architect.fr#waitlist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wider transition-all"
                    style={{
                      borderColor: "#1a1816",
                      color: "#1a1816",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ede6d8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    onClick={onClose}
                  >
                    {t.ctaSecondary}
                  </a>
                </div>

                {/* Footer note */}
                <p
                  className="mt-6 text-[11px]"
                  style={{ color: "#8a8268" }}
                >
                  {t.footnote}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
