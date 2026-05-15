"use client";

import { useState } from "react";
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
import { useStreamGeneration } from "@/hooks/use-stream-generation";

const COPY_TYPES = [
  "Product Title",
  "Product Description",
  "Ad Copy",
  "Bio / About",
] as const;
const TONES = ["Energetic", "Friendly", "Professional", "Bold", "Minimal"] as const;

type CopyType = (typeof COPY_TYPES)[number];
type Tone = (typeof TONES)[number];

export function CopyOptimizerForm() {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [copyType, setCopyType] = useState<CopyType>("Product Description");
  const [currentCopy, setCurrentCopy] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyBenefits, setKeyBenefits] = useState("");
  const [tone, setTone] = useState<Tone>("Friendly");

  const isDisabled = isStreaming || currentCopy.trim().length < 5;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({
      endpoint: "/api/copy-optimizer",
      body: {
        copyType,
        currentCopy,
        targetAudience,
        keyBenefits,
        tone,
      },
    });
  }

  function onReset() {
    setCopyType("Product Description");
    setCurrentCopy("");
    setTargetAudience("");
    setKeyBenefits("");
    setTone("Friendly");
    reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="copyType" label="Copy type">
            <Select
              value={copyType}
              onValueChange={(v) => setCopyType(v as CopyType)}
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
        </div>

        <FormField
          id="currentCopy"
          label="Current copy"
          hint={`${currentCopy.length}/2000`}
          required
        >
          <Textarea
            id="currentCopy"
            placeholder="Paste the copy you want to optimize..."
            value={currentCopy}
            onChange={(e) => setCurrentCopy(e.target.value)}
            maxLength={2000}
            rows={6}
            required
          />
        </FormField>

        <FormField id="targetAudience" label="Target audience">
          <Input
            id="targetAudience"
            placeholder="e.g. Gen Z students looking for affordable skincare"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            maxLength={200}
          />
        </FormField>

        <FormField
          id="keyBenefits"
          label="Key benefits / USPs"
          hint={`${keyBenefits.length}/800`}
        >
          <Textarea
            id="keyBenefits"
            placeholder="The top 2-3 things you want the copy to emphasize."
            value={keyBenefits}
            onChange={(e) => setKeyBenefits(e.target.value)}
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
  );
}
