"use client";

import React, { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface Props {
  plan: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({ plan, label, className }: Props) {
  const [loading, setLoading] = useState(false);
  const { dict } = useLanguage();

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Checkout API Error:", errorData.error);
        window.location.href = `/contact?plan=${plan}&error=stripe_error`;
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from checkout API");
        window.location.href = `/contact?plan=${plan}&error=no_url`;
      }
    } catch (err) {
      console.error("Checkout Fetch Error:", err);
      window.location.href = `/contact?plan=${plan}&error=fetch_error`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={
        className ||
        "inline-flex items-center gap-2 border border-site-border px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:border-site-text hover:bg-site-text hover:text-site-bg transition-all duration-300"
      }
    >
      {loading ? (
        <>
          <Loader2 size={12} className="animate-spin" /> {dict.ui.redirecting}
        </>
      ) : (
        <>
          {label} <ArrowUpRight size={12} />
        </>
      )}
    </button>
  );
}
