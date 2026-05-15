"use client";

import { useState } from "react";
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
import { useStreamGeneration } from "@/hooks/use-stream-generation";

const CHANNELS = ["TikTok DM", "Instagram DM", "Email"] as const;
const TONES = ["Friendly", "Professional", "Casual", "Direct"] as const;

type Channel = (typeof CHANNELS)[number];
type Tone = (typeof TONES)[number];

export function OutreachForm() {
  const { output, isStreaming, error, generate, reset } = useStreamGeneration();

  const [brandName, setBrandName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [creatorNiche, setCreatorNiche] = useState("");
  const [offer, setOffer] = useState("");
  const [channel, setChannel] = useState<Channel>("TikTok DM");
  const [tone, setTone] = useState<Tone>("Friendly");

  const isDisabled =
    isStreaming ||
    brandName.trim().length === 0 ||
    productDescription.trim().length < 10 ||
    creatorNiche.trim().length < 2 ||
    offer.trim().length < 2;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generate({
      endpoint: "/api/outreach",
      body: {
        brandName,
        productDescription,
        creatorNiche,
        offer,
        channel,
        tone,
      },
    });
  }

  function onReset() {
    setBrandName("");
    setProductDescription("");
    setCreatorNiche("");
    setOffer("");
    setChannel("TikTok DM");
    setTone("Friendly");
    reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField id="brandName" label="Brand / store name" required>
          <Input
            id="brandName"
            placeholder="e.g. Glow Beauty Co."
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            maxLength={120}
            required
          />
        </FormField>

        <FormField
          id="productDescription"
          label="Product description"
          hint={`${productDescription.length}/1500`}
          required
        >
          <Textarea
            id="productDescription"
            placeholder="What are you selling? Why should creators care?"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            maxLength={1500}
            rows={4}
            required
          />
        </FormField>

        <FormField id="creatorNiche" label="Creator niche / persona" required>
          <Input
            id="creatorNiche"
            placeholder="e.g. Skincare reviewers with 10k-100k followers"
            value={creatorNiche}
            onChange={(e) => setCreatorNiche(e.target.value)}
            maxLength={200}
            required
          />
        </FormField>

        <FormField id="offer" label="Commission / offer" required>
          <Textarea
            id="offer"
            placeholder="e.g. 25% commission on every sale + free product sample"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            maxLength={400}
            rows={3}
            required
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="channel" label="Channel">
            <Select
              value={channel}
              onValueChange={(v) => setChannel(v as Channel)}
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
  );
}
