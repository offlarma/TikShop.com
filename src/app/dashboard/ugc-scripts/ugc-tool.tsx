"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";

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

const TONES = ["Energetic", "Friendly", "Professional", "Funny", "Authentic"] as const;
const HOOK_STYLES = [
  "Question",
  "Bold statement",
  "Story",
  "Problem / Solution",
] as const;
const DURATIONS = ["15s", "30s", "60s"] as const;

type Tone = (typeof TONES)[number];
type HookStyle = (typeof HOOK_STYLES)[number];
type Duration = (typeof DURATIONS)[number];

type UgcInput = {
  productName: string;
  productDescription: string;
  targetAudience: string;
  tone: Tone;
  hookStyle: HookStyle;
  duration: Duration;
};

const DEFAULTS: UgcInput = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  tone: "Energetic",
  hookStyle: "Bold statement",
  duration: "30s",
};

export function UgcTool({ initialHistory }: { initialHistory: Generation[] }) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<UgcInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      // Stream just finished successfully: refresh history from the server.
      void loadHistoryAction("ugc-scripts").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled =
    isStreaming ||
    values.productName.trim().length === 0 ||
    values.productDescription.trim().length < 10;

  function set<K extends keyof UgcInput>(key: K, val: UgcInput[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/ugc-scripts", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: UgcInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField id="productName" label="Product name" required>
            <Input
              id="productName"
              placeholder="e.g. Glow Serum Vitamin C"
              value={values.productName}
              onChange={(e) => set("productName", e.target.value)}
              maxLength={120}
              required
            />
          </FormField>

          <FormField
            id="productDescription"
            label="Product description / key features"
            hint={`${values.productDescription.length}/1500`}
            required
          >
            <Textarea
              id="productDescription"
              placeholder="What does it do? What makes it different? List the top 2-3 benefits."
              value={values.productDescription}
              onChange={(e) => set("productDescription", e.target.value)}
              maxLength={1500}
              rows={5}
              required
            />
          </FormField>

          <FormField id="targetAudience" label="Target audience">
            <Input
              id="targetAudience"
              placeholder="e.g. Women 20-35 with sensitive skin"
              value={values.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              maxLength={200}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
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

            <FormField id="hookStyle" label="Hook style">
              <Select
                value={values.hookStyle}
                onValueChange={(v) => set("hookStyle", v as HookStyle)}
              >
                <SelectTrigger id="hookStyle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOOK_STYLES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="duration" label="Duration">
              <Select
                value={values.duration}
                onValueChange={(v) => set("duration", v as Duration)}
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate script
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
          emptyTitle="Your UGC script will appear here"
          emptyDescription="Fill in the form on the left and click Generate to draft a TikTok Shop UGC script."
        />
      </div>

      <GenerationHistory<UgcInput>
        tool="ugc-scripts"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) =>
          input.productName ? input.productName : "UGC script"
        }
      />
    </div>
  );
}
