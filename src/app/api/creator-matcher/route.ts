import { streamText } from "ai";

import { aiModel, generationConfig } from "@/lib/openai";
import {
  badRequest,
  enforceQuotaAndRateLimit,
  ensureOpenAIConfigured,
  requireUser,
} from "@/lib/api-helpers";
import { insertGeneration } from "@/lib/db/generations";
import { recordUsageEvent } from "@/lib/billing/quota";
import {
  buildCreatorMatcherPrompt,
  creatorMatcherInputSchema,
} from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user, response: authError } = await requireUser();
  if (authError) return authError;

  const configError = ensureOpenAIConfigured();
  if (configError) return configError;

  const limited = await enforceQuotaAndRateLimit(user!.id);
  if (limited) return limited;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  const parsed = creatorMatcherInputSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(first?.message ?? "Invalid input.");
  }

  const input = parsed.data;
  const prompt = buildCreatorMatcherPrompt(input);

  const result = streamText({
    model: aiModel,
    prompt,
    ...generationConfig,
    async onFinish({ text, finishReason, usage }) {
      console.log(
        `[creator-matcher.onFinish] reason=${finishReason} text.length=${text.length} tokens=${usage?.totalTokens ?? "?"}`
      );
      if (!user) {
        console.warn(`[creator-matcher.onFinish] no user — skipping save`);
        return;
      }
      if (!text.trim()) {
        console.warn(
          `[creator-matcher.onFinish] empty output (reason=${finishReason}) — skipping save`
        );
        return;
      }
      const generation = await insertGeneration({
        userId: user.id,
        tool: "creator-matcher",
        input: input as unknown as Record<string, unknown>,
        output: text,
      });
      await recordUsageEvent({
        userId: user.id,
        tool: "creator-matcher",
        generationId: generation?.id,
      });
      console.log(
        `[creator-matcher.onFinish] saved generation id=${generation?.id ?? "(null)"}`
      );
    },
    onError({ error }) {
      console.error(`[creator-matcher.streamError]`, error);
    },
  });

  return result.toTextStreamResponse();
}
