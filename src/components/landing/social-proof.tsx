"use client";

import { FadeUp } from "./motion-primitives";

// Minimalist wordmarks rendered as type — keeps the page light (no images)
// and stays sharp on retina. Names are intentionally generic placeholders
// for early-stage social proof.
const LOGOS = [
  { name: "Lunaria", style: "font-serif" },
  { name: "Northpeak", style: "font-semibold tracking-tight" },
  { name: "OBSIDIAN", style: "font-bold tracking-[0.2em] text-sm" },
  { name: "drift//", style: "font-mono" },
  { name: "Mosaic Co.", style: "italic font-medium" },
  { name: "Halo Labs", style: "font-semibold" },
];

export function LandingSocialProof() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <FadeUp>
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by 10,000+ top TikTok sellers
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <ul
            className="grid grid-cols-2 items-center gap-x-8 gap-y-6 opacity-70 grayscale sm:grid-cols-3 md:grid-cols-6"
            aria-label="Brands using TikShopDrop"
          >
            {LOGOS.map((logo) => (
              <li
                key={logo.name}
                className={`flex select-none items-center justify-center text-lg text-muted-foreground/80 transition-opacity hover:opacity-100 ${logo.style}`}
              >
                {logo.name}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
