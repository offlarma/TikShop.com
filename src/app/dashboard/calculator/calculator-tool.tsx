"use client";

import { useMemo, useState } from "react";
import {
  Coins,
  PiggyBank,
  Receipt,
  RotateCcw,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/dashboard/form-field";
import { cn } from "@/lib/utils";

interface Inputs {
  productCost: number;
  shippingCost: number;
  packagingCost: number;
  platformFeePct: number;
  affiliateCommissionPct: number;
  retailPrice: number;
  targetMarginPct: number;
}

const DEFAULTS: Inputs = {
  productCost: 8,
  shippingCost: 3,
  packagingCost: 0.5,
  platformFeePct: 8,
  affiliateCommissionPct: 10,
  retailPrice: 29.99,
  targetMarginPct: 30,
};

const formatCurrency = (n: number) =>
  Number.isFinite(n)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(n)
    : "—";

const formatPct = (n: number) =>
  Number.isFinite(n) ? `${n.toFixed(1)}%` : "—";

export function CalculatorTool() {
  const [v, setV] = useState<Inputs>(DEFAULTS);

  function set<K extends keyof Inputs>(key: K, raw: string) {
    const num = Number(raw);
    setV((prev) => ({ ...prev, [key]: Number.isNaN(num) ? 0 : num }));
  }

  function onReset() {
    setV(DEFAULTS);
  }

  const result = useMemo(() => computeMargins(v), [v]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-5"
        aria-label="Margin calculator inputs"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="productCost" label="Product cost ($)" required>
            <Input
              id="productCost"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={v.productCost}
              onChange={(e) => set("productCost", e.target.value)}
            />
          </FormField>
          <FormField id="shippingCost" label="Shipping ($)">
            <Input
              id="shippingCost"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={v.shippingCost}
              onChange={(e) => set("shippingCost", e.target.value)}
            />
          </FormField>
          <FormField id="packagingCost" label="Packaging ($)">
            <Input
              id="packagingCost"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={v.packagingCost}
              onChange={(e) => set("packagingCost", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="platformFeePct" label="TikTok Shop fee (%)">
            <Input
              id="platformFeePct"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max="100"
              value={v.platformFeePct}
              onChange={(e) => set("platformFeePct", e.target.value)}
            />
          </FormField>
          <FormField id="affiliateCommissionPct" label="Affiliate commission (%)">
            <Input
              id="affiliateCommissionPct"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              max="100"
              value={v.affiliateCommissionPct}
              onChange={(e) =>
                set("affiliateCommissionPct", e.target.value)
              }
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="retailPrice" label="Retail price ($)" required>
            <Input
              id="retailPrice"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={v.retailPrice}
              onChange={(e) => set("retailPrice", e.target.value)}
            />
          </FormField>
          <FormField id="targetMarginPct" label="Target margin (%)">
            <Input
              id="targetMarginPct"
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0"
              max="100"
              value={v.targetMarginPct}
              onChange={(e) => set("targetMarginPct", e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset to defaults
          </Button>
        </div>
      </form>

      <ResultsPanel result={result} retailPrice={v.retailPrice} />
    </div>
  );
}

function ResultsPanel({
  result,
  retailPrice,
}: {
  result: MarginResult;
  retailPrice: number;
}) {
  const marginColor =
    result.marginPct >= 30
      ? "text-emerald-600 dark:text-emerald-400"
      : result.marginPct >= 15
        ? "text-amber-600 dark:text-amber-400"
        : "text-destructive";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Per-unit profit
        </p>
        <p className={cn("mt-2 text-4xl font-semibold tracking-tight", marginColor)}>
          {formatCurrency(result.profit)}
        </p>
        <p className={cn("mt-1 text-sm font-medium", marginColor)}>
          {formatPct(result.marginPct)} margin on retail
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          icon={Coins}
          label="Total unit cost"
          value={formatCurrency(result.totalCost)}
          sub="Product + shipping + packaging"
        />
        <MetricCard
          icon={Receipt}
          label="TikTok Shop fee"
          value={formatCurrency(result.platformFee)}
          sub={`${formatPct(result.platformFeePct)} of retail`}
        />
        <MetricCard
          icon={Wallet}
          label="Affiliate commission"
          value={formatCurrency(result.affiliateCommission)}
          sub={`${formatPct(result.affiliateCommissionPct)} of retail`}
        />
        <MetricCard
          icon={TrendingUp}
          label="Net revenue"
          value={formatCurrency(result.netRevenue)}
          sub="After all fees, before COGS"
        />
        <MetricCard
          icon={PiggyBank}
          label="Break-even price"
          value={formatCurrency(result.breakEvenPrice)}
          sub="Sell at or above to avoid losing money"
        />
        <MetricCard
          icon={Target}
          label={`Suggested price for ${formatPct(result.targetMarginPct)} margin`}
          value={formatCurrency(result.recommendedPrice)}
          sub={
            retailPrice && result.recommendedPrice > retailPrice
              ? `Raise price by ${formatCurrency(result.recommendedPrice - retailPrice)}`
              : retailPrice && result.recommendedPrice < retailPrice
                ? `You can lower price by ${formatCurrency(retailPrice - result.recommendedPrice)}`
                : "You're on target"
          }
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Estimates only. Actual TikTok Shop fees vary by category, country and
        seller program. Always validate against your seller dashboard.
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
      {sub ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

interface MarginResult {
  totalCost: number;
  platformFee: number;
  platformFeePct: number;
  affiliateCommission: number;
  affiliateCommissionPct: number;
  netRevenue: number;
  profit: number;
  marginPct: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  targetMarginPct: number;
}

function computeMargins(v: Inputs): MarginResult {
  const totalCost = v.productCost + v.shippingCost + v.packagingCost;
  const feeRatio = v.platformFeePct / 100;
  const commRatio = v.affiliateCommissionPct / 100;
  const targetRatio = v.targetMarginPct / 100;

  const platformFee = v.retailPrice * feeRatio;
  const affiliateCommission = v.retailPrice * commRatio;
  const netRevenue = v.retailPrice - platformFee - affiliateCommission;
  const profit = netRevenue - totalCost;
  const marginPct = v.retailPrice > 0 ? (profit / v.retailPrice) * 100 : 0;

  const fixedRatio = feeRatio + commRatio;
  const denomBreakeven = 1 - fixedRatio;
  const breakEvenPrice =
    denomBreakeven > 0 ? totalCost / denomBreakeven : Infinity;
  const denomTarget = 1 - fixedRatio - targetRatio;
  const recommendedPrice =
    denomTarget > 0 ? totalCost / denomTarget : Infinity;

  return {
    totalCost,
    platformFee,
    platformFeePct: v.platformFeePct,
    affiliateCommission,
    affiliateCommissionPct: v.affiliateCommissionPct,
    netRevenue,
    profit,
    marginPct,
    breakEvenPrice,
    recommendedPrice,
    targetMarginPct: v.targetMarginPct,
  };
}
