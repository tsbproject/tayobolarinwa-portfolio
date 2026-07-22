import { NextRequest, NextResponse } from "next/server";

export interface ApiPipelineResult<T = unknown> {
  success: boolean;
  data?: T;
  response?: NextResponse;
}

export interface ApiPipelineOptions<T> {
  request: NextRequest;
  schema: {
    safeParse(data: unknown):
      | {
          success: true;
          data: T;
        }
      | {
          success: false;
          error: unknown;
        };
  };

  requireOrigin?: boolean;
  requireHoneypot?: boolean;
  requireRateLimit?: boolean;
  requireTurnstile?: boolean;
}