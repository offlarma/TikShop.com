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

// ---------- Violation Appeals ----------

export const appealInputSchema = z.object({
  violationType: z
    .enum([
      "Counterfeit / IP claim",
      "Misleading content",
      "Product safety",
      "Listing policy",
      "Pricing / discount policy",
      "Shipping / fulfillment",
      "Account integrity",
      "Other",
    ])
    .default("Other"),
  affectedAsset: z
    .string()
    .trim()
    .min(2, "Tell us which product / listing / account was affected.")
    .max(200),
  whatHappened: z
    .string()
    .trim()
    .min(20, "Describe what happened in at least 20 characters.")
    .max(2000),
  evidence: z.string().trim().max(2000).optional().default(""),
  desiredOutcome: z
    .enum([
      "Restore the listing",
      "Restore the account",
      "Remove the warning / strike",
      "Reinstate eligibility for promotions",
      "Other",
    ])
    .default("Restore the listing"),
  tone: z
    .enum(["Professional", "Firm but respectful", "Apologetic", "Concise"])
    .default("Professional"),
});

export type AppealInput = z.infer<typeof appealInputSchema>;

export function buildAppealPrompt(input: AppealInput) {
  const evidence = input.evidence
    ? input.evidence
    : "(no additional evidence provided — work from the facts above)";

  return `You are a senior TikTok Shop seller compliance specialist. Draft a
formal appeal to TikTok Shop seller support for the case below.

Violation type: ${input.violationType}
Affected listing / product / account: ${input.affectedAsset}
What happened (seller's account):
"""
${input.whatHappened}
"""

Supporting evidence:
${evidence}

Desired outcome: ${input.desiredOutcome}
Tone: ${input.tone}

Format the answer in Markdown with EXACTLY these sections:
## Subject
One concise subject line (≤ 80 chars) referencing the case.
## Appeal letter
The full appeal body, structured as four short paragraphs:
1) Acknowledge the violation notice and reference the specific listing/account.
2) Clearly state the facts and why the original decision should be reconsidered.
3) Cite the supporting evidence (or the absence of any policy breach).
4) State the desired outcome and offer to provide further information.
## Evidence checklist
A short bullet list (3-6 items) of documents / screenshots the seller
should attach when sending the appeal.

Constraints:
- Strictly English.
- Do not invent evidence or certifications that were not provided.
- Reference TikTok Shop policy categories generically (no fabricated URLs).
- Never threaten legal action or use aggressive language.
- Keep the appeal body under 300 words.`;
}

// ---------- Violation Scanner ----------

