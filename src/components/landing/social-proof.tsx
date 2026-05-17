"use client";

import { FadeUp } from "./motion-primitives";

const CATEGORIES = [
  "Skincare",
  "Beauty",
  "Supplements",
  "Wellness",
  "Fashion",
  "Apparel",
  "Electronics",
  "Tech accessories",
  "Food & Beverage",
  "Home & Living",
  "Fitness",
  "Sports",
  "Pet care",
  "Baby & Kids",
  "Lifestyle",
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
          <div
            className="relative overflow-hidden py-2"
            aria-label={`Categories served: ${CATEGORIES.join(", ")}`}
          >
            {/* Fade edges so categories appear and disappear smoothly */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-muted/30 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-muted/30 to-transparent" />

            <div
              className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
              aria-hidden="true"
            >
              {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
                <span
                  key={`${cat}-${i}`}
                  className="inline-flex select-none items-center whitespace-nowrap rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
