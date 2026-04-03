"use client";

import { useLanguage } from "./LanguageContext";

function getSlots(): number {
  const day = new Date().getDate();
  if (day <= 10) return 3;
  if (day <= 20) return 2;
  return 1;
}

export default function AvailabilityBanner() {
  const { dict } = useLanguage();
  const now = new Date();
  const month = dict.availabilityBanner.months[now.getMonth()];
  const year = now.getFullYear();
  const slots = getSlots();

  const template = slots > 1
    ? dict.availabilityBanner.slotPlural
    : dict.availabilityBanner.slotSingular;

  const text = template
    .replace("{month}", month)
    .replace("{year}", String(year))
    .replace("{slots}", String(slots));

  return (
    <div className="bg-site-accent text-white text-center py-2.5 text-[11px] font-bold uppercase tracking-widest">
      {text}
    </div>
  );
}
