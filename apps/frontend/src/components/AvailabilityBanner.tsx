"use client";

import { useLanguage } from "./LanguageContext";

// Config — update this manually each month (or connect to an API later)
const AVAILABLE_SLOTS = 2;

const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AvailabilityBanner() {
  const { language } = useLanguage();
  const now = new Date();
  const month = language === "fr" ? monthsFr[now.getMonth()] : monthsEn[now.getMonth()];
  const year = now.getFullYear();

  const text = language === "fr"
    ? `${month} ${year} — ${AVAILABLE_SLOTS} créneau${AVAILABLE_SLOTS > 1 ? "x" : ""} projet disponible${AVAILABLE_SLOTS > 1 ? "s" : ""}`
    : `${month} ${year} — ${AVAILABLE_SLOTS} project slot${AVAILABLE_SLOTS > 1 ? "s" : ""} available`;

  return (
    <div className="bg-site-accent text-white text-center py-2.5 text-[11px] font-bold uppercase tracking-widest">
      {text}
    </div>
  );
}
