"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
  const { language, setLanguage, dict } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Warning Banner */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-60 py-1.5 bg-red-600/5 backdrop-blur-xl flex justify-center items-center transition-all duration-300",
          isScrolled ? "top-[-28px]" : "top-0"
        )}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 flex items-center gap-2">
          <AlertTriangle size={12} className="animate-pulse" strokeWidth={3} />
          {dict.warning}
        </p>
        {/* Gradient Border 0% - 100% - 0% */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-600/30 to-transparent" />
      </div>
      
      <header
        className={cn(
          "fixed top-[28px] left-0 right-0 z-50 transition-all duration-300 px-container py-6",
          isScrolled ? "bg-site-bg/80 backdrop-blur-md py-4 top-0" : "bg-transparent"
        )}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-size-8 bg-[radial-gradient(var(--color-site-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10" />
    
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-display text-xl font-semibold tracking-tighter"
        >
          AÏSSA BELKOUSSA
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-site-border/50 rounded-full p-1">
            <button
              onClick={() => setLanguage("fr")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-full transition-all",
                language === "fr" ? "bg-site-accent text-white" : "text-site-text-light hover:text-site-text"
              )}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-full transition-all",
                language === "en" ? "bg-site-accent text-white" : "text-site-text-light hover:text-site-text"
              )}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
