import "server-only";
import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { allowResearchAdmin, researchUnauthorizedResponse } from "./admin-auth";

type AuthOutcome = { allowed: true } | { allowed: false; response: Response };
const protectedResponse = (status: number, message: string, retryAfter?: string) =>
  new Response(message, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...(retryAfter ? {"Retry-After": retryAfter} : {}),
    },
  });

/**
 * Distributed pre-authentication throttle, shared by all research admin APIs.
 * The username is HMAC-hashed before it enters Redis; raw credentials are never stored.
 *
 * Per-account bucket protects the known username. A coarse global bucket
 * also limits rotating/guessed usernames without relying on unverified IP headers.
 *
 * An authorised request is counted too, to avoid an authentication oracle and
 * retain a single atomic Redis operation. These limits are intentionally far
 * above normal researcher usage: 80 total and 30/account in ten minutes.
 */
export async function authorizeResearchAdmin(request: NextRequest): Promise<AuthOutcome> {
  const authorization = request.headers.get("authorization");
  // Preserve the existing anonymous 401 contract and avoid contacting Redis
  // when no credential was provided.
  if (!authorization) return {allowed:false,response:researchUnauthorizedResponse()};
  if (authorization.length > 4096 || !authorization.startsWith("Basic ")) {
    return {allowed:false,response:researchUnauthorizedResponse()};
  }

  let username: string;
  try {
    const encoded = authorization.slice(6);
    if (!encoded || encoded.length > 2048 || !/^[a-zA-Z0-9+/]+={0,2}$/.test(encoded)) {
      return {allowed:false,response:researchUnauthorizedResponse()};
    }
    const decoded = Buffer.from(encoded,"base64").toString("utf8");
    const colon = decoded.indexOf(":");
    if (colon < 1 || colon > 256) return {allowed:false,response:researchUnauthorizedResponse()};
    username = decoded.slice(0,colon);
  } catch {
    return {allowed:false,response:researchUnauthorizedResponse()};
  }

  const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
  const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
  const pepper = process.env.SOSTAIN_RATE_LIMIT_KEY;
  if (!endpoint || !token || !pepper || pepper.length < 32) {
    return {allowed:false,response:protectedResponse(503,"Research admin security is unavailable.")};
  }

  const hash = createHmac("sha256",pepper).update(username).digest("hex");
  const accountKey = "sostain:research:admin:account:" + hash;
  const globalKey = "sostain:research:admin:global";
  const ttl = 600;

  try {
    const response = await fetch(endpoint.replace(/\/$/,"") + "/pipeline",{
      method:"POST",
      headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
      body:JSON.stringify([
        ["INCR",globalKey],["EXPIRE",globalKey,ttl,"NX"],
        ["INCR",accountKey],["EXPIRE",accountKey,ttl,"NX"],
      ]),
      cache:"no-store",
      signal:AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Rate-limit service rejected request");
    const result: Array<{result?:number;error?:string}> = await response.json();
    if (!Array.isArray(result) || result.length!==4 ||
        result.some(r=>r.error || typeof r.result!=="number")) {
      throw new Error("Invalid rate-limit result");
    }
    if ((result[0].result ?? 0) > 80 || (result[2].result ?? 0) > 30) {
      return {allowed:false,response:protectedResponse(429,"Too many research admin attempts. Please try later.","600")};
    }
  } catch {
    // Never bypass admin throttling when Redis is unavailable.
    return {allowed:false,response:protectedResponse(503,"Research admin security is temporarily unavailable.")};
  }

  return allowResearchAdmin(authorization)
    ? {allowed:true}
    : {allowed:false,response:researchUnauthorizedResponse()};
}
