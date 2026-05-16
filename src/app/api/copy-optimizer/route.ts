import { streamText } from "ai";

import { aiModel, generationConfig } from "@/lib/openai";
import {
  badRequest,
  ensureOpenAIConfigured,
  requireUser,
} from "@/lib/api-helpers";
import { insertGeneration } from "@/lib/db/generations";
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
    async onFinish({ text }) {
      if (!user || !text.trim()) return;
      await insertGeneration({
        userId: user.id,
        tool: "copy-optimizer",
        input: input as unknown as Record<string, unknown>,
        output: text,
      });
    },
  });

  return result.toTextStreamResponse();
}
