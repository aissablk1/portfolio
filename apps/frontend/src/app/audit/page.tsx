"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, CheckCircle2, Loader2, Zap, Shield, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

export default function AuditPage() {
  const { language } = useLanguage();
  const fr = language !== "en";
  const [purchasing, setPurchasing] = useState(false);

  const handleCheckout = async () => {
    setPurchasing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "audit" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors du paiement");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      } else {
        throw new Error("URL de session manquante");
      }
    } catch (err: any) {
      console.error("Stripe Checkout Error:", err);
      alert(fr ? "Erreur lors du lancement du paiement. Veuillez reessayer ou me contacter directement via WhatsApp." : "Error launching payment. Please try again or contact me directly via WhatsApp.");
    } finally {
      setPurchasing(false);
    }
  };

  const features = fr
    ? [
        { icon: BarChart3, title: "Score de maturite digitale", desc: "Evaluation chiffree de votre presence en ligne sur 5 axes." },
        { icon: Zap, title: "Points faibles identifies", desc: "Chaque faiblesse est classee par priorite d'impact sur votre CA." },
        { icon: Shield, title: "Recommandations concretes", desc: "Actions immediates et plan d'action a 30 jours." },
        { icon: Clock, title: "Livre sous 24h", desc: "Rapport detaille envoye par email — zero travail de votre part." },
      ]
    : [
        { icon: BarChart3, title: "Digital maturity score", desc: "Quantified evaluation of your online presence across 5 axes." },
        { icon: Zap, title: "Weaknesses identified", desc: "Each weakness ranked by revenue impact priority." },
        { icon: Shield, title: "Concrete recommendations", desc: "Immediate actions and 30-day action plan." },
        { icon: Clock, title: "Delivered within 24h", desc: "Detailed report sent by email — zero work on your part." },
      ];

  const faq = fr
    ? [
        { q: "Que contient le rapport ?", a: "Un score global, une analyse detaillee de 5 domaines (presence web, prise de RDV, gestion devis, relance commerciale, productivite), et un plan d'action priorise avec les quick wins." },
        { q: "Comment ca marche ?", a: "Apres paiement, vous recevez un email avec quelques questions. Votre rapport personnalise est genere et livre sous 24h." },
        { q: "Les 47 EUR sont-ils deductibles ?", a: "Oui. Si vous passez ensuite sur une offre Accelerateur ou Partenaire, les 47 EUR sont deduits du prix final." },
        { q: "Et si je ne suis pas satisfait ?", a: "Repondez a l'email avec votre retour. Si le rapport ne vous apporte rien, je vous rembourse." },
      ]
    : [
        { q: "What does the report include?", a: "A global score, detailed analysis of 5 domains (web presence, booking, quotes, follow-ups, productivity), and a prioritized action plan with quick wins." },
        { q: "How does it work?", a: "After payment, you receive an email with a few questions. Your personalized report is generated and delivered within 24h." },
        { q: "Is the EUR 47 deductible?", a: "Yes. If you later upgrade to Accelerator or Partner, the EUR 47 is deducted from the final price." },
        { q: "What if I'm not satisfied?", a: "Reply to the email with your feedback. If the report doesn't help, I'll refund you." },
      ];

  return (
    <div className="bg-site-bg min-h-screen">
      <Header />

      <main id="main-content" className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 border border-site-border rounded-full text-[10px] font-bold uppercase tracking-widest text-site-text-light mb-6">
              {fr ? "Audit express" : "Express audit"}
            </span>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase leading-tight mb-6">
              {fr
                ? "Votre site vous rapporte-t-il des clients ?"
                : "Does your website bring you clients?"}
            </h1>
            <p className="text-site-text-light text-lg max-w-xl mx-auto leading-relaxed">
              {fr
                ? "Un rapport personnalise qui identifie exactement ce qui ne fonctionne dans votre systeme digital — et comment le corriger."
                : "A personalized report that identifies exactly what's broken in your digital system — and how to fix it."}
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-20">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-6 border border-site-border rounded-2xl"
              >
                <f.icon size={20} className="text-site-text-light mb-3" />
                <h3 className="font-medium tracking-tight mb-1">{f.title}</h3>
                <p className="text-sm text-site-text-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center border border-site-border rounded-2xl p-10 md:p-14 mb-20"
          >
            <div className="flex items-baseline justify-center gap-3 mb-4">
              <span className="text-3xl text-site-text-light line-through">197 &euro;</span>
              <span className="text-6xl font-medium tracking-tighter">47 &euro;</span>
            </div>
            <p className="text-site-text-light mb-8 text-sm">
              {fr
                ? "Paiement unique. Deductible si vous passez a une offre superieure."
                : "One-time payment. Deductible if you upgrade to a higher offer."}
            </p>
            <button
              onClick={handleCheckout}
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
              {fr ? "Commander mon audit" : "Order my audit"}
              {!purchasing && <ArrowRight size={14} />}
            </button>
            <div className="flex items-center justify-center gap-6 mt-6 text-[10px] font-bold uppercase tracking-widest text-site-text-light/40">
              <span className="flex items-center gap-1"><CheckCircle2 size={10} /> {fr ? "Satisfait ou rembourse" : "Satisfied or refunded"}</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={10} /> {fr ? "Livre sous 24h" : "Delivered within 24h"}</span>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="mb-20">
            <h2 className="text-2xl font-medium tracking-tighter uppercase mb-8 text-center">
              {fr ? "Questions frequentes" : "FAQ"}
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group border border-site-border rounded-xl overflow-hidden"
                >
                  <summary className="p-5 cursor-pointer text-sm font-medium flex items-center justify-between">
                    {item.q}
                    <ArrowRight size={14} className="text-site-text-light group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-site-text-light leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-site-text-light text-sm mb-4">
              {fr
                ? "Vous preferez un diagnostic gratuit d'abord ?"
                : "Prefer a free diagnostic first?"}
            </p>
            <Link
              href="/diagnostic"
              className="text-xs font-bold uppercase tracking-widest text-site-text-light hover:text-site-text transition-colors underline underline-offset-2"
            >
              {fr ? "Faire le diagnostic gratuit" : "Take the free diagnostic"}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
