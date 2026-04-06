"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

interface SessionData {
  status: string;
  plan?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { dict } = useLanguage();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "paid") {
          setSession(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 size={32} className="animate-spin text-site-text-light" />
        <p className="text-sm text-site-text-light font-medium">
          {dict.checkout.verifying}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 text-center">
      {/* Check icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col gap-4"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          {session ? dict.checkout.confirmed : dict.checkout.thanks}
        </h1>
        <p className="text-site-text-light text-lg max-w-md mx-auto leading-relaxed">
          {session ? dict.checkout.confirmedDesc : dict.checkout.thanksDesc}
        </p>
      </motion.div>

      {/* Plan badge */}
      {session?.plan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <span className="inline-block px-4 py-2 border border-site-border rounded-full text-xs font-bold uppercase tracking-widest text-site-text-light">
            {session.plan.replace(/-/g, " ")}
          </span>
        </motion.div>
      )}

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-4"
      >
        {/* Calendly CTA */}
        <a
          href="https://calendly.com/aissabelkoussa/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-site-text text-site-bg px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity duration-300"
        >
          <Calendar size={12} />
          {dict.checkout.planKickoff}
        </a>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text transition-colors duration-300"
        >
          {dict.checkout.backHome}
          <ArrowRight size={12} />
        </Link>
      </motion.div>

      {/* Reassurance */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="text-[10px] uppercase tracking-[0.2em] text-site-text-light/50 mt-8"
      >
        {dict.checkout.reassurance}
      </motion.p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-site-bg min-h-screen selection:bg-black selection:text-white relative">
      <Header />

      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
      </div>

      <main
        id="main-content"
        className="relative z-10 pt-40 pb-32 px-container"
      >
        <div className="max-w-2xl mx-auto">
          <React.Suspense
            fallback={
              <div className="flex justify-center min-h-[60vh] items-center">
                <Loader2
                  size={32}
                  className="animate-spin text-site-text-light"
                />
              </div>
            }
          >
            <SuccessContent />
          </React.Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
