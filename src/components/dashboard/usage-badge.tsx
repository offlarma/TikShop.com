import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPlanConfig } from "@/lib/billing/plans";
import type { UsageSnapshot } from "@/lib/billing/quota";
import { cn } from "@/lib/utils";

export function UsageBadge({ snapshot }: { snapshot: UsageSnapshot }) {
  const plan = getPlanConfig(snapshot.effectivePlan);
  const ratio = snapshot.limit === 0 ? 1 : snapshot.used / snapshot.limit;
  const variant: "secondary" | "warning" | "destructive" =
    ratio >= 1 ? "destructive" : ratio >= 0.85 ? "warning" : "secondary";

  return (
    <Link
      href="/dashboard/billing"
      className="group inline-flex items-center gap-2"
      title="Manage plan & usage"
    >
      <Badge variant={variant} className="gap-1">
        <Sparkles className="h-3 w-3" />
        {plan.name}
      </Badge>
      <span
        className={cn(
          "text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-foreground",
          ratio >= 1 && "text-destructive"
        )}
      >
        {snapshot.used} / {snapshot.limit}
      </span>
    </Link>
  );
}
