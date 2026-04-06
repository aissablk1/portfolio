"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useLanguage } from "./LanguageContext";

const CALENDLY_URL =
  "https://calendly.com/aissabelkoussa/30min?hide_event_type_details=1&hide_gdpr_banner=1";
const CALENDLY_LINK = "https://calendly.com/aissabelkoussa/30min";

const CalendlyWidget = () => {
  const [blocked, setBlocked] = useState(false);
  const { dict } = useLanguage();

  useEffect(() => {
    // Check after 4s if Calendly widget loaded — if not, it's blocked
    const timer = setTimeout(() => {
      const iframe = document.querySelector(".calendly-inline-widget iframe");
      if (!iframe) setBlocked(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Try loading the embed widget */}
      {!blocked && (
        <>
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
            onError={() => setBlocked(true)}
          />
          <div
            className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
            data-url={CALENDLY_URL}
            title={dict.calendly.title}
            style={{ minWidth: 320, width: "100%", height: 750 }}
          />
        </>
      )}

      {/* Fallback: direct link if widget is blocked */}
      {blocked && (
        <div className="w-full flex flex-col items-center gap-6 py-12">
          <div className="w-16 h-16 rounded-full bg-site-accent/10 flex items-center justify-center">
            <Calendar size={28} className="text-site-accent" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-display font-medium tracking-tight mb-2">
              {dict.calendly.fallbackTitle}
            </h3>
            <p className="text-sm text-site-text-light max-w-md">
              {dict.calendly.fallbackDesc}
            </p>
          </div>
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-site-accent text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            {dict.calendly.fallbackCta}
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </>
  );
};

export default CalendlyWidget;
