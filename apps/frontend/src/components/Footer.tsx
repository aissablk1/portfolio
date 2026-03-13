"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

const Footer = () => {
  const { dict } = useLanguage();

  return (
    <footer className="px-container py-20 border-t border-site-border mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="align-left text-7xl md:text-6xl leading-tight text-balance mb-12">
            {dict.footer.title}
          </h1>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">LinkedIn</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">GitHub</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest hover:text-site-text transition-colors">Telegram</a>
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
                <Link href="#contact" className="text-sm hover:underline">{dict.nav.contact}</Link>
            </div>
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                <span className="text-xs font-bold uppercase tracking-widest opacity-30">Legal</span>
                <Link href="#" className="text-sm hover:underline">{dict.footer.legalNotice}</Link>
                <Link href="#" className="text-sm hover:underline">{dict.footer.privacyPolicy}</Link>
                <Link href="#" className="text-sm hover:underline">{dict.footer.termsOfService}</Link>
                <Link href="#" className="text-sm hover:underline">{dict.footer.termsAndConditions}</Link>
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

      <div className="max-w-7xl mx-auto mt-96 left-1/2 flex justify-center items-center overflow-hidden">
        <p className="uppercase text-sm text-center w-full select-none pointer-events-none tracking-[0.2em] opacity-30">
          {dict.footer.version}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
