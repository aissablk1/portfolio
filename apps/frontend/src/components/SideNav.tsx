"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const SideNav = () => {
  const { dict } = useLanguage();
  const [activeSection, setActiveSection] = useState("");

  const items = [
    { id: "offers", name: dict.nav.offers },
    { id: "approach", name: dict.nav.approach },
    { id: "expertise", name: dict.nav.expertise },
    { id: "systems", name: dict.nav.systems },
    { id: "about", name: dict.nav.about },
    { id: "contact", name: dict.nav.contact },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Offset for header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="hidden lg:flex fixed right-10 top-0 bottom-0 items-center z-9999 pointer-events-none">
      <div className="flex flex-col gap-8 items-end pointer-events-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex items-center gap-6 transition-all duration-300 outline-none group"
          >
            <span className={cn(
                "text-[10px] uppercase tracking-[0.4em] transition-all duration-300 mix-blend-difference",
                activeSection === item.id 
                  ? "text-white font-black" 
                  : "text-white/40 font-bold hover:text-white"
            )}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SideNav;
