"use client";

import { useState } from "react";
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
import { useStreamGeneration } from "@/hooks/use-stream-generation";

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

export function UgcForm() {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState<Tone>("Energetic");
  const [hookStyle, setHookStyle] = useState<HookStyle>("Bold statement");
  const [duration, setDuration] = useState<Duration>("30s");

  const isDisabled =
    isStreaming ||
    productName.trim().length === 0 ||
    productDescription.trim().length < 10;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({
      endpoint: "/api/ugc-scripts",
      body: {
        productName,
        productDescription,
        targetAudience,
        tone,
        hookStyle,
        duration,
      },
    });
  }

  function onReset() {
    setProductName("");
    setProductDescription("");
    setTargetAudience("");
    setTone("Energetic");
    setHookStyle("Bold statement");
    setDuration("30s");
    reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField id="productName" label="Product name" required>
          <Input
            id="productName"
            placeholder="e.g. Glow Serum Vitamin C"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            maxLength={120}
            required
          />
        </FormField>

        <FormField
          id="productDescription"
          label="Product description / key features"
          hint={`${productDescription.length}/1500`}
          required
        >
          <Textarea
            id="productDescription"
            placeholder="What does it do? What makes it different? List the top 2-3 benefits."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            maxLength={1500}
            rows={5}
            required
          />
        </FormField>

        <FormField id="targetAudience" label="Target audience">
          <Input
            id="targetAudience"
            placeholder="e.g. Women 20-35 with sensitive skin"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            maxLength={200}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="tone" label="Tone">
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
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
              value={hookStyle}
              onValueChange={(v) => setHookStyle(v as HookStyle)}
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
              value={duration}
              onValueChange={(v) => setDuration(v as Duration)}
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
  );
}
