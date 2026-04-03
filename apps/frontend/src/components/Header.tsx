"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const { language, setLanguage, dict } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
          isScrolled ? "top-[-28px]" : "top-0"
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
              setMenuOpen(false);
            }}
            className="font-display text-xl font-semibold tracking-tighter"
          >
            AÏSSA BELKOUSSA
          </Link>

          <div className="flex items-center gap-4">
            {/* Diagnostic CTA — soft entry point */}
            <Link
              href="/diagnostic"
              className="hidden md:inline-flex items-center px-5 py-2 text-[10px] font-bold uppercase tracking-widest border border-site-border text-site-text-light rounded-full hover:border-site-accent hover:text-site-accent transition-all"
            >
              {dict.ui.diagnosticFree}
            </Link>

            {/* Services CTA — always visible, filled */}
            <Link
              href="/services"
              className="hidden md:inline-flex items-center px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-site-accent text-white rounded-full hover:bg-site-accent/85 transition-all"
            >
              {dict.ui.pricing}
            </Link>

            {/* Language toggle */}
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

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label={menuOpen ? dict.ui.menuClose : dict.ui.menuOpen}
              aria-expanded={menuOpen}
            >
              <span
                className={cn(
                  "block w-5 h-0.5 bg-site-text transition-all duration-300 origin-center",
                  menuOpen && "rotate-45 translate-y-1"
                )}
              />
              <span
                className={cn(
                  "block w-5 h-0.5 bg-site-text transition-all duration-300 origin-center",
                  menuOpen && "-rotate-45 -translate-y-1"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-site-bg/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
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
                className="flex flex-col items-center gap-4"
              >
                <Link
                  href="/diagnostic"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-display font-medium tracking-tight border border-site-border text-site-text-light px-8 py-3 rounded-full hover:border-site-accent hover:text-site-accent transition-colors"
                >
                  {dict.ui.diagnosticFree}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-display font-medium tracking-tight bg-site-accent text-white px-8 py-3 rounded-full hover:bg-site-accent/90 transition-colors"
                >
                  {dict.nav.contact}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
