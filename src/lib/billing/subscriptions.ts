import "server-only";

import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan, Subscription, SubscriptionStatus } from "@/types/db";

const PRICE_TO_PLAN_ENV: Array<{ plan: Plan; env: string }> = [
  { plan: "pro", env: "STRIPE_PRICE_PRO" },
  { plan: "studio", env: "STRIPE_PRICE_STUDIO" },
];

/** Map a Stripe price id to our internal Plan enum, falling back to 'free'. */
export function planFromPriceId(priceId: string | undefined | null): Plan {
  if (!priceId) return "free";
  for (const { plan, env } of PRICE_TO_PLAN_ENV) {
    if (process.env[env] && process.env[env] === priceId) return plan;
  }
  return "free";
}

export async function findUserIdByCustomerId(
  customerId: string
): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (error) {
    console.error("[subscriptions.findUserIdByCustomerId]", error);
    return null;
  }
  return (data?.user_id as string | undefined) ?? null;
}

export async function upsertSubscription(
  row: Partial<Subscription> & { user_id: string }
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });
  if (error) {
    console.error("[subscriptions.upsert]", error);
    throw error;
  }
}

export async function setStripeCustomerForUser(
  userId: string,
  customerId: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("subscriptions")
    .upsert(
      { user_id: userId, stripe_customer_id: customerId },
      { onConflict: "user_id" }
    );
  if (error) {
    console.error("[subscriptions.setStripeCustomerForUser]", error);
    throw error;
  }
}

export async function syncSubscriptionFromStripe(
  sub: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = await findUserIdByCustomerId(customerId);
  if (!userId) {
    console.warn(
      "[subscriptions.sync] No matching user for customer",
      customerId
    );
    return;
  }

  const priceId = sub.items.data[0]?.price.id;
  const plan = planFromPriceId(priceId);
  const status = sub.status as SubscriptionStatus;

  await upsertSubscription({
    user_id: userId,
    plan,
    status,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  });
}

export async function markSubscriptionCanceled(
  sub: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = await findUserIdByCustomerId(customerId);
  if (!userId) return;

  await upsertSubscription({
    user_id: userId,
    plan: "free",
    status: "canceled",
    stripe_subscription_id: sub.id,
    stripe_customer_id: customerId,
    cancel_at_period_end: false,
  });
}
