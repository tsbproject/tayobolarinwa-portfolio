/**
 * Sostain public survey abuse protection.
 *
 * Uses the Upstash Redis REST API for a durable cross-instance fixed-window
 * rate limit. No in-memory fallback is allowed in production.
 */
type GateResult = { ok: true } | { ok: false; status: number; message: string };
const fail = (status: number, message: string): GateResult => ({ok:false,status,message});

export async function verifyTurnstile(token: string, ip?: string): Promise<GateResult> {
  const secret = process.env.SOSTAIN_TURNSTILE_SECRET_KEY;
  if (!secret) return fail(503, "Research security is not configured.");
  if (!token || token.length > 4096) return fail(400, "Complete the security challenge.");
  try {
    const body = new URLSearchParams({secret,response:token});
    if (ip) body.set("remoteip",ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body,signal:AbortSignal.timeout(5000),cache:"no-store",
    });
    if (!response.ok) return fail(503,"Security verification is unavailable.");
    const result: {success?:boolean;hostname?:string;action?:string} = await response.json();
    const allowedHosts = new Set(["tayobolarinwa.dev","www.tayobolarinwa.dev", ...(process.env.NODE_ENV==="development" ? ["localhost"] : [])]);
    if (result.success !== true || !result.hostname || !allowedHosts.has(result.hostname)) {
      return fail(403,"Security verification failed.");
    }
    if (result.action !== "sostain-survey") return fail(403,"Security verification failed.");
    return {ok:true};
  } catch {
    return fail(503,"Security verification is unavailable.");
  }
}

/**
 * Redis INCR first request in a window; EXPIRE as a recovery TTL.
 * This is intentionally conservative: failed Redis or missing credentials
 * deny submissions rather than silently allowing unlimited traffic.
 */
export async function checkRateLimit(subject: string): Promise<GateResult> {
  const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
  const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
  if (!endpoint || !token) return fail(503,"Research security is not configured.");
  const key = "sostain:research:limit:" + subject;
  const windowSeconds = 600;
  try {
    const result = await fetch(endpoint.replace(/\\/$/,"") + "/pipeline", {
      method:"POST",
      headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
      body:JSON.stringify([["INCR",key],["EXPIRE",key,windowSeconds,"NX"]]),
      signal:AbortSignal.timeout(5000),cache:"no-store",
    });
    if (!result.ok) return fail(503,"Research security is temporarily unavailable.");
    const replies: Array<{result?:number;error?:string}> = await result.json();
    if (!Array.isArray(replies) || replies.length!==2 || replies.some(x=>x.error) || typeof replies[0]?.result!=="number" || typeof replies[1]?.result!=="number") {
      return fail(503,"Research security is temporarily unavailable.");
    }
    return replies[0].result > 6 ? fail(429,"Too many submissions. Please try later.") : {ok:true};
  } catch {
    return fail(503,"Research security is temporarily unavailable.");
  }
}