export const SCAN_CATEGORIES = [
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

export const violationScannerInputSchema = z.object({
  productTitle: z
    .string()
    .trim()
    .min(2, "Add the product title (at least 2 characters).")
    .max(200),
  productDescription: z
    .string()
    .trim()
    .min(20, "Paste the full product description (at least 20 characters).")
    .max(3000),
  keyClaims: z.string().trim().max(1500).optional().default(""),
  category: z.enum(SCAN_CATEGORIES).default("Other"),
  targetMarket: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("United States"),
  imageContext: z.string().trim().max(1000).optional().default(""),
  sensitivity: z
    .enum(["Lenient", "Standard", "Strict"])
    .default("Standard"),
});

export type ViolationScannerInput = z.infer<
  typeof violationScannerInputSchema
>;

export function buildViolationScannerPrompt(input: ViolationScannerInput) {
  const claims = input.keyClaims
    ? input.keyClaims
    : "(no explicit claims listed — infer from the description)";
  const imageContext = input.imageContext
    ? input.imageContext
    : "(no image context provided)";
  const market = input.targetMarket || "United States";

  const sensitivityRules =
    input.sensitivity === "Strict"
      ? "Be PARANOID. Flag even borderline phrasings and ambiguous claims. Lower the bar for what counts as a 🟡 warning."
      : input.sensitivity === "Lenient"
        ? "Only flag clear and likely violations. Skip stylistic nitpicks. Use 🟡 warnings sparingly."
        : "Be balanced: flag clear violations as 🔴, plausible risks as 🟡, ignore stylistic nitpicks.";

  return `You are a senior TikTok Shop policy compliance reviewer. Audit the
product listing below and surface every likely policy violation BEFORE
the seller publishes it.

Category: ${input.category}
Target market: ${market}
Review sensitivity: ${input.sensitivity}
${sensitivityRules}

Listing under review:
"""
Title: ${input.productTitle}

Description:
${input.productDescription}

Key claims / bullet points:
${claims}

Image context (described by seller):
${imageContext}
"""

Policy areas to consider (NON exhaustive — apply judgement):
- Counterfeit / intellectual property / trademark claims
- Medical, therapeutic, drug or disease claims ("cures", "treats", "prevents")
- Misleading / unsubstantiated performance claims ("guaranteed", "100% effective")
- Before / after content (especially body, skin, weight)
- Restricted ingredients (e.g. hydroquinone, retinoids in some markets, CBD/THC)
- Regulated categories (supplements, sexual wellness, weapons accessories, alcohol, tobacco)
- Age-gated content
- Hate speech / discriminatory language
- Endangered species, ivory, fur from protected animals
- Live animals, hazardous materials
- Financial scams, get-rich-quick framing
- Privacy / personal data claims
- Unverified certifications ("FDA approved", "clinically proven")
- Pricing / discount / scarcity manipulation ("only 2 left!" without basis)

Format the answer in Markdown with EXACTLY these top-level sections.
Use this OUTPUT TEMPLATE verbatim:

## Overall risk: <Low | Medium | High>
One sentence justifying the score.

## Issues found (<N>)
For each issue use a third-level heading like:
### 🔴 Hard violation — <short title>
(or "### 🟡 Warning — <short title>")
- **Where**: short quote from the listing
- **Policy area**: <category name>
- **Why it's risky**: 1 line
- **Suggested fix**: 1 line, concrete and copy-pasteable

If there are zero issues, write a single line: "No clear violations detected at this sensitivity level."

## Policy areas checked
A bulleted list of the policy areas you actually evaluated (so the seller knows coverage). Use the names from the list above.

## Suggested safer rewrite
### Title
A policy-safe rewrite of the product title (≤ 80 chars).
### Description
A policy-safe rewrite of the product description, preserving the same selling points but removing risky claims (60-180 words).

## Disclaimer
Two sentences: this is an AI estimation based on commonly enforced TikTok Shop policies, not a guarantee. Always verify against the current TikTok Shop Seller Center guidelines for ${market}.

Hard constraints:
- Strictly English.
- Do NOT invent specific TikTok Shop policy URLs or document numbers.
- Quote the seller's exact words when flagging an issue.
- Never accuse the seller of intent — describe the listing, not the person.
- If a claim could be substantiated with documentation, say so in the fix.`;
}

// ---------- Creator Matcher ----------

export const creatorMatcherInputSchema = z.object({
  productDescription: z
    .string()
    .trim()
    .min(10, "Describe the product in at least 10 characters.")
    .max(1500),
  targetAudience: z
    .string()
    .trim()
    .min(2, "Tell us who the product is for.")
    .max(200),
  budgetRange: z
    .enum([
      "Affiliate / commission only",
      "Under $100 per creator",
      "$100 - $500 per creator",
      "$500 - $2,000 per creator",
      "$2,000+ per creator",
    ])
    .default("Affiliate / commission only"),
  creatorTier: z
    .enum([
      "Nano (1k - 10k followers)",
      "Micro (10k - 100k followers)",
      "Mid (100k - 500k followers)",
      "Macro (500k+ followers)",
      "Any",
    ])
    .default("Micro (10k - 100k followers)"),
  contentStyle: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default(""),
  geography: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("United States"),
});

export type CreatorMatcherInput = z.infer<typeof creatorMatcherInputSchema>;

export function buildCreatorMatcherPrompt(input: CreatorMatcherInput) {
  const contentStyle = input.contentStyle
    ? input.contentStyle
    : "no specific style preference — suggest a sensible default for the product";
  const geo = input.geography || "United States";

  return `You are a TikTok Shop creator-marketing strategist. Produce a
shortlist of 5 distinct TikTok creator personas to target for the brand
below. Do NOT invent real handles or usernames — describe archetypes the
seller can search for.

Product description:
"""
${input.productDescription}
"""

Target audience: ${input.targetAudience}
Budget per creator: ${input.budgetRange}
Creator tier: ${input.creatorTier}
Content style preference: ${contentStyle}
Geography: ${geo}

Format the answer in Markdown with EXACTLY these sections:
## Why this product needs creator marketing
A 1-2 sentence positioning summary.
## 5 creator personas to target
For each persona use a third-level heading "### Persona N — <short label>"
and include these bullets:
- **Niche & content type**: ...
- **Typical follower range**: ...
- **Why they fit**: 1 sentence
- **Where to find them**: TikTok search query or hashtags to try
- **Outreach angle**: 1 line, what to lead with in the DM
- **Red flags to avoid**: 1 short line
## Suggested next 7-day outreach plan
A bulleted list (5-7 bullets) of concrete actions for the seller this
week (e.g. "Send 20 DMs to Persona 1 with this angle...").

Constraints:
- Strictly English.
- Five personas, each clearly distinct in angle / audience.
- Do not invent real TikTok handles or follower counts. Use ranges only.
- Be specific to the product and audience above — no generic advice.`;
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
