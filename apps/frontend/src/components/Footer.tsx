"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { ScrollVelocityContainer, ScrollVelocityRow } from "./ui/scroll-based-velocity";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";


const Footer = () => {
  const { dict } = useLanguage();
  const [email, setEmail] = useState("");
  const [nlState, setNlState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || nlState === "sending") return;
    setNlState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter-footer" }),
      });
      if (res.ok) {
        setNlState("done");
        setEmail("");
      } else {
        setNlState("error");
      }
    } catch {
      setNlState("error");
    }
  };

  return (
    <footer data-layer="Footer" className="pt-0 py-20 border-t border-site-border mt-20 overflow-hidden">
      <div className="relative mt-0 mb-32 overflow-hidden pointer-events-none select-none bg-black border-y border-site-border py-12 w-full">
        <video aria-hidden="true" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" autoPlay muted loop playsInline preload="none">
          <source data-src="/assets/videos/glitch-red.webm" type="video/webm" src="/assets/videos/glitch-red.webm" />
          <source data-src="/assets/videos/glitch-red.mp4" type="video/mp4" src="/assets/videos/glitch-red.mp4" />
        </video>
        <ScrollVelocityContainer className="relative z-10 text-[14vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-white flex flex-col gap-0">
          <ScrollVelocityRow baseVelocity={3} direction={1}>
            <span className="mr-[2vw]">Aïssa BELKOUSSA</span>
            <span className="mr-[2vw] opacity-50">&bull;</span>
            <span className="mr-[2vw]">{dict.footer.jobTitle}</span>
            <span className="mr-[2vw] opacity-50">&bull;</span>
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={3} direction={-1}>
            <span className="mr-[2vw]">{dict.footer.industry}</span>
            <span className="mr-[2vw] opacity-50">&bull;</span>
            <span className="mr-[2vw]">{dict.footer.systemsStrategy}</span>
            <span className="mr-[2vw] opacity-50">&bull;</span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>

      <div className="px-container">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="relative mb-12 overflow-hidden isolation-isolate bg-site-bg">
              <video
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
              >
                <source data-src="/assets/videos/glitch-red.webm" type="video/webm" src="/assets/videos/glitch-red.webm" />
                <source data-src="/assets/videos/glitch-red.mp4" type="video/mp4" src="/assets/videos/glitch-red.mp4" />
              </video>
              <span aria-hidden="true" className="relative z-10 block bg-site-bg text-black mix-blend-screen font-medium leading-tight text-balance py-4" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}>
                {dict.footer.title}
              </span>
            </div>
            <div className="flex gap-6 mb-10">
              <a href="https://www.linkedin.com/in/aissabelkoussa" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">LinkedIn</a>
              <a href="https://github.com/aissablk1" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">GitHub</a>
              <a href="https://t.me/investwithaissa" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">Telegram</a>
            </div>

            {/* Newsletter */}
            <div className="max-w-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-site-text-light mb-3">
                {dict.footer.newsletterTitle}
              </p>
              <p className="text-sm text-site-text-light mb-4">
                {dict.footer.newsletterDesc}
              </p>
              {nlState === "done" ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 size={16} />
                  {dict.footer.newsletterSuccess}
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (nlState === "error") setNlState("idle"); }}
                    placeholder={dict.footer.newsletterPlaceholder}
                    required
                    className="flex-1 px-4 py-2.5 text-sm bg-site-bg border border-site-border rounded-full focus:outline-none focus:border-site-accent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={nlState === "sending"}
                    className="inline-flex items-center justify-center w-10 h-10 bg-site-accent text-white rounded-full hover:bg-site-accent/85 transition-colors disabled:opacity-50"
                  >
                    {nlState === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  </button>
                </form>
              )}
              {nlState === "error" && (
                <p className="text-xs text-red-500 mt-2">
                  {dict.footer.newsletterError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 self-end">
              <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">{dict.footer.explore}</span>
                  <Link href="/#offers" className="text-sm hover:underline">{dict.nav.offers}</Link>
                  <Link href="/#approach" className="text-sm hover:underline">{dict.nav.approach}</Link>
                  <Link href="/#expertise" className="text-sm hover:underline">{dict.nav.expertise}</Link>
                  <Link href="/blog" className="text-sm hover:underline">Blog</Link>
                  <Link href="/ressources" className="text-sm hover:underline">{dict.footer.resources}</Link>
              </div>
              <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">{dict.footer.architecture}</span>
                  <Link href="/#systems" className="text-sm hover:underline">{dict.nav.systems}</Link>
                  <Link href="/services" className="text-sm hover:underline">{dict.nav.services}</Link>
                  <Link href="/formation" className="text-sm hover:underline">{dict.footer.training}</Link>
                  <Link href="/diagnostic" className="text-sm hover:underline">{dict.ui.diagnosticFree}</Link>
                  <Link href="/a-propos" className="text-sm hover:underline">{dict.footer.aboutLink}</Link>
                  <Link href="/faq" className="text-sm hover:underline">FAQ</Link>
                  <Link href="/contact" className="text-sm hover:underline">{dict.nav.contact}</Link>
              </div>
              <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-site-text-light">{dict.footer.legal}</span>
                  <Link href="/mentions-legales" className="text-sm hover:underline">{dict.footer.legalNotice}</Link>
                  <Link href="/confidentialite" className="text-sm hover:underline">{dict.footer.privacyPolicy}</Link>
                  <Link href="/cgu" className="text-sm hover:underline">{dict.footer.termsOfService}</Link>
                  <Link href="/cgv" className="text-sm hover:underline">{dict.footer.termsAndConditions}</Link>
                  <Link href="/accessibilite" className="text-sm hover:underline">{dict.footer.accessibility}</Link>
              </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light">
          <p>{dict.footer.credits}</p>
          <p>{dict.footer.reserved}</p>
        </div>

        <div className="max-w-7xl mx-auto mt-2 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-site-text-light">
          <p>SIREN: 937 690 592</p>
          <p>Code NAF: 5911B</p>
          <p>SIRET: 937 690 592 00012</p>
        </div>

        {/* Beta notice */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-site-border/30">
          <p className="text-[10px] text-site-text-light/30 text-center leading-relaxed">
            {dict.footer.betaNotice}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
