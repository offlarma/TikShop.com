"use client";

import { useTransition } from "react";
import { ArrowUpRight, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Plan } from "@/types/db";

import {
  openCustomerPortalAction,
  startCheckoutAction,
} from "./actions";

interface BillingActionsProps {
  stripeReady: boolean;
  hasStripeCustomer: boolean;
  currentPlan: Plan;
}

export function BillingActions({
  stripeReady,
  hasStripeCustomer,
  currentPlan,
}: BillingActionsProps) {
  const [isCheckingOut, startCheckout] = useTransition();
  const [isOpeningPortal, startPortal] = useTransition();

  function upgradeTo(plan: Plan) {
    startCheckout(async () => {
      try {
        await startCheckoutAction(plan);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not start checkout.";
        if (message.includes("NEXT_REDIRECT")) return;
        toast.error(message);
      }
    });
  }

  function openPortal() {
    startPortal(async () => {
      try {
        await openCustomerPortalAction();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not open the customer portal.";
        if (message.includes("NEXT_REDIRECT")) return;
        toast.error(message);
      }
    });
  }

  const showUpgradePro = currentPlan === "free";
  const showUpgradeStudio = currentPlan !== "studio";

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {stripeReady && showUpgradePro ? (
        <Button onClick={() => upgradeTo("pro")} disabled={isCheckingOut}>
          {isCheckingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4" />
              Upgrade to Pro
            </>
          )}
        </Button>
      ) : null}

      {stripeReady && showUpgradeStudio && currentPlan !== "free" ? (
        <Button
          variant="outline"
          onClick={() => upgradeTo("studio")}
          disabled={isCheckingOut}
        >
          <ArrowUpRight className="h-4 w-4" />
          Upgrade to Studio
        </Button>
      ) : null}

      {stripeReady && hasStripeCustomer ? (
        <Button
          variant="outline"
          onClick={openPortal}
          disabled={isOpeningPortal}
        >
          {isOpeningPortal ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Opening...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4" />
              Manage subscription
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}
