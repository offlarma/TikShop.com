"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FadeUp } from "./motion-primitives";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft radial backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]
                   bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--muted))_0%,transparent_70%)]"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-24 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28">
        <FadeUp immediate delay={0} className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3" />
            AI tools, built for TikTok Shop sellers
          </span>
        </FadeUp>

        <FadeUp immediate delay={0.08}>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            The AI toolkit for{" "}
            <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              TikTok Shop
            </span>{" "}
            sellers.
          </h1>
        </FadeUp>

        <FadeUp immediate delay={0.18}>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            TikShopDrop turns one product brief into UGC scripts, affiliate
            outreach drafts and conversion-focused copy — in seconds, from a
            single dashboard.
          </p>
        </FadeUp>

        <FadeUp
          immediate
          delay={0.28}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="px-6">
            <Link href="/signup">
              Start generating for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="px-5">
            <Link href="#features">
              <PlayCircle className="h-4 w-4" />
              See how it works
            </Link>
          </Button>
        </FadeUp>

        <FadeUp immediate delay={0.4} className="mt-5">
          <p className="text-xs text-muted-foreground">
            No credit card required · 10 free generations every month
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
