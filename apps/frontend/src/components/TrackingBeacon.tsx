"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TRACK_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/t`
  : null;

export function TrackingBeacon() {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    if (!TRACK_URL || pathname === lastTracked.current) return;

    // Respecter Do Not Track
    if (navigator.doNotTrack === "1") return;

    lastTracked.current = pathname;

    const payload = JSON.stringify({
      page: pathname,
      referrer: document.referrer,
      screen_width: window.innerWidth,
      language: navigator.language,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, payload);
    } else {
      fetch(TRACK_URL, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
