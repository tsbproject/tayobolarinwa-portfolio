/**
 * Phase 11C security diagnostics.
 * Safe with the public survey CLOSED and MFA enabled LOCALLY.
 * No passwords, TOTP codes, session cookies, or real admin Redis keys used.
 *
 * Run: node --env-file=.env.local scripts/check-sostain-admin-sessions.mjs
 */
import { randomBytes, randomUUID } from "node:crypto";

const base = "http://localhost:3000";
const results = [];
function pass(message) { console.log("PASS: " + message); results.push(true); }
function fail(message) { console.error("FAIL: " + message); results.push(false); }
function assert(condition, message) { if (!condition) throw new Error(message); }

async function main() {
  assert(process.env.NODE_ENV !== "production", "Never run in production mode.");
  assert(process.env.SOSTAIN_SURVEY_BACKEND_READY === "false", "Backend survey flag must be explicitly false.");
  assert(process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN === "false", "Public survey flag must be explicitly false.");
  assert(process.env.SOSTAIN_ADMIN_SESSION_ENABLED === "true", "Local MFA session mode must be enabled.");
  const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
  const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
  assert(endpoint && token, "Local Upstash connection is missing.");
  const id = randomUUID();
  const prefix = "sostain:research:session:diagnostic:" + id + ":";
  const replay = prefix + "replay";
  const active = prefix + "active";
  const expired = prefix + "expired";
  const revoked = prefix + "revoked";
  const keys = [replay, active, expired, revoked];
  let keysTouched = false;
  let cleanupOk = false;

  async function pipeline(commands, target = endpoint) {
    const response = await fetch(target.replace(/\/$/, "") + "/pipeline", {
      method: "POST",
      headers: {"Authorization":"Bearer " + token, "Content-Type":"application/json"},
      body: JSON.stringify(commands), cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Redis returned HTTP " + response.status);
    const replies = await response.json();
    assert(Array.isArray(replies) && replies.length === commands.length, "Invalid Upstash response.");
    assert(replies.every(item => item && !item.error && Object.hasOwn(item, "result")), "Upstash operation failed.");
    return replies.map(item => item.result);
  }

  try {
    keysTouched = true;
    const [first] = await pipeline([["SET", replay, "1", "EX", 120, "NX"]]);
    const [second] = await pipeline([["SET", replay, "1", "EX", 120, "NX"]]);
    assert(first === "OK" && second === null, "Atomic NX replay reservation must reject duplicate.");
    pass("Atomic TOTP timestep reservation denies replay (isolated Redis key).");

    const [created] = await pipeline([["SET", active, "1", "EX", 1800, "NX"]]);
    const [value, ttl] = await pipeline([["GET", active], ["TTL", active]]);
    assert(created === "OK" && value === "1" && ttl > 0 && ttl <= 1800, "Session creation/TTL mismatch.");
    pass("Thirty-minute session creation and bounded TTL work.");

    // Use a 2-second TTL to test the real Redis expiry operation quickly;
    // actual application session lifetime remains 1800 seconds.
    const [shortCreated] = await pipeline([["SET", expired, "1", "EX", 2, "NX"]]);
    assert(shortCreated === "OK", "Could not create disposable short-lived session.");
    await new Promise(resolve => setTimeout(resolve, 2600));
    const [expiredValue] = await pipeline([["GET", expired]]);
    assert(expiredValue === null, "Redis failed to expire temporary session.");
    pass("Redis session expiration removes access after TTL (2-second diagnostic TTL).");

    const [revokeCreated] = await pipeline([["SET", revoked, "1", "EX", 1800, "NX"]]);
    const [deleted] = await pipeline([["DEL", revoked]]);
    const [revokedValue] = await pipeline([["GET", revoked]]);
    assert(revokeCreated === "OK" && deleted === 1 && revokedValue === null, "Session revocation failed.");
    pass("Revocation deletes the session immediately.");

    // Confirm storage errors are observable rather than interpreted as a valid session.
    let storageRejected = false;
    try {
      await pipeline([["GET", active]], "http://127.0.0.1:1");
    } catch {
      storageRejected = true;
    }
    assert(storageRejected, "Simulated storage outage unexpectedly succeeded.");
    pass("Simulated Redis outage rejects the diagnostic storage operation (not an HTTP route test).");

    async function checkHttp(label, path, options, expected) {
      const response = await fetch(base + path, {
        ...options, redirect:"manual", cache:"no-store", signal:AbortSignal.timeout(10000),
      });
      const cacheSafe = /no-store/.test(response.headers.get("cache-control") || "");
      assert(response.status === expected && cacheSafe,
        label + ": expected " + expected + " / no-store, got " + response.status + " / no-store=" + cacheSafe);
      pass(label + " (HTTP " + expected + ").");
    }
    // Only anonymous, forged, or malformed requests; no real credentials or cookies.
    await checkHttp(
      "Forged session cookie cannot access admin overview",
      "/api/research/sostain/admin/overview",
      {headers:{"Cookie":"sostain_research_admin=" + randomBytes(32).toString("hex")}}, 401
    );
    await checkHttp(
      "Missing admin session cannot export CSV",
      "/api/research/sostain/admin/export",
      {}, 401
    );
    await checkHttp(
      "Missing admin session cannot export Excel",
      "/api/research/sostain/admin/excel",
      {}, 401
    );
    await checkHttp(
      "Missing admin session cannot access governance report",
      "/api/research/sostain/admin/governance",
      {}, 401
    );
    await checkHttp(
      "Disallowed Origin prevents MFA login",
      "/api/research/sostain/admin/login",
      {method:"POST",headers:{"Origin":"https://invalid.example","Content-Type":"application/json"},body:"{}"},403
    );
    await checkHttp(
      "Disallowed Origin prevents logout",
      "/api/research/sostain/admin/logout",
      {method:"POST",headers:{"Origin":"https://invalid.example"}},403
    );
  } finally {
    if (keysTouched) {
      try {
        // DEL is idempotent: some test keys may already have expired or been
        // revoked, so the deletion count can validly be 0..4.
        await pipeline([["DEL", ...keys]]);
        const remaining = await pipeline(keys.map(key => ["EXISTS", key]));
        assert(remaining.every(count => count === 0),
          "One or more disposable diagnostic keys remain after cleanup.");
        cleanupOk = true;
        pass("All disposable Redis diagnostic keys verified absent after cleanup.");
      } catch (error) {
        fail("Cannot confirm diagnostic key cleanup; investigate only diagnostic-prefixed keys before retrying.");
        console.error(error instanceof Error ? error.message : "Cleanup error");
      }
    }
  }
  assert(cleanupOk, "Disposable Redis cleanup was not verified.");
}

main().catch(error => {
  fail(error instanceof Error ? error.message : "Unknown diagnostic error");
}).finally(() => {
  const success = results.filter(Boolean).length;
  console.log("Result: " + success + "/" + results.length + " checks passed.");
  if (results.some(result => !result)) process.exitCode = 1;
});
