import { z } from "zod";

// ---------- UGC Script Generator ----------

export const ugcInputSchema = z.object({
  productName: z.string().trim().min(1, "Product name is required.").max(120),
  productDescription: z
    .string()
    .trim()
    .min(10, "Please describe the product in at least 10 characters.")
    .max(1500),
  targetAudience: z.string().trim().max(200).optional().default(""),
  tone: z
    .enum(["Energetic", "Friendly", "Professional", "Funny", "Authentic"])
    .default("Energetic"),
  hookStyle: z
    .enum(["Question", "Bold statement", "Story", "Problem / Solution"])
    .default("Bold statement"),
  duration: z.enum(["15s", "30s", "60s"]).default("30s"),
});

export type UgcInput = z.infer<typeof ugcInputSchema>;

export function buildUgcPrompt(input: UgcInput) {
  const audience = input.targetAudience
    ? input.targetAudience
    : "general TikTok Shop shoppers";

  return `You are a senior UGC scriptwriter and short-form video strategist specialized in TikTok Shop.
Write ONE complete UGC-style video script for the product below. The script must sound like a real person talking to the camera, not like an ad.

Product name: ${input.productName}
Product description / key features:
${input.productDescription}

Target audience: ${audience}
Tone: ${input.tone}
Hook style: ${input.hookStyle}
Approximate duration: ${input.duration}

Format your answer in Markdown using exactly these sections:
## Hook (0-3s)
A single punchy line matching the requested hook style.
## Body
The main script, written as spoken lines on separate lines. Include 1-2 product demo beats and 1 specific benefit per beat. Keep it conversational.
## Call to Action
A clear, native TikTok Shop CTA (e.g., tap the yellow basket, link in bio, etc.).
## On-screen text suggestions
A short bulleted list of 3-5 captions/overlays to add in editing.

Constraints:
- Strictly English.
- Do NOT use hashtags or emojis in the script body (emojis allowed only in on-screen text).
- Keep total spoken length appropriate for ${input.duration}.
- Do not invent product features that were not provided.`;
}

// ---------- Affiliate Outreach ----------

export const outreachInputSchema = z.object({
  brandName: z.string().trim().min(1, "Brand or store name is required.").max(120),
  productDescription: z
    .string()
    .trim()
    .min(10, "Please describe the product in at least 10 characters.")
    .max(1500),
  creatorNiche: z
    .string()
    .trim()
    .min(2, "Tell us the creator niche or persona you're targeting.")
    .max(200),
  offer: z
    .string()
    .trim()
    .min(2, "Describe the commission / offer (e.g. 20% commission + free product).")
    .max(400),
  channel: z
    .enum([
      "TikTok DM",
      "Instagram DM",
      "Email",
    ])
    .default("TikTok DM"),
  tone: z
    .enum(["Friendly", "Professional", "Casual", "Direct"])
    .default("Friendly"),
});

export type OutreachInput = z.infer<typeof outreachInputSchema>;

export function buildOutreachPrompt(input: OutreachInput) {
  const lengthHint =
    input.channel === "Email"
      ? "Write a complete email with a subject line (≤ 60 chars) and a body of 100-180 words."
      : "Write a short DM of 60-110 words, easy to read on mobile, broken into 2-3 short paragraphs.";

  return `You are an affiliate program manager reaching out to creators on behalf of a TikTok Shop brand.
Write ONE personalized outreach message to recruit a creator into our affiliate program.

Brand / store: ${input.brandName}
Product description:
${input.productDescription}

Target creator niche / persona: ${input.creatorNiche}
Offer / commission: ${input.offer}
Channel: ${input.channel}
Tone: ${input.tone}

${lengthHint}

Format your answer in Markdown using exactly these sections:
${
  input.channel === "Email"
    ? "## Subject\nThe subject line.\n## Email body\nThe full email body."
    : "## Message\nThe DM, ready to copy and paste."
}
## Follow-up (after 3 days)
A short follow-up message (40-70 words) to send if there is no reply.

Constraints:
- Strictly English.
- Sound like a human, not a template. Reference the creator's niche naturally.
- Lead with value for the creator, not for the brand.
- Make the offer concrete and easy to say yes to.
- No emojis in the email subject. At most 1 emoji per DM if it fits the tone.
- Do not invent product features that were not provided.`;
}

// ---------- Copy Optimizer ----------

export const copyOptimizerInputSchema = z.object({
  copyType: z
    .enum(["Product Title", "Product Description", "Ad Copy", "Bio / About"])
    .default("Product Description"),
  currentCopy: z
    .string()
    .trim()
    .min(5, "Paste the current copy you want to optimize.")
    .max(2000),
  targetAudience: z.string().trim().max(200).optional().default(""),
  keyBenefits: z.string().trim().max(800).optional().default(""),
  tone: z
    .enum(["Energetic", "Friendly", "Professional", "Bold", "Minimal"])
    .default("Friendly"),
});

export type CopyOptimizerInput = z.infer<typeof copyOptimizerInputSchema>;

export function buildCopyOptimizerPrompt(input: CopyOptimizerInput) {
  const audience = input.targetAudience || "general TikTok Shop shoppers";
  const benefits =
    input.keyBenefits || "(none provided — infer from the current copy)";

  const lengthRule =
    input.copyType === "Product Title"
      ? "Each variant must be a single line, ≤ 80 characters, optimized for TikTok Shop search."
      : input.copyType === "Bio / About"
        ? "Each variant must be ≤ 160 characters, suitable for a TikTok Shop bio."
        : input.copyType === "Ad Copy"
          ? "Each variant must be 1-2 short sentences, hook-first, suitable for a paid ad."
          : "Each variant must be 60-120 words, scannable, benefit-driven.";

  return `You are a senior conversion copywriter specialized in TikTok Shop listings and ads.
Optimize the copy below for conversion.

Copy type: ${input.copyType}
Target audience: ${audience}
Key benefits / USPs to emphasize:
${benefits}

Tone: ${input.tone}

Current copy:
"""
${input.currentCopy}
"""

Format your answer in Markdown using exactly these sections:
## Variant A
[The first optimized variant.]
## Variant B
[The second optimized variant, with a different angle.]
## Variant C
[The third optimized variant, with a different angle.]
## Why these work
A short bulleted list (3-5 bullets) explaining the psychological / conversion principles you applied.

Variant rules:
- ${lengthRule}
- Strictly English.
- Each variant must clearly differ in angle (e.g. benefit-led, social-proof, problem-aware, curiosity, transformation).
- Do not invent features that contradict the original copy or stated benefits.
- No hashtags. No emojis unless absolutely native to the tone.`;
}
