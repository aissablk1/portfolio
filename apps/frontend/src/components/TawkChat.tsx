"use client";

import { useEffect } from "react";

const COOKIE_KEY = "cookie_consent";

export default function TawkChat() {
  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

    if (!propertyId || !widgetId) return;

    function loadTawk() {
      if (document.getElementById("tawk-script")) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      s1.id = "tawk-script";
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");

      const s0 = document.getElementsByTagName("script")[0];
      s0?.parentNode?.insertBefore(s1, s0);
    }

    // Charger si le consentement est déjà donné
    if (localStorage.getItem(COOKIE_KEY) === "accepted") {
      loadTawk();
    }

    // Écouter le consentement futur
    function onConsent(e: Event) {
      if ((e as CustomEvent).detail === "accepted") {
        loadTawk();
      }
    }

    window.addEventListener("cookie-consent", onConsent);

    return () => {
      window.removeEventListener("cookie-consent", onConsent);
    };
  }, []);

  return null;
}
