import { streamText } from "ai";

import { aiModel, generationConfig } from "@/lib/openai";
import {
  badRequest,
  ensureOpenAIConfigured,
  requireUser,
} from "@/lib/api-helpers";
import { buildOutreachPrompt, outreachInputSchema } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { response: authError } = await requireUser();
  if (authError) return authError;

  const configError = ensureOpenAIConfigured();
  if (configError) return configError;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Invalid JSON payload.");
  }

  const parsed = outreachInputSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(first?.message ?? "Invalid input.");
  }

  const prompt = buildOutreachPrompt(parsed.data);

  const result = streamText({
    model: aiModel,
    prompt,
    ...generationConfig,
  });

  return result.toTextStreamResponse();
}
