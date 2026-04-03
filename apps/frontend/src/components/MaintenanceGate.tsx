"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { Construction, Lock } from "lucide-react";

const ENV_MAINTENANCE =
  process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED !== "false";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, dict } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const bufferRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [mobileValue, setMobileValue] = useState("");
  const [shake, setShake] = useState(false);

  // Try to unlock via the server-side API route
  const tryUnlock = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/maintenance/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsUnlocked(true);
        return true;
      }
    } catch {
      // Silently fail
    }
    return false;
  }, []);

  // Check backend for maintenance status, fallback to env var
  // Also check if the maintenance_unlocked cookie is already set (via server response)
  useEffect(() => {
    let cancelled = false;

    async function checkMaintenance() {
      let enabled = ENV_MAINTENANCE;

      if (BACKEND_URL) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(`${BACKEND_URL}/api/maintenance`, {
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) {
            const data = await res.json();
            enabled = !!data.enabled;
          }
        } catch {
          // Backend unreachable — use env var fallback
        }
      }

      if (!cancelled) {
        // If maintenance is enabled, check if already unlocked via cookie
        if (enabled) {
          // The cookie is httpOnly so we can't read it in JS.
          // Instead, we probe the unlock endpoint with an empty password —
          // but that won't work. Instead, we check by reading document.cookie
          // for a non-httpOnly marker, OR simply require re-authentication.
          // Since the cookie is httpOnly, we rely on the server setting it.
          // We'll check by making a lightweight request.
          // Actually, the simplest approach: if the page was reloaded and the
          // cookie exists, Next.js middleware could handle this. But to keep it
          // simple without middleware, we accept that refreshing the page
          // requires re-entering the password (the cookie is still useful for
          // any server-side checks).
          setIsUnlocked(false);
          setIsChecking(false);
        } else {
          setIsUnlocked(true);
          setIsChecking(false);
        }
      }
    }

    checkMaintenance();
    return () => { cancelled = true; };
  }, []);

  // Desktop: invisible keydown listener
  useEffect(() => {
    if (isUnlocked || isChecking) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in the mobile input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufferRef.current += e.key;

        // Debounce: try unlock 1s after last keystroke, then reset buffer
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          const attempt = bufferRef.current;
          bufferRef.current = "";
          if (attempt.length >= 4) {
            tryUnlock(attempt);
          }
        }, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isUnlocked, isChecking, tryUnlock]);

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
  };

  // Handle mobile input "Enter" — try to unlock via API
  const handleMobileKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const success = await tryUnlock(mobileValue);
      if (!success) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
  };

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
              {dict.maintenanceGate.title}
            </h1>

            {/* Description */}
            <p className="text-site-text-light leading-relaxed mb-2">
              {dict.maintenanceGate.description}
            </p>
            <p className="text-site-text-light/60 text-sm">
              {dict.maintenanceGate.comeback}
            </p>

            {/* Mobile password input — visible on mobile portrait only, hidden on desktop and landscape */}
            <div className={cn(
              "mt-12 w-full md:hidden landscape:hidden",
              shake && "animate-[shake_0.5s_ease-in-out]"
            )}>
              <div className="flex items-center gap-3 bg-site-border/30 border border-site-border rounded-xl px-4 py-3">
                <Lock size={14} className="text-site-text-light shrink-0" />
                <input
                  type="password"
                  value={mobileValue}
                  onChange={(e) => handleMobileInput(e.target.value)}
                  onKeyDown={handleMobileKeyDown}
                  placeholder={dict.maintenanceGate.passwordPlaceholder}
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
