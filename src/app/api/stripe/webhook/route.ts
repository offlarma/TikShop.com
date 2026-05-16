import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe, isStripeConfigured } from "@/lib/billing/stripe";
import {
  markSubscriptionCanceled,
  syncSubscriptionFromStripe,
} from "@/lib/billing/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured on this deployment." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe.webhook] signature verification failed", err);
    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id
          );
          await syncSubscriptionFromStripe(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await syncSubscriptionFromStripe(
          event.data.object as Stripe.Subscription
        );
        break;
      }
      case "customer.subscription.deleted": {
        await markSubscriptionCanceled(
          event.data.object as Stripe.Subscription
        );
        break;
      }
      default: {
        // Unhandled event types are acknowledged with 200 by design.
        break;
      }
    }
  } catch (err) {
    console.error(`[stripe.webhook] handler error for ${event.type}`, err);
    return NextResponse.json(
      { error: "Webhook handler error." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
