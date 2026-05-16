"use client";

import { Megaphone, Users, Wand2, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { FadeUp, StaggerGroup, StaggerItem } from "./motion-primitives";

interface Feature {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  span?: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wand2,
    eyebrow: "Tool 01",
    title: "UGC Script Generator",
    description:
      "Scroll-stopping viral hooks engineered for the TikTok For You feed.",
    bullets: [
      "Hook · Body · CTA in seconds",
      "Tone-tuned to your brand voice",
      "On-screen text suggestions ready to paste",
    ],
    span: "md:col-span-2",
  },
  {
    icon: Users,
    eyebrow: "Tool 02",
    title: "Affiliate Outreach",
    description: "Automated personalized DMs that creators actually reply to.",
    bullets: [
      "TikTok DM · Instagram DM · Email",
      "Tailored to each creator niche",
      "Built-in 3-day follow-up",
    ],
  },
  {
    icon: Megaphone,
    eyebrow: "Tool 03",
    title: "Copy Optimizer",
    description:
      "Gen-Z focused SEO copy that turns product pages into checkout flows.",
    bullets: [
      "3 angles per request",
      "Titles, descriptions, ads & bios",
      "Conversion rationale included",
    ],
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              The 3-in-1 suite
            </p>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Every part of the funnel,
              <br className="hidden sm:block" /> covered by one workspace.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-4 text-pretty text-muted-foreground">
              Skip the agency. Skip the freelancers. Generate hooks, recruit
              creators, and rewrite copy from a single dashboard.
            </p>
          </FadeUp>
        </div>

        <StaggerGroup className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title} className={feature.span}>
              <FeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {feature.eyebrow}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>

      <ul className="mt-6 space-y-2 text-sm">
        {feature.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-muted-foreground"
          >
            <span
              aria-hidden
              className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
