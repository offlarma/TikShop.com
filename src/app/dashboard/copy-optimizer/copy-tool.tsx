"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Wand2 } from "lucide-react";

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

const COPY_TYPES = [
  "Product Title",
  "Product Description",
  "Ad Copy",
  "Bio / About",
] as const;
const TONES = ["Energetic", "Friendly", "Professional", "Bold", "Minimal"] as const;

type CopyType = (typeof COPY_TYPES)[number];
type Tone = (typeof TONES)[number];

type CopyOptimizerInput = {
  copyType: CopyType;
  currentCopy: string;
  targetAudience: string;
  keyBenefits: string;
  tone: Tone;
};

const DEFAULTS: CopyOptimizerInput = {
  copyType: "Product Description",
  currentCopy: "",
  targetAudience: "",
  keyBenefits: "",
  tone: "Friendly",
};

export function CopyOptimizerTool({
  initialHistory,
}: {
  initialHistory: Generation[];
}) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<CopyOptimizerInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      void loadHistoryAction("copy-optimizer").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled = isStreaming || values.currentCopy.trim().length < 5;

  function set<K extends keyof CopyOptimizerInput>(
    key: K,
    val: CopyOptimizerInput[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/copy-optimizer", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: CopyOptimizerInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="copyType" label="Copy type">
              <Select
                value={values.copyType}
                onValueChange={(v) => set("copyType", v as CopyType)}
              >
                <SelectTrigger id="copyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COPY_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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

          <FormField
            id="currentCopy"
            label="Current copy"
            hint={`${values.currentCopy.length}/2000`}
            required
          >
            <Textarea
              id="currentCopy"
              placeholder="Paste the copy you want to optimize..."
              value={values.currentCopy}
              onChange={(e) => set("currentCopy", e.target.value)}
              maxLength={2000}
              rows={6}
              required
            />
          </FormField>

          <FormField id="targetAudience" label="Target audience">
            <Input
              id="targetAudience"
              placeholder="e.g. Gen Z students looking for affordable skincare"
              value={values.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              maxLength={200}
            />
          </FormField>

          <FormField
            id="keyBenefits"
            label="Key benefits / USPs"
            hint={`${values.keyBenefits.length}/800`}
          >
            <Textarea
              id="keyBenefits"
              placeholder="The top 2-3 things you want the copy to emphasize."
              value={values.keyBenefits}
              onChange={(e) => set("keyBenefits", e.target.value)}
              maxLength={800}
              rows={3}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Optimize copy
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
          emptyTitle="Your optimized variants will appear here"
          emptyDescription="Paste the copy you want to improve and we'll produce 3 conversion-focused variants with explanations."
        />
      </div>

      <GenerationHistory<CopyOptimizerInput>
        tool="copy-optimizer"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) => {
          const preview = input.currentCopy
            ? input.currentCopy.slice(0, 70).trim()
            : "";
          return preview
            ? `${input.copyType}: ${preview}${
                input.currentCopy.length > 70 ? "…" : ""
              }`
            : input.copyType;
        }}
      />
    </div>
  );
}
