import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiModel = openai("gpt-4o-mini");

export const generationConfig = {
  temperature: 0.8,
  maxTokens: 1200,
} as const;
