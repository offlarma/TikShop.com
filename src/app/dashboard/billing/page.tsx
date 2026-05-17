import { Suspense } from "react";
import { Check, CreditCard } from "lucide-react";

import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getPlanConfig, PLANS_CONFIG } from "@/lib/billing/plans";
import { getUsageSnapshot, getSubscription } from "@/lib/billing/quota";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { createClient } from "@/lib/supabase/server";

import { BillingActions } from "./billing-actions";
import { CheckoutStatusToast } from "./checkout-status-toast";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ status }, snapshot, subscription] = await Promise.all([
    searchParams,
    getUsageSnapshot(user.id),
    getSubscription(user.id),
  ]);

  const stripeReady = isStripeConfigured();
  const ratio =
    snapshot.limit === 0 ? 100 : Math.min(100, (snapshot.used / snapshot.limit) * 100);

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <CheckoutStatusToast status={status} />
      </Suspense>

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Billing & Plan</h1>
        <p className="text-muted-foreground">
          Manage your subscription and monitor your monthly usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">Current plan</CardTitle>
            <Badge variant="secondary">
              {getPlanConfig(snapshot.effectivePlan).name}
            </Badge>
            {snapshot.plan !== snapshot.effectivePlan ? (
              <Badge variant="warning">Subscription inactive</Badge>
            ) : null}
            {subscription?.cancel_at_period_end ? (
              <Badge variant="warning">Cancels at period end</Badge>
            ) : null}
          </div>
          <CardDescription>
            {snapshot.used} of {snapshot.limit} generations used this month ·
            resets on {new Date(snapshot.resetsAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress
            value={ratio}
            indicatorClassName={
              ratio >= 100
                ? "bg-destructive"
                : ratio >= 85
                  ? "bg-amber-500"
                  : undefined
            }
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Plan: {getPlanConfig(snapshot.plan).name}</span>
            <span>·</span>
            <span>Status: {snapshot.status}</span>
            {subscription?.current_period_end ? (
              <>
                <span>·</span>
                <span>
                  Renews on{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString(
                    undefined,
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </>
            ) : null}
          </div>

          <BillingActions
            stripeReady={stripeReady}
            hasStripeCustomer={Boolean(subscription?.stripe_customer_id)}
            currentPlan={snapshot.plan}
          />
        </CardContent>
      </Card>

      {!stripeReady ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Stripe is not configured on this deployment
            </CardTitle>
            <CardDescription>
              The pricing table below is informational only. Set
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                STRIPE_SECRET_KEY
              </code>
              ,
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                STRIPE_WEBHOOK_SECRET
              </code>
              ,
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                STRIPE_PRICE_PRO
              </code>{" "}
              and{" "}
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                STRIPE_PRICE_STUDIO
              </code>{" "}
              in your environment to enable checkout.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(PLANS_CONFIG).map((plan) => {
          const isCurrent = plan.id === snapshot.plan;
          return (
            <Card
              key={plan.id}
              className={
                isCurrent ? "border-foreground/40 shadow-sm" : undefined
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {isCurrent ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : null}
                </div>
                <p className="pt-1 text-2xl font-semibold tracking-tight">
                  {plan.priceLabel}
                </p>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-foreground" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <CreditCard className="h-3.5 w-3.5" />
        Subscriptions and invoices are managed in the Stripe Customer Portal.
      </p>
    </div>
  );
}
