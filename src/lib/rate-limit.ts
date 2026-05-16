/**
 * Lightweight token-bucket rate limiter.
 *
 * Default backend: in-memory Map (per-instance, resets on cold start).
 * This is enough to absorb accidental burst usage from a single user and
 * to keep the OpenAI bill bounded in a single-instance / hobby deploy.
 *
 * For production with multiple instances, point UPSTASH_REDIS_REST_URL +
 * UPSTASH_REDIS_REST_TOKEN at an Upstash Redis database: the bucket is
 * then stored centrally. Falls back to in-memory if Upstash is not set.
 */
import "server-only";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // epoch ms when the bucket fully refills
  retryAfterSec: number;
}

interface BucketState {
  tokens: number;
  updatedAt: number;
}

const memoryBuckets = new Map<string, BucketState>();

export interface RateLimitOptions {
  /** Max tokens (= max requests in a full window). */
  capacity: number;
  /** Refill window in milliseconds (e.g. 60_000 = 1 minute). */
  refillMs: number;
}

function takeFromMemory(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const refillPerMs = options.capacity / options.refillMs;
  const existing = memoryBuckets.get(key);
  let tokens = existing?.tokens ?? options.capacity;
  const updatedAt = existing?.updatedAt ?? now;
  tokens = Math.min(options.capacity, tokens + (now - updatedAt) * refillPerMs);

  const allowed = tokens >= 1;
  if (allowed) tokens -= 1;

  memoryBuckets.set(key, { tokens, updatedAt: now });

  const tokensMissing = options.capacity - tokens;
  const reset = now + Math.ceil(tokensMissing / refillPerMs);
  const retryAfterSec = allowed
    ? 0
    : Math.max(1, Math.ceil((1 - tokens) / refillPerMs / 1000));

  return {
    allowed,
    remaining: Math.max(0, Math.floor(tokens)),
    reset,
    retryAfterSec,
  };
}

async function takeFromUpstash(
  key: string,
  options: RateLimitOptions,
  upstashUrl: string,
  upstashToken: string
): Promise<RateLimitResult> {
  // Strategy: use Upstash's atomic INCR + EXPIRE. We bucket per
  // refillMs window. This is a simpler "fixed window" limiter than the
  // in-memory token bucket but it's safe across instances.
  const windowSec = Math.max(1, Math.floor(options.refillMs / 1000));
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);
  const redisKey = `ratelimit:${key}:${windowStart}`;

  try {
    const res = await fetch(`${upstashUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(windowSec)],
      ]),
    });

    if (!res.ok) throw new Error(`Upstash returned ${res.status}`);
    const body = (await res.json()) as Array<{ result: number | string }>;
    const count = Number(body[0]?.result ?? 0);

    const allowed = count <= options.capacity;
    const reset = (windowStart + windowSec) * 1000;
    const retryAfterSec = allowed ? 0 : Math.max(1, windowStart + windowSec - now);
    return {
      allowed,
      remaining: Math.max(0, options.capacity - count),
      reset,
      retryAfterSec,
    };
  } catch (err) {
    console.error("[rate-limit.upstash] falling back to memory:", err);
    return takeFromMemory(key, options);
  }
}

export async function rateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return takeFromUpstash(key, options, upstashUrl, upstashToken);
  }
  return takeFromMemory(key, options);
}
