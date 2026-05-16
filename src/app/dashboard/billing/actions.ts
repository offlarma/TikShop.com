"use server";

import { redirect } from "next/navigation";

import { getStripe, getAppUrl, isStripeConfigured } from "@/lib/billing/stripe";
import { getPlanConfig, getStripePriceId } from "@/lib/billing/plans";
import { getSubscription } from "@/lib/billing/quota";
import { setStripeCustomerForUser } from "@/lib/billing/subscriptions";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/db";

async function requireUserOrThrow() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    throw new Error("You must be signed in.");
  }
  return user;
}

export async function startCheckoutAction(plan: Plan): Promise<void> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured on this deployment.");
  }
  if (plan === "free") {
    throw new Error("Free plan does not require checkout.");
  }

  const priceId = getStripePriceId(plan);
  if (!priceId) {
    throw new Error(
      `Stripe price for plan "${plan}" is not configured. Set ${
        getPlanConfig(plan).stripePriceEnv
      }.`
    );
  }

  const user = await requireUserOrThrow();
  const stripe = getStripe();
  const subscription = await getSubscription(user.id);

  let customerId = subscription?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await setStripeCustomerForUser(user.id, customerId);
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?status=success`,
    cancel_url: `${appUrl}/dashboard/billing?status=cancelled`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  redirect(session.url);
}

export async function openCustomerPortalAction(): Promise<void> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured on this deployment.");
  }

  const user = await requireUserOrThrow();
  const subscription = await getSubscription(user.id);
  if (!subscription?.stripe_customer_id) {
    throw new Error("No Stripe customer found for this user.");
  }

  const stripe = getStripe();
  const appUrl = getAppUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(session.url);
}
