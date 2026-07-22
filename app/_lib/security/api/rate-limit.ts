import { NextRequest } from "next/server";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export interface RateLimiter {
  check(
    request: NextRequest
  ): Promise<RateLimitResult>;
}

/**
 * Development implementation.
 *
 * Replace with Upstash Redis later
 * without changing API routes.
 */
export class LocalRateLimiter
  implements RateLimiter
{
  async check(): Promise<RateLimitResult> {
    return {
      success: true,
      remaining: Infinity,
    };
  }
}

export const rateLimiter =
  new LocalRateLimiter();