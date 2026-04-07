"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Clock, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { UPSELL_MAP } from "@/lib/upsell-config";

function UpsellContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const planParam = searchParams.get("plan") || "";
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "fr";

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min
  const [purchasing, setPurchasing] = useState(false);

  const offer = UPSELL_MAP[planParam];
  const successUrl = `/checkout/success?session_id=${sessionId || ""}`;

  // Verify payment
  useEffect(() => {
    if (!sessionId) {
      router.replace(successUrl);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "paid") setVerified(true);
        else router.replace(successUrl);
      })
      .catch(() => router.replace(successUrl))
      .finally(() => setLoading(false));
  }, [sessionId, router, successUrl]);

  // Show skip button after 10 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!verified) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace(successUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [verified, router, successUrl]);

  const handleUpsell = useCallback(async () => {
    if (!offer || purchasing) return;
    setPurchasing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: offer.upsellPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.replace(successUrl);
      }
    } catch {
      router.replace(successUrl);
    }
  }, [offer, purchasing, router, successUrl]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 size={32} className="animate-spin text-site-text-light" />
      </div>
    );
  }

  // No upsell for this plan — go straight to success
  if (!offer || !verified) {
    router.replace(successUrl);
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 border border-site-border rounded-full text-xs font-bold uppercase tracking-widest text-site-text-light"
      >
        <Clock size={12} />
        {lang === "fr" ? "Offre disponible" : "Offer available"} {minutes}:{seconds.toString().padStart(2, "0")}
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-500">
          {offer.badge[lang]}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-5xl font-medium tracking-tighter uppercase leading-tight"
      >
        {offer.headline[lang]}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-site-text-light max-w-lg leading-relaxed"
      >
        {offer.description[lang]}
      </motion.p>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-baseline gap-3"
      >
        <span className="text-2xl text-site-text-light line-through">
          {offer.originalPrice.toLocaleString("fr-FR")} &euro;
        </span>
        <span className="text-5xl font-medium tracking-tighter">
          {offer.upsellPrice.toLocaleString("fr-FR")} &euro;
        </span>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-4 mt-4"
      >
        <button
          onClick={handleUpsell}
          disabled={purchasing}
          className={cn(
            "inline-flex items-center gap-3 bg-site-text text-site-bg px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
            purchasing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          )}
        >
          {purchasing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Zap size={14} />
          )}
          {offer.cta[lang]}
          {!purchasing && <ArrowRight size={14} />}
        </button>

        {/* Skip */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showSkip ? 1 : 0 }}
          onClick={() => router.replace(successUrl)}
          className="text-[11px] font-medium text-site-text-light/40 hover:text-site-text-light transition-colors underline underline-offset-2 mt-2"
        >
          {lang === "fr" ? "Non merci, voir ma confirmation" : "No thanks, see my confirmation"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function CheckoutUpsellPage() {
  return (
    <div className="bg-site-bg min-h-screen selection:bg-black selection:text-white relative">
      <Header />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
      </div>

      <main id="main-content" className="relative z-10 pt-40 pb-32 px-container">
        <div className="max-w-2xl mx-auto">
          <React.Suspense
            fallback={
              <div className="flex justify-center min-h-[60vh] items-center">
                <Loader2 size={32} className="animate-spin text-site-text-light" />
              </div>
            }
          >
            <UpsellContent />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
