import type { Plan } from "@/types/db";

export interface PlanConfig {
  id: Plan;
  name: string;
  monthlyLimit: number;
  priceLabel: string;
  description: string;
  perks: string[];
  /** Stripe price id, read from env at runtime so it can be omitted in dev. */
  stripePriceEnv?: "STRIPE_PRICE_PRO" | "STRIPE_PRICE_STUDIO";
}

export const PLANS_CONFIG: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    monthlyLimit: 10,
    priceLabel: "$0",
    description: "Get a feel for the suite with 10 generations per month.",
    perks: [
      "10 AI generations / month",
      "Access to all 3 tools",
      "Full history & favorites",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyLimit: 200,
    priceLabel: "$19 / month",
    description: "Best for active TikTok Shop sellers.",
    perks: [
      "200 AI generations / month",
      "Priority queue",
      "Email support",
    ],
    stripePriceEnv: "STRIPE_PRICE_PRO",
  },
  studio: {
    id: "studio",
    name: "Studio",
    monthlyLimit: 1000,
    priceLabel: "$49 / month",
    description: "For agencies and high-volume operators.",
    perks: [
      "1000 AI generations / month",
      "Priority support",
      "Early access to new tools",
    ],
    stripePriceEnv: "STRIPE_PRICE_STUDIO",
  },
};

export const PAID_PLANS: Plan[] = ["pro", "studio"];

export function getPlanConfig(plan: Plan): PlanConfig {
  return PLANS_CONFIG[plan];
}

export function getStripePriceId(plan: Plan): string | undefined {
  const env = PLANS_CONFIG[plan].stripePriceEnv;
  if (!env) return undefined;
  return process.env[env];
}
