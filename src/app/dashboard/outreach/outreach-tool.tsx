"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Send } from "lucide-react";

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

const CHANNELS = ["TikTok DM", "Instagram DM", "Email"] as const;
const TONES = ["Friendly", "Professional", "Casual", "Direct"] as const;

type Channel = (typeof CHANNELS)[number];
type Tone = (typeof TONES)[number];

type OutreachInput = {
  brandName: string;
  productDescription: string;
  creatorNiche: string;
  offer: string;
  channel: Channel;
  tone: Tone;
};

const DEFAULTS: OutreachInput = {
  brandName: "",
  productDescription: "",
  creatorNiche: "",
  offer: "",
  channel: "TikTok DM",
  tone: "Friendly",
};

export function OutreachTool({
  initialHistory,
}: {
  initialHistory: Generation[];
}) {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [values, setValues] = useState<OutreachInput>(DEFAULTS);
  const [history, setHistory] = useState<Generation[]>(initialHistory);
  const wasStreaming = useRef(false);

  useEffect(() => {
    if (wasStreaming.current && !isStreaming && !error) {
      void loadHistoryAction("outreach").then((next) => {
        setHistory(sortByFavorites(next));
      });
    }
    wasStreaming.current = isStreaming;
  }, [isStreaming, error]);

  const isDisabled =
    isStreaming ||
    values.brandName.trim().length === 0 ||
    values.productDescription.trim().length < 10 ||
    values.creatorNiche.trim().length < 2 ||
    values.offer.trim().length < 2;

  function set<K extends keyof OutreachInput>(key: K, val: OutreachInput[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({ endpoint: "/api/outreach", body: values });
  }

  function onReset() {
    setValues(DEFAULTS);
    reset();
  }

  function onRerun(input: OutreachInput) {
    setValues({ ...DEFAULTS, ...input });
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField id="brandName" label="Brand / store name" required>
            <Input
              id="brandName"
              placeholder="e.g. Glow Beauty Co."
              value={values.brandName}
              onChange={(e) => set("brandName", e.target.value)}
              maxLength={120}
              required
            />
          </FormField>

          <FormField
            id="productDescription"
            label="Product description"
            hint={`${values.productDescription.length}/1500`}
            required
          >
            <Textarea
              id="productDescription"
              placeholder="What are you selling? Why should creators care?"
              value={values.productDescription}
              onChange={(e) => set("productDescription", e.target.value)}
              maxLength={1500}
              rows={4}
              required
            />
          </FormField>

          <FormField id="creatorNiche" label="Creator niche / persona" required>
            <Input
              id="creatorNiche"
              placeholder="e.g. Skincare reviewers with 10k-100k followers"
              value={values.creatorNiche}
              onChange={(e) => set("creatorNiche", e.target.value)}
              maxLength={200}
              required
            />
          </FormField>

          <FormField id="offer" label="Commission / offer" required>
            <Textarea
              id="offer"
              placeholder="e.g. 25% commission on every sale + free product sample"
              value={values.offer}
              onChange={(e) => set("offer", e.target.value)}
              maxLength={400}
              rows={3}
              required
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="channel" label="Channel">
              <Select
                value={values.channel}
                onValueChange={(v) => set("channel", v as Channel)}
              >
                <SelectTrigger id="channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
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

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={isDisabled}>
              {isStreaming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate outreach
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
          emptyTitle="Your outreach message will appear here"
          emptyDescription="Tell us about your brand, the creator you're targeting, and the offer. We'll draft the message + a follow-up."
        />
      </div>

      <GenerationHistory<OutreachInput>
        tool="outreach"
        items={history}
        onItemsChange={setHistory}
        onRerun={onRerun}
        inputSummary={(input) =>
          [input.brandName, input.creatorNiche].filter(Boolean).join(" · ") ||
          "Outreach message"
        }
      />
    </div>
  );
}
