import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { isValidResearchTotpSecret } from "./admin-totp";

export const RESEARCH_SESSION_COOKIE = "sostain_research_admin";
const SESSION_SECONDS = 1800;

export function researchSessionModeEnabled(): boolean {
  return process.env.SOSTAIN_ADMIN_SESSION_ENABLED === "true";
}

function configured(): boolean {
  return Boolean(
    process.env.SOSTAIN_UPSTASH_REDIS_REST_URL &&
    process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN &&
    process.env.SOSTAIN_RATE_LIMIT_KEY &&
    process.env.SOSTAIN_RATE_LIMIT_KEY!.length >= 32 &&
    isValidResearchTotpSecret(process.env.SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET) &&
    process.env.SOSTAIN_RESEARCH_ADMIN_USERNAME &&
    process.env.SOSTAIN_RESEARCH_ADMIN_PASSWORD &&
    process.env.SOSTAIN_RESEARCH_ADMIN_PASSWORD!.length >= 24
  );
}

export function ensureResearchSessionConfigured(): void {
  if (!configured()) throw new Error("Research admin session security configuration is incomplete.");
}

async function redis(commands: (string | number)[][]): Promise<(number | string | null)[]> {
  ensureResearchSessionConfigured();
  const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL!;
  const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN!;
  const response = await fetch(endpoint.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: {Authorization: "Bearer " + token, "Content-Type": "application/json"},
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Research admin session storage unavailable.");
  const data: Array<{result?: number | string | null; error?: string}> = await response.json();
  if (!Array.isArray(data) || data.length !== commands.length ||
      data.some(item => item.error || !("result" in item))) {
    throw new Error("Invalid research admin session storage reply.");
  }
  return data.map(item => item.result ?? null);
}

function sessionKey(token: string): string {
  return "sostain:research:session:" + createHash("sha256").update(token).digest("hex");
}
function tokenFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(RESEARCH_SESSION_COOKIE)?.value ?? "";
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export async function createResearchSession(totpStep: number): Promise<string | null> {
  ensureResearchSessionConfigured();
  const key = createHmac("sha256", process.env.SOSTAIN_RATE_LIMIT_KEY!)
    .update("totp-replay:" + totpStep).digest("hex");
  // Prevent reuse of the same accepted TOTP timestep. Redis SET NX EX is atomic.
  const [reserved] = await redis([["SET", "sostain:research:mfa:used:" + key, "1", "EX", 120, "NX"]]);
  if (reserved !== "OK") return null;

  const token = randomBytes(32).toString("hex");
  const [created] = await redis([["SET", sessionKey(token), "1", "EX", SESSION_SECONDS, "NX"]]);
  if (created !== "OK") throw new Error("Unable to establish research admin session.");
  return token;
}

export async function validResearchSession(request: NextRequest): Promise<boolean> {
  if (!researchSessionModeEnabled()) return false;
  const token = tokenFromRequest(request);
  if (!token) return false;
  const [value] = await redis([["GET", sessionKey(token)]]);
  return value === "1";
}

export async function revokeResearchSession(request: NextRequest): Promise<void> {
  const token = tokenFromRequest(request);
  if (token) await redis([["DEL", sessionKey(token)]]);
}

export function researchSessionCookie(token: string, request: NextRequest) {
  // Secure in production; local HTTP is supported only for localhost development.
  const secure = process.env.NODE_ENV === "production";
  return {
    name: RESEARCH_SESSION_COOKIE,
    value: token,
    httpOnly: true as const,
    secure,
    sameSite: "strict" as const,
    path: "/api/research/sostain/admin",
    maxAge: SESSION_SECONDS,
  };
}

export function clearResearchSessionCookie() {
  return {
    name: RESEARCH_SESSION_COOKIE,
    value: "",
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api/research/sostain/admin",
    maxAge: 0,
  };
}

export function researchAdminOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return origin === "https://tayobolarinwa.dev" ||
    origin === "https://www.tayobolarinwa.dev" ||
    (process.env.NODE_ENV === "development" && origin === "http://localhost:3000");
}
