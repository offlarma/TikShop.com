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
  buildCopyOptimizerPrompt,
  copyOptimizerInputSchema,
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

  const parsed = copyOptimizerInputSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(first?.message ?? "Invalid input.");
  }

  const input = parsed.data;
  const prompt = buildCopyOptimizerPrompt(input);

  const result = streamText({
    model: aiModel,
    prompt,
    ...generationConfig,
    async onFinish({ text, finishReason, usage }) {
      console.log(
        `[copy-optimizer.onFinish] reason=${finishReason} text.length=${text.length} tokens=${usage?.totalTokens ?? "?"}`
      );
      if (!user) {
        console.warn(`[copy-optimizer.onFinish] no user — skipping save`);
        return;
      }
      if (!text.trim()) {
        console.warn(
          `[copy-optimizer.onFinish] empty output (reason=${finishReason}) — skipping save`
        );
        return;
      }
      const generation = await insertGeneration({
        userId: user.id,
        tool: "copy-optimizer",
        input: input as unknown as Record<string, unknown>,
        output: text,
      });
      await recordUsageEvent({
        userId: user.id,
        tool: "copy-optimizer",
        generationId: generation?.id,
      });
      console.log(
        `[copy-optimizer.onFinish] saved generation id=${generation?.id ?? "(null)"}`
      );
    },
    onError({ error }) {
      console.error(`[copy-optimizer.streamError]`, error);
    },
  });

  return result.toTextStreamResponse();
}
