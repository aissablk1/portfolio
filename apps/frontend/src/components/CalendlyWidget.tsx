"use client";

import Script from "next/script";

const CALENDLY_URL =
  "https://calendly.com/aissabelkoussa/30min?hide_event_type_details=1&hide_gdpr_banner=1";

const CalendlyWidget = () => {
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div
        className="calendly-inline-widget w-full rounded-2xl overflow-hidden"
        data-url={CALENDLY_URL}
        title="Réserver un appel découverte — Calendly"
        style={{ minWidth: 320, width: "100%", height: 750 }}
      />
    </>
  );
};

export default CalendlyWidget;
