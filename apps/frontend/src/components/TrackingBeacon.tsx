/**
 * TrackingBeacon — Enregistre les page views dans le dashboard admin.
 *
 * Envoie un POST à /api/ping (proxy same-origin) à chaque changement de page.
 * Le proxy forward vers le backend /api/tracker qui stocke dans MongoDB.
 * Respecte Do Not Track. Fire-and-forget (ne bloque jamais le rendu).
 */
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TrackingBeacon() {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    if (pathname === lastTracked.current) return;

    // Respecter Do Not Track
    if (navigator.doNotTrack === "1") return;

    lastTracked.current = pathname;

    const payload = JSON.stringify({
      page: pathname,
      referrer: document.referrer,
      screen_width: window.innerWidth,
      language: navigator.language,
    });

    // Route through same-origin API route to avoid ad blockers
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/ping", payload);
    } else {
      fetch("/api/ping", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
