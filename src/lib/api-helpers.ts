import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "You must be signed in to use this tool." },
        { status: 401 }
      ),
    } as const;
  }

  return { user, response: null } as const;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function ensureOpenAIConfigured() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OpenAI is not configured. Please set OPENAI_API_KEY in your environment.",
      },
      { status: 500 }
    );
  }
  return null;
}
