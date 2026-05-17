"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FadeUp } from "./motion-primitives";

export function LandingCta() {
  return (
    <section className="border-t border-border/60 bg-muted/30 py-24 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <FadeUp>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Start drafting your next product launch.
          </h2>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-4 text-pretty text-muted-foreground">
            Use TikShopDrop to draft content, recruit creators and optimize
            copy in minutes, from a single dashboard.
          </p>
        </FadeUp>
        <FadeUp delay={0.16}>
          <Button asChild size="lg" className="mt-8 px-6">
            <Link href="/signup">
              Start generating for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
