"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ClaudeArchitectModal from "./ClaudeArchitectModal";

const Header = () => {
  const { language, setLanguage, dict } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [claudeModalOpen, setClaudeModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect if header is over a dark section
      const probe = document.elementFromPoint(window.innerWidth / 2, 60);
      if (probe) {
        let el: HTMLElement | null = probe as HTMLElement;
        let dark = false;
        while (el && el !== document.body) {
          const bg = getComputedStyle(el).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            const match = bg.match(/\d+/g);
            if (match) {
              const [r, g, b] = match.map(Number);
              dark = (r + g + b) / 3 < 80;
            }
            break;
          }
          el = el.parentElement;
        }
        setIsOverDark(dark);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = [
    { id: "offers", label: dict.nav.offers },
    { id: "approach", label: dict.nav.approach },
    { id: "expertise", label: dict.nav.expertise },
    { id: "systems", label: dict.nav.systems },
    { id: "services", label: dict.nav.services, href: "/services" },
    { id: "blog", label: dict.nav.blog, href: "/blog" },
    { id: "about", label: dict.nav.about },
  ];

  const handleNavClick = (id: string, href?: string) => {
    setMenuOpen(false);
    if (href) {
      window.location.href = href;
      return;
    }
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Warning Banner */}
      <Link
        href="/aissabelkoussa.com"
        className={cn(
          "group fixed top-0 left-0 right-0 z-60 py-1.5 bg-red-600/5 backdrop-blur-xl flex justify-center items-center transition-all duration-300 hover:bg-red-600/10",
          isScrolled ? "-top-10 opacity-0 pointer-events-none" : "top-0"
        )}
      >
        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.08em] md:tracking-[0.2em] text-red-600 flex items-center gap-1.5 md:gap-2 px-4 text-center leading-tight">
          <AlertTriangle size={10} className="animate-pulse shrink-0 md:w-3 md:h-3" strokeWidth={3} />
          <span>{dict.warning}</span>
          <span className="hidden md:inline invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ml-1 underline underline-offset-2">
            {dict.ui.learnMore}
          </span>
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-600/30 to-transparent" />
      </Link>

      <header
        data-layer="Header"
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled
            ? "top-4 px-4 md:px-6 py-0"
            : "top-[28px] px-container py-6"
        )}
      >
        {/* Background Grid Pattern — only when not scrolled */}
        {!isScrolled && (
          <div className="absolute inset-0 bg-size-8 bg-[radial-gradient(var(--color-site-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10" />
        )}

        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isScrolled
              ? cn(
                  "max-w-3xl backdrop-blur-2xl backdrop-saturate-200 rounded-full px-6 py-3",
                  isOverDark
                    ? "bg-[#0a0a0a]/60 border border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "bg-site-bg/70 border border-site-border/50 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
                )
              : "max-w-7xl border border-transparent"
          )}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              setMenuOpen(false);
            }}
            className={cn(
              "font-display text-xl font-semibold tracking-tighter transition-colors duration-500",
              isScrolled && isOverDark ? "text-white" : "text-site-text"
            )}
          >
            AÏSSA BELKOUSSA
          </Link>

          <div className="flex items-center gap-4">
            {/* Claude Architect badge — opens modal */}
            <button
              type="button"
              onClick={() => setClaudeModalOpen(true)}
              aria-label={dict.claudeArchitect.eyebrow}
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-500",
                isScrolled && isOverDark
                  ? "border border-[#e98152]/50 text-[#e98152] hover:border-[#e98152] hover:bg-[#e98152]/10"
                  : "border border-[#C15F3C]/40 text-[#a04e30] hover:border-[#C15F3C] hover:bg-[#C15F3C]/5"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isScrolled && isOverDark
                    ? "/icons/claude-light.svg"
                    : "/icons/claude.svg"
                }
                alt=""
                width="12"
                height="12"
                aria-hidden="true"
              />
              {dict.claudeArchitect.navLabel}
            </button>

            {/* Diagnostic CTA — soft entry point */}
            <Link
              href="/diagnostic"
              className={cn(
                "hidden md:inline-flex items-center px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-500",
                isScrolled && isOverDark
                  ? "border border-white/25 text-white/70 hover:border-white/50 hover:text-white"
                  : "border border-site-border text-site-text-light hover:border-site-accent hover:text-site-accent"
              )}
            >
              {dict.ui.diagnosticFree}
            </Link>

            {/* Services CTA — always visible, filled */}
            <Link
              href="/services"
              className={cn(
                "hidden md:inline-flex items-center px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-500",
                isScrolled && isOverDark
                  ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                  : "bg-site-accent text-white hover:bg-site-accent/85"
              )}
            >
              {dict.ui.pricing}
            </Link>

            {/* Language toggle */}
            <div className={cn(
              "flex items-center rounded-full p-1 transition-colors duration-500",
              isScrolled && isOverDark ? "bg-white/10" : "bg-site-border/50"
            )}>
              <button
                onClick={() => setLanguage("fr")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-full transition-all",
                  language === "fr"
                    ? isScrolled && isOverDark ? "bg-white text-[#0a0a0a]" : "bg-site-accent text-white"
                    : isScrolled && isOverDark ? "text-white/50 hover:text-white" : "text-site-text-light hover:text-site-text"
                )}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-full transition-all",
                  language === "en"
                    ? isScrolled && isOverDark ? "bg-white text-[#0a0a0a]" : "bg-site-accent text-white"
                    : isScrolled && isOverDark ? "text-white/50 hover:text-white" : "text-site-text-light hover:text-site-text"
                )}
              >
                EN
              </button>
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              aria-label={menuOpen ? dict.ui.menuClose : dict.ui.menuOpen}
              aria-expanded={menuOpen}
            >
              <span
                className={cn(
                  "block w-5 h-0.5 transition-all duration-300 origin-center",
                  isScrolled && isOverDark ? "bg-white" : "bg-site-text",
                  menuOpen && "rotate-45 translate-y-1"
                )}
              />
              <span
                className={cn(
                  "block w-5 h-0.5 transition-all duration-300 origin-center",
                  isScrolled && isOverDark ? "bg-white" : "bg-site-text",
                  menuOpen && "-rotate-45 -translate-y-1"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-site-bg lg:hidden flex flex-col"
          >
            {/* Menu header — logo + close button */}
            <div className="px-container py-6 flex items-center justify-between shrink-0">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setMenuOpen(false);
                }}
                className="font-display text-xl font-semibold tracking-tighter"
              >
                AÏSSA BELKOUSSA
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11"
                aria-label={dict.ui.menuClose}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              </button>
            </div>

            {/* Navigation items — centered vertically in remaining space */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-8 pb-20">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => handleNavClick(item.id, (item as any).href)}
                  className="text-2xl font-display font-medium tracking-tight text-site-text hover:text-site-accent transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setClaudeModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-lg font-display font-medium tracking-tight border border-[#C15F3C]/40 text-[#a04e30] px-8 py-4 rounded-full hover:border-[#C15F3C] hover:bg-[#C15F3C]/5 transition-colors text-center w-64"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/claude.svg"
                    alt=""
                    width="16"
                    height="16"
                    aria-hidden="true"
                  />
                  {dict.claudeArchitect.eyebrow}
                </button>
                <Link
                  href="/diagnostic"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-display font-medium tracking-tight border border-site-border text-site-text-light px-8 py-4 rounded-full hover:border-site-accent hover:text-site-accent transition-colors text-center w-64"
                >
                  {dict.ui.diagnosticFree}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-display font-medium tracking-tight bg-site-accent text-white px-8 py-4 rounded-full hover:bg-site-accent/90 transition-colors text-center w-64"
                >
                  {dict.nav.contact}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claude Architect Modal */}
      <ClaudeArchitectModal
        open={claudeModalOpen}
        onClose={() => setClaudeModalOpen(false)}
      />
    </>
  );
};

export default Header;
