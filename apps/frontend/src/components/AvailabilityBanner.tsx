"use client";

import { useLanguage } from "./LanguageContext";

const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getSlots(): number {
  const day = new Date().getDate();
  if (day <= 10) return 3;
  if (day <= 20) return 2;
  return 1;
}

export default function AvailabilityBanner() {
  const { language } = useLanguage();
  const now = new Date();
  const month = language === "fr" ? monthsFr[now.getMonth()] : monthsEn[now.getMonth()];
  const year = now.getFullYear();
  const slots = getSlots();

  const text = language === "fr"
    ? `${month} ${year} — ${slots} créneau${slots > 1 ? "x" : ""} projet disponible${slots > 1 ? "s" : ""}`
    : `${month} ${year} — ${slots} project slot${slots > 1 ? "s" : ""} available`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-site-text text-site-bg text-center py-3 text-[11px] font-bold uppercase tracking-widest safe-area-pb">
      {text}
    </div>
  );
}
