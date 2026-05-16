"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FadeUp, StaggerGroup, StaggerItem } from "./motion-primitives";

interface PricingTier {
  id: "free" | "pro" | "studio";
  name: string;
  price: string;
  cadence?: string;
  description: string;
  perks: string[];
  cta: string;
  highlighted?: boolean;
}

// Kept in sync with src/lib/billing/plans.ts but inlined here so the
// landing page stays a pure client component (no server-only imports).
const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Try every tool, no card needed.",
    perks: [
      "10 AI generations / month",
      "Access to all 3 tools",
      "Full history & favorites",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    cadence: "/ month",
    description: "Best for active TikTok Shop sellers.",
    perks: [
      "200 AI generations / month",
      "Priority queue",
      "Email support",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$49",
    cadence: "/ month",
    description: "For agencies and high-volume operators.",
    perks: [
      "1000 AI generations / month",
      "Priority support",
      "Early access to new tools",
    ],
    cta: "Get Studio",
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-border/60 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Pricing
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple, transparent, monthly.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-4 text-pretty text-muted-foreground">
              Start on Free, upgrade when you ship. Cancel anytime in the
              Stripe customer portal.
            </p>
          </FadeUp>
        </div>

        <StaggerGroup className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.id}>
              <PricingCard tier={tier} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8",
        tier.highlighted
          ? "border-foreground/40 ring-1 ring-foreground/10"
          : "border-border/70"
      )}
    >
      {tier.highlighted ? (
        <Badge className="absolute right-6 top-6" variant="default">
          Most popular
        </Badge>
      ) : null}

      <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">
          {tier.price}
        </span>
        {tier.cadence ? (
          <span className="text-sm text-muted-foreground">{tier.cadence}</span>
        ) : null}
      </div>

      <ul className="mt-6 space-y-2 text-sm">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={tier.highlighted ? "default" : "outline"}
        className="mt-8 w-full"
      >
        <Link href="/signup">{tier.cta}</Link>
      </Button>
    </motion.div>
  );
}
