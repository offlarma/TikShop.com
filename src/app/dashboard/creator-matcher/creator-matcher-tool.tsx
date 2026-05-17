"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Radar, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/dashboard/form-field";
import { OutputPanel } from "@/components/dashboard/output-panel";
import {
  GenerationHistory,
  sortByFavorites,
} from "@/components/dashboard/generation-history";
import { useStreamGeneration } from "@/hooks/use-stream-generation";
import { loadHistoryAction } from "@/app/dashboard/actions";
import type { Generation } from "@/types/db";

const BUDGET_RANGES = [
  "Affiliate / commission only",
  "Under $100 per creator",
  "$100 - $500 per creator",
  "$500 - $2,000 per creator",
  "$2,000+ per creator",
] as const;
const TIERS = [
  "Nano (1k - 10k followers)",
  "Micro (10k - 100k followers)",
  "Mid (100k - 500k followers)",
  "Macro (500k+ followers)",
  "Any",
] as const;

type Budget = (typeof BUDGET_RANGES)[number];
type Tier = (typeof TIERS)[number];

type CreatorMatcherInput = {
  productDescription: string;
  targetAudience: string;
  budgetRange: Budget;
  creatorTier: Tier;
  contentStyle: string;
  geography: string;
};

const DEFAULTS: CreatorMatcherInput = {
  productDescription: "",
  targetAudience: "",
  budgetRange: "Affiliate / commission only",
  creatorTier: "Micro (10k - 100k followers)",
  contentStyle: "",
  geography: "United States",
};

export function CreatorMatcherTool({
  initialHistory,
}: {
  initialHistory: Generation[];
}) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<CreatorMatcherInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      void loadHistoryAction("creator-matcher").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled =
    isStreaming ||
    values.productDescription.trim().length < 10 ||
    values.targetAudience.trim().length < 2;

  function set<K extends keyof CreatorMatcherInput>(
    key: K,
    val: CreatorMatcherInput[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/creator-matcher", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: CreatorMatcherInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            id="productDescription"
            label="Product description"
            hint={`${values.productDescription.length}/1500`}
            required
          >
            <Textarea
              id="productDescription"
              placeholder="What are you selling? Why is it interesting for TikTok creators?"
              value={values.productDescription}
              onChange={(e) => set("productDescription", e.target.value)}
              maxLength={1500}
              rows={4}
              required
            />
          </FormField>

          <FormField id="targetAudience" label="Target audience" required>
            <Input
              id="targetAudience"
              placeholder="e.g. Gen Z women interested in clean skincare"
              value={values.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              maxLength={200}
              required
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="budgetRange" label="Budget per creator">
              <Select
                value={values.budgetRange}
                onValueChange={(v) => set("budgetRange", v as Budget)}
              >
                <SelectTrigger id="budgetRange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="creatorTier" label="Creator tier">
              <Select
                value={values.creatorTier}
                onValueChange={(v) => set("creatorTier", v as Tier)}
              >
                <SelectTrigger id="creatorTier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIERS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField
            id="contentStyle"
            label="Content style (optional)"
            hint={`${values.contentStyle.length}/300`}
          >
            <Input
              id="contentStyle"
              placeholder="e.g. ASMR unboxing, GRWM, day-in-the-life"
              value={values.contentStyle}
              onChange={(e) => set("contentStyle", e.target.value)}
              maxLength={300}
            />
          </FormField>

          <FormField id="geography" label="Geography">
            <Input
              id="geography"
              placeholder="e.g. United States, UK, Australia"
              value={values.geography}
              onChange={(e) => set("geography", e.target.value)}
              maxLength={200}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Matching...
                </>
              ) : (
                <>
                  <Radar className="h-4 w-4" />
                  Find creators
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onReset}
              disabled={isStreaming}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>

        <OutputPanel
          output={output}
          isStreaming={isStreaming}
          error={error}
          emptyTitle="Your creator shortlist will appear here"
          emptyDescription="Tell us about your product and audience and we'll surface 5 distinct creator personas to target."
          exportName="creator-matcher"
        />
      </div>

      <GenerationHistory<CreatorMatcherInput>
        tool="creator-matcher"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) =>
          [input.targetAudience, input.creatorTier].filter(Boolean).join(" · ") ||
          "Creator shortlist"
        }
      />
    </div>
  );
}
