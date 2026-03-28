"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { ScrollVelocityContainer, ScrollVelocityRow } from "./ui/scroll-based-velocity";
import Image from "next/image";

const Footer = () => {
  const { dict } = useLanguage();

  return (
    <footer className="pt-0 py-20 border-t border-site-border mt-20 overflow-hidden">
      <div className="mt-0 mb-32 overflow-hidden pointer-events-none select-none bg-black border-y border-site-border py-12 w-full">
        <ScrollVelocityContainer className="text-[14vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-white flex flex-col gap-0">
          <video className="background absolute w-full min-h-full h-fit" autoPlay muted loop playsInline>
            <source data-src="/assets/videos/glitch-red.webm" type="video/webm" src="/assets/videos/glitch-red.webm" />
            <source data-src="/assets/videos/glitch-red.mp4" type="video/mp4" src="/assets/videos/glitch-red.mp4" />
          </video>
          <ScrollVelocityRow baseVelocity={3} direction={1}>
            <span className="mr-[2vw]">Aïssa Belkoussa</span>
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
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                autoPlay
                muted
                loop
                playsInline
              >
                <source data-src="/assets/videos/glitch-red.webm" type="video/webm" src="/assets/videos/glitch-red.webm" />
                <source data-src="/assets/videos/glitch-red.mp4" type="video/mp4" src="/assets/videos/glitch-red.mp4" />
              </video>
              <h1 className="z-10 bg-site-bg text-black mix-blend-screen align-left text-7xl md:text-6xl leading-tight text-balance">
                {dict.footer.title}
              </h1>
            </div>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/aissabelkoussa" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">LinkedIn</a>
              <a href="https://github.com/aissablk1" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">GitHub</a>
              <a href="https://t.me/investwithaissa" target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">Telegram</a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-30">Explore</span>
                  <Link href="#offers" className="text-sm hover:underline">{dict.nav.offers}</Link>
                  <Link href="#approach" className="text-sm hover:underline">{dict.nav.approach}</Link>
                  <Link href="#expertise" className="text-sm hover:underline">{dict.nav.expertise}</Link>
              </div>
              <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-30">Architecture</span>
                  <Link href="#systems" className="text-sm hover:underline">{dict.nav.systems}</Link>
                  <Link href="#about" className="text-sm hover:underline">{dict.nav.about}</Link>
                  <Link href="/contact" className="text-sm hover:underline">{dict.nav.contact}</Link>
              </div>
              <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-30">Legal</span>
                  <Link href="/mentions-legales" className="text-sm hover:underline">{dict.footer.legalNotice}</Link>
                  <Link href="/confidentialite" className="text-sm hover:underline">{dict.footer.privacyPolicy}</Link>
                  <Link href="/cgu" className="text-sm hover:underline">{dict.footer.termsOfService}</Link>
                  <Link href="/cgv" className="text-sm hover:underline">{dict.footer.termsAndConditions}</Link>
              </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
          <p>{dict.footer.credits}</p>
          <p>{dict.footer.reserved}</p>
        </div>

        <div className="max-w-7xl mx-auto mt-2 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
          <p>SIREN: 937 690 592</p>
          <p>Code NAF: 5911B</p>
          <p>SIRET: 937 690 592 00012</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
