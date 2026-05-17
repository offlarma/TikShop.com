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
            Your next viral product launch starts today.
          </h2>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-4 text-pretty text-muted-foreground">
            Join thousands of TikTok Shop sellers using TikShopDrop to ship
            content, recruit creators, and optimize copy in minutes.
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
