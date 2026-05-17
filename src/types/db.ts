export const TOOLS = [
  "ugc-scripts",
  "outreach",
  "copy-optimizer",
  "appeals",
  "creator-matcher",
] as const;
export type Tool = (typeof TOOLS)[number];

export const TOOL_LABELS: Record<Tool, string> = {
  "ugc-scripts": "UGC Script Generator",
  outreach: "Affiliate Outreach",
  "copy-optimizer": "Copy Optimizer",
  appeals: "Violation Appeals",
  "creator-matcher": "Creator Matcher",
};

export type Generation = {
  id: string;
  user_id: string;
  tool: Tool;
  input: Record<string, unknown>;
  output: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export const PLANS = ["free", "pro", "studio"] as const;
export type Plan = (typeof PLANS)[number];

export const SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "paused",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type Subscription = {
  user_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};
