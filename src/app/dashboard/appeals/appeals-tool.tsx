"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, ShieldAlert } from "lucide-react";

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

const VIOLATION_TYPES = [
  "Counterfeit / IP claim",
  "Misleading content",
  "Product safety",
  "Listing policy",
  "Pricing / discount policy",
  "Shipping / fulfillment",
  "Account integrity",
  "Other",
] as const;
const OUTCOMES = [
  "Restore the listing",
  "Restore the account",
  "Remove the warning / strike",
  "Reinstate eligibility for promotions",
  "Other",
] as const;
const TONES = ["Professional", "Firm but respectful", "Apologetic", "Concise"] as const;

type ViolationType = (typeof VIOLATION_TYPES)[number];
type Outcome = (typeof OUTCOMES)[number];
type Tone = (typeof TONES)[number];

type AppealInput = {
  violationType: ViolationType;
  affectedAsset: string;
  whatHappened: string;
  evidence: string;
  desiredOutcome: Outcome;
  tone: Tone;
};

const DEFAULTS: AppealInput = {
  violationType: "Other",
  affectedAsset: "",
  whatHappened: "",
  evidence: "",
  desiredOutcome: "Restore the listing",
  tone: "Professional",
};

export function AppealsTool({
  initialHistory,
}: {
  initialHistory: Generation[];
}) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<AppealInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      void loadHistoryAction("appeals").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled =
    isStreaming ||
    values.affectedAsset.trim().length < 2 ||
    values.whatHappened.trim().length < 20;

  function set<K extends keyof AppealInput>(key: K, val: AppealInput[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/appeals", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: AppealInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="violationType" label="Violation type">
              <Select
                value={values.violationType}
                onValueChange={(v) => set("violationType", v as ViolationType)}
              >
                <SelectTrigger id="violationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIOLATION_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="tone" label="Tone">
              <Select
                value={values.tone}
                onValueChange={(v) => set("tone", v as Tone)}
              >
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField id="affectedAsset" label="Affected listing / product / account" required>
            <Input
              id="affectedAsset"
              placeholder="e.g. Glow Serum 30ml (SKU 1234) — listing taken down"
              value={values.affectedAsset}
              onChange={(e) => set("affectedAsset", e.target.value)}
              maxLength={200}
              required
            />
          </FormField>

          <FormField
            id="whatHappened"
            label="What happened"
            hint={`${values.whatHappened.length}/2000`}
            required
          >
            <Textarea
              id="whatHappened"
              placeholder="Tell TikTok Shop the facts: when the action was taken, what the notice said, why you believe it's incorrect."
              value={values.whatHappened}
              onChange={(e) => set("whatHappened", e.target.value)}
              maxLength={2000}
              rows={6}
              required
            />
          </FormField>

          <FormField
            id="evidence"
            label="Supporting evidence (optional)"
            hint={`${values.evidence.length}/2000`}
          >
            <Textarea
              id="evidence"
              placeholder="Certifications, invoices, screenshots, third-party authentications, prior approvals…"
              value={values.evidence}
              onChange={(e) => set("evidence", e.target.value)}
              maxLength={2000}
              rows={4}
            />
          </FormField>

          <FormField id="desiredOutcome" label="Desired outcome">
            <Select
              value={values.desiredOutcome}
              onValueChange={(v) => set("desiredOutcome", v as Outcome)}
            >
              <SelectTrigger id="desiredOutcome">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTCOMES.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Drafting...
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Draft appeal
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
          emptyTitle="Your appeal letter will appear here"
          emptyDescription="Fill in the violation details on the left. We'll draft a structured appeal you can send to TikTok Shop support."
          exportName={
            values.affectedAsset ? `appeal-${values.affectedAsset}` : "appeal"
          }
        />
      </div>

      <GenerationHistory<AppealInput>
        tool="appeals"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) =>
          [input.violationType, input.affectedAsset].filter(Boolean).join(" · ") ||
          "Appeal"
        }
      />
    </div>
  );
}
