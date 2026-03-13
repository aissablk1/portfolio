"use client";

import React from "react";
import GlassButton from "@/components/ui/buttons/GlassButton";

export default function GlassButtonPreview() {
  return (
    <main className="min-h-screen w-full bg-neutral-200 text-neutral-900 flex items-center justify-center p-6">
      {/* Background dotted grid */}
      <svg
        className="absolute inset-0 -z-10 h-full w-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dottedGrid"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dottedGrid)" />
      </svg>

      <div className="relative z-10 max-w-3xl w-full bg-white/30 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Glass Button Playground
          </h1>
          <p className="text-sm md:text-base text-neutral-600">
            Test des variantes de tailles, d’états et de composition du bouton
            glass.
          </p>
        </header>

        {/* Tailles */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Sizes
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <GlassButton size="xs">XS – Aïssa</GlassButton>
            <GlassButton size="sm">SM – Aïssa Belkoussa</GlassButton>
            <GlassButton size="md">MD – Glass Button</GlassButton>
            <GlassButton size="lg">LG – Call To Action</GlassButton>
          </div>
        </section>

        {/* États / usages */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            States &amp; Use cases
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Default
              </p>
              <GlassButton size="md">
                Aïssa Belkoussa – Portfolio
              </GlassButton>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                With Tailwind layout
              </p>
              <GlassButton
                size="md"
                className="shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                Lancer DropOrch
              </GlassButton>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Disabled
              </p>
              <GlassButton
                size="md"
                disabled
                className="opacity-60 cursor-not-allowed"
              >
                Bientôt disponible
              </GlassButton>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                As primary CTA
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <GlassButton size="lg">Démarrer MYRALERT</GlassButton>
                <span className="text-xs text-neutral-600">
                  ↳ Hover / click pour voir toutes les animations
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Fond de section de test intégré */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Full width demo
          </h2>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 p-[1px]">
            <div className="relative rounded-2xl bg-neutral-900/80 px-5 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Live scenario
                </p>
                <p className="text-sm md:text-base text-neutral-200">
                  Imagine ce bouton comme CTA principal sur ton dashboard
                  Next.js + shadcn/ui.
                </p>
              </div>
              <GlassButton size="md" className="mt-2 md:mt-0">
                Protéger mon identité numérique
              </GlassButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
