"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, ScanSearch } from "lucide-react";

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

const CATEGORIES = [
  "Skincare & Beauty",
  "Supplements & Health",
  "Electronics & Tech",
  "Fashion & Apparel",
  "Food & Beverage",
  "Home & Living",
  "Baby & Kids",
  "Sports & Fitness",
  "Adult Wellness",
  "Other",
] as const;
const SENSITIVITIES = ["Lenient", "Standard", "Strict"] as const;

type Category = (typeof CATEGORIES)[number];
type Sensitivity = (typeof SENSITIVITIES)[number];

type ViolationScannerInput = {
  productTitle: string;
  productDescription: string;
  keyClaims: string;
  category: Category;
  targetMarket: string;
  imageContext: string;
  sensitivity: Sensitivity;
};

const DEFAULTS: ViolationScannerInput = {
  productTitle: "",
  productDescription: "",
  keyClaims: "",
  category: "Other",
  targetMarket: "United States",
  imageContext: "",
  sensitivity: "Standard",
};

export function ViolationScannerTool({
  initialHistory,
}: {
  initialHistory: Generation[];
}) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<ViolationScannerInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      void loadHistoryAction("violation-scanner").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled =
    isStreaming ||
    values.productTitle.trim().length < 2 ||
    values.productDescription.trim().length < 20;

  function set<K extends keyof ViolationScannerInput>(
    key: K,
    val: ViolationScannerInput[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/violation-scanner", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: ViolationScannerInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField id="productTitle" label="Product title" required>
            <Input
              id="productTitle"
              placeholder="e.g. Glow Serum Vitamin C — Clinically proven to clear acne"
              value={values.productTitle}
              onChange={(e) => set("productTitle", e.target.value)}
              maxLength={200}
              required
            />
          </FormField>

          <FormField
            id="productDescription"
            label="Product description"
            hint={`${values.productDescription.length}/3000`}
            required
          >
            <Textarea
              id="productDescription"
              placeholder="Paste the full description exactly as it appears on the listing — including any claims, certifications, before/after language."
              value={values.productDescription}
              onChange={(e) => set("productDescription", e.target.value)}
              maxLength={3000}
              rows={6}
              required
            />
          </FormField>

          <FormField
            id="keyClaims"
            label="Key claims / bullet points (optional)"
            hint={`${values.keyClaims.length}/1500`}
          >
            <Textarea
              id="keyClaims"
              placeholder="One per line. The risky points usually live here: 'cures acne', 'FDA approved', 'guaranteed results', etc."
              value={values.keyClaims}
              onChange={(e) => set("keyClaims", e.target.value)}
              maxLength={1500}
              rows={4}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="category" label="Category">
              <Select
                value={values.category}
                onValueChange={(v) => set("category", v as Category)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="sensitivity" label="Sensitivity">
              <Select
                value={values.sensitivity}
                onValueChange={(v) => set("sensitivity", v as Sensitivity)}
              >
                <SelectTrigger id="sensitivity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SENSITIVITIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField id="targetMarket" label="Target market">
            <Input
              id="targetMarket"
              placeholder="e.g. United States, UK, EU"
              value={values.targetMarket}
              onChange={(e) => set("targetMarket", e.target.value)}
              maxLength={200}
            />
          </FormField>

          <FormField
            id="imageContext"
            label="Image context (optional)"
            hint={`${values.imageContext.length}/1000`}
          >
            <Textarea
              id="imageContext"
              placeholder="Describe what's on the listing's main images (e.g. 'before/after photos of skin', 'medical equipment-style packaging'). Helps the scan catch image-driven issues."
              value={values.imageContext}
              onChange={(e) => set("imageContext", e.target.value)}
              maxLength={1000}
              rows={3}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanSearch className="h-4 w-4" />
                  Scan listing
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
          emptyTitle="Your compliance report will appear here"
          emptyDescription="Paste the listing on the left and click Scan. We'll surface every likely TikTok Shop policy issue and suggest a safer rewrite."
          exportName={
            values.productTitle
              ? `scan-${values.productTitle}`
              : "violation-scan"
          }
        />
      </div>

      <GenerationHistory<ViolationScannerInput>
        tool="violation-scanner"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) =>
          [input.category, input.productTitle].filter(Boolean).join(" · ") ||
          "Violation scan"
        }
      />
    </div>
  );
}
