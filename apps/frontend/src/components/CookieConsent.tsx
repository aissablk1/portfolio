"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageContext";

const COOKIE_KEY = "cookie_consent";
type Consent = "accepted" | "refused" | null;

function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(COOKIE_KEY);
  if (v === "accepted" || v === "refused") return v;
  return null;
}

function setConsent(value: "accepted" | "refused") {
  localStorage.setItem(COOKIE_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
}

/** Load GA4 + GTM scripts dynamically after consent */
function loadAnalytics() {
  if (document.getElementById("ga-consent-script")) return;

  const GA_ID = "G-ZJSFF5X6SZ";
  const GTM_ID = "GTM-S23FWBK6";

  // gtag.js
  const gaScript = document.createElement("script");
  gaScript.id = "ga-consent-script";
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);

  // gtag config
  const gaInit = document.createElement("script");
  gaInit.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`;
  document.head.appendChild(gaInit);

  // GTM
  const gtmInit = document.createElement("script");
  gtmInit.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
  document.head.appendChild(gtmInit);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { dict } = useLanguage();

  useEffect(() => {
    const consent = getConsent();
    if (consent === "accepted") {
      loadAnalytics();
    } else if (consent === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    setConsent("accepted");
    loadAnalytics();
    setVisible(false);
  }, []);

  const handleRefuse = useCallback(() => {
    setConsent("refused");
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={dict.ui.cookieAccept}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-2xl mx-auto bg-site-bg border border-site-border rounded-2xl p-6 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <p className="text-sm text-site-text-light leading-relaxed mb-4">
          {dict.ui.cookieMessage}{" "}
          <a
            href="/confidentialite"
            className="underline underline-offset-2 text-site-text hover:text-site-accent transition-colors"
          >
            {dict.ui.cookiePolicy}
          </a>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 bg-site-text text-site-bg text-xs font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
          >
            {dict.ui.cookieAccept}
          </button>
          <button
            onClick={handleRefuse}
            className="px-5 py-2.5 border border-site-border text-xs font-bold uppercase tracking-widest rounded-full hover:border-site-text transition-colors"
          >
            {dict.ui.cookieDecline}
          </button>
        </div>
      </div>
    </div>
  );
}
