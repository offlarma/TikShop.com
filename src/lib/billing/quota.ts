import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getPlanConfig } from "@/lib/billing/plans";
import type { Plan, Subscription, SubscriptionStatus } from "@/types/db";

/** Statuses that should *not* grant access to the paid plan benefits. */
const INACTIVE_STATUSES: SubscriptionStatus[] = [
  "canceled",
  "incomplete_expired",
  "unpaid",
];

export type UsageSnapshot = {
  plan: Plan;
  status: SubscriptionStatus;
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string;
  effectivePlan: Plan;
};

function startOfCurrentMonthUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function startOfNextMonthUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

export async function getSubscription(
  userId: string
): Promise<Subscription | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[quota.getSubscription]", error);
    return null;
  }
  return (data ?? null) as Subscription | null;
}

export async function countMonthlyUsage(userId: string): Promise<number> {
  const supabase = await createClient();
  const since = startOfCurrentMonthUTC().toISOString();
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("occurred_at", since);

  if (error) {
    console.error("[quota.countMonthlyUsage]", error);
    return 0;
  }
  return count ?? 0;
}

export async function getUsageSnapshot(
  userId: string
): Promise<UsageSnapshot> {
  const [subscription, used] = await Promise.all([
    getSubscription(userId),
    countMonthlyUsage(userId),
  ]);

  const plan: Plan = subscription?.plan ?? "free";
  const status: SubscriptionStatus = subscription?.status ?? "active";

  // If the user is on a paid plan but the subscription is no longer
  // active (canceled / unpaid / expired) we silently downgrade them
  // to the free limits while keeping the nominal plan label.
  const effectivePlan: Plan = INACTIVE_STATUSES.includes(status) ? "free" : plan;
  const limit = getPlanConfig(effectivePlan).monthlyLimit;

  return {
    plan,
    status,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetsAt: startOfNextMonthUTC().toISOString(),
    effectivePlan,
  };
}

export type QuotaCheckResult =
  | { ok: true; snapshot: UsageSnapshot }
  | { ok: false; snapshot: UsageSnapshot; reason: string };

export async function checkQuota(userId: string): Promise<QuotaCheckResult> {
  const snapshot = await getUsageSnapshot(userId);
  if (snapshot.remaining <= 0) {
    const planName = getPlanConfig(snapshot.effectivePlan).name;
    return {
      ok: false,
      snapshot,
      reason: `You've reached your monthly limit of ${snapshot.limit} generations on the ${planName} plan. Upgrade or wait until next month for a reset.`,
    };
  }
  return { ok: true, snapshot };
}

export async function recordUsageEvent(params: {
  userId: string;
  tool: "ugc-scripts" | "outreach" | "copy-optimizer";
  generationId?: string | null;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("usage_events").insert({
    user_id: params.userId,
    tool: params.tool,
    generation_id: params.generationId ?? null,
  });
  if (error) {
    console.error("[quota.recordUsageEvent]", error);
  }
}
