import { NextResponse } from "next/server";

import { checkQuota } from "@/lib/billing/quota";
import { rateLimit } from "@/lib/rate-limit";
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

/**
 * Apply per-user rate limit (default: 10 requests / minute) and monthly
 * quota check. Returns null when the user can proceed, or a Response to
 * send back to the client otherwise.
 */
export async function enforceQuotaAndRateLimit(
  userId: string
): Promise<NextResponse | null> {
  const rl = await rateLimit(`ai:${userId}`, {
    capacity: 10,
    refillMs: 60_000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "You're sending requests too quickly. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSec),
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.reset),
        },
      }
    );
  }

  const quota = await checkQuota(userId);
  if (!quota.ok) {
    return NextResponse.json(
      {
        error: quota.reason,
        snapshot: quota.snapshot,
      },
      { status: 402 }
    );
  }

  return null;
}
