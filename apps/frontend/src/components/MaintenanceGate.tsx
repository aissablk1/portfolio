"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { Construction, Lock } from "lucide-react";

const MAINTENANCE_ENABLED =
  process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED !== "false";
const MAINTENANCE_PASSWORD =
  process.env.NEXT_PUBLIC_MAINTENANCE_PASSWORD || "aissa2026";

export default function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(!MAINTENANCE_ENABLED);
  const [isChecking, setIsChecking] = useState(MAINTENANCE_ENABLED);
  const bufferRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [mobileValue, setMobileValue] = useState("");
  const [shake, setShake] = useState(false);

  // Hydration sync — no persistent bypass
  useEffect(() => {
    if (!MAINTENANCE_ENABLED) {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, []);

  const unlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  // Desktop: invisible keydown listener
  useEffect(() => {
    if (isUnlocked || isChecking) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in the mobile input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufferRef.current += e.key;

        // Reset buffer after 3s of inactivity
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          bufferRef.current = "";
        }, 3000);

        if (bufferRef.current.endsWith(MAINTENANCE_PASSWORD)) {
          unlock();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isUnlocked, isChecking, unlock]);

  // Block interactions + scroll when locked
  useEffect(() => {
    if (isUnlocked || isChecking) return;

    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("copy", prevent);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("copy", prevent);
      document.body.style.overflow = "";
    };
  }, [isUnlocked, isChecking]);

  // Mobile input handler
  const handleMobileInput = (value: string) => {
    setMobileValue(value);
    if (value === MAINTENANCE_PASSWORD) {
      unlock();
    }
  };

  // Handle mobile input "Enter" — trigger shake if wrong
  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && mobileValue !== MAINTENANCE_PASSWORD) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const isFr = language === "fr";
  const isLocked = !isUnlocked && !isChecking;

  // Avoid hydration flash
  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-site-bg z-[9999]" />
    );
  }

  return (
    <>
      {/* Site content — always rendered, visibility toggled */}
      <div
        className={cn(
          isLocked && "invisible pointer-events-none"
        )}
        aria-hidden={isLocked}
      >
        {children}
      </div>

      {/* Maintenance overlay */}
      {isLocked && (
        <div
          className="fixed inset-0 z-[9999] bg-site-bg flex flex-col items-center justify-center select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Language toggle — top right */}
          <div className="absolute top-6 right-6">
            <div className="flex items-center bg-site-border/50 rounded-full p-1">
              <button
                onClick={() => setLanguage("fr")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-full transition-all",
                  language === "fr"
                    ? "bg-site-accent text-white"
                    : "text-site-text-light hover:text-site-text"
                )}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-full transition-all",
                  language === "en"
                    ? "bg-site-accent text-white"
                    : "text-site-text-light hover:text-site-text"
                )}
              >
                EN
              </button>
            </div>
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center px-6 max-w-md">
            {/* Icon */}
            <div className="p-4 rounded-2xl bg-site-accent/5 border border-site-border mb-8">
              <Construction size={32} className="text-site-text" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-4">
              {isFr ? "Site en maintenance" : "Under maintenance"}
            </h1>

            {/* Description */}
            <p className="text-site-text-light leading-relaxed mb-2">
              {isFr
                ? "Le site est en cours de construction et sera bientôt disponible."
                : "The website is under construction and will be available soon."}
            </p>
            <p className="text-site-text-light/60 text-sm">
              {isFr
                ? "Revenez d'ici peu."
                : "Check back shortly."}
            </p>

            {/* Mobile password input — visible on mobile, hidden on desktop */}
            <div className={cn(
              "mt-12 w-full md:hidden",
              shake && "animate-[shake_0.5s_ease-in-out]"
            )}>
              <div className="flex items-center gap-3 bg-site-border/30 border border-site-border rounded-xl px-4 py-3">
                <Lock size={14} className="text-site-text-light shrink-0" />
                <input
                  type="password"
                  value={mobileValue}
                  onChange={(e) => handleMobileInput(e.target.value)}
                  onKeyDown={handleMobileKeyDown}
                  placeholder={isFr ? "Mot de passe" : "Password"}
                  className="bg-transparent text-sm text-site-text placeholder:text-site-text-light/50 outline-none w-full"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-site-text-light/40">
              AÏSSA BELKOUSSA
            </p>
          </div>
        </div>
      )}
    </>
  );
}
