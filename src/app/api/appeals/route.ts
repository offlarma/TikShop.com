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
import { appealInputSchema, buildAppealPrompt } from "@/lib/prompts";

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

  const parsed = appealInputSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(first?.message ?? "Invalid input.");
  }

  const input = parsed.data;
  const prompt = buildAppealPrompt(input);

  const result = streamText({
    model: aiModel,
    prompt,
    ...generationConfig,
    async onFinish({ text, finishReason, usage }) {
      console.log(
        `[appeals.onFinish] reason=${finishReason} text.length=${text.length} tokens=${usage?.totalTokens ?? "?"}`
      );
      if (!user) {
        console.warn(`[appeals.onFinish] no user — skipping save`);
        return;
      }
      if (!text.trim()) {
        console.warn(
          `[appeals.onFinish] empty output (reason=${finishReason}) — skipping save`
        );
        return;
      }
      const generation = await insertGeneration({
        userId: user.id,
        tool: "appeals",
        input: input as unknown as Record<string, unknown>,
        output: text,
      });
      await recordUsageEvent({
        userId: user.id,
        tool: "appeals",
        generationId: generation?.id,
      });
      console.log(
        `[appeals.onFinish] saved generation id=${generation?.id ?? "(null)"}`
      );
    },
    onError({ error }) {
      console.error(`[appeals.streamError]`, error);
    },
  });

  return result.toTextStreamResponse();
}
