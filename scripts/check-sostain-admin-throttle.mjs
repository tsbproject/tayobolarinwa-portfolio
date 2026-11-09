/**
 * Phase 11: Real Upstash rate-limit policy check with disposable Redis keys.
 *
 * Usage:
 *   node --env-file=.env.local scripts/check-sostain-admin-throttle.mjs
 *
 * This test never calls admin endpoints, sends credentials, touches production
 * admin counter keys, changes survey release flags, or writes to Neon.
 * It uses two isolated random keys and deletes them in a finally block.
 */
import { randomUUID } from "node:crypto";

const requireClosed = [
  "SOSTAIN_SURVEY_BACKEND_READY",
  "NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN",
];

function halt(message) {
  console.error("FAIL: " + message);
  process.exitCode = 1;
}

if (process.env.NODE_ENV === "production") {
  halt("Run only in local development, never in production mode.");
} else if (requireClosed.some((name) => process.env[name] !== "false")) {
  halt("Both survey release flags must be explicitly false.");
} else {
  const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
  const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
  if (!endpoint || !token) {
    halt("Local Upstash REST configuration is missing.");
  } else {
    const runId = randomUUID();
    // Deliberately different prefix from the real admin keys:
    // sostain:research:admin:{global,account:<HMAC>}
    const keyPrefix = "sostain:research:admin:diagnostic:" + runId + ":";
    const globalKey = keyPrefix + "global";
    const accountA = keyPrefix + "account-a";
    const accountB = keyPrefix + "account-b";
    const accountC = keyPrefix + "account-c";
    const ttl = 600;

    async function pipeline(commands) {
      const response = await fetch(endpoint.replace(/\/$/, "") + "/pipeline", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Redis returned HTTP " + response.status);
      const replies = await response.json();
      if (!Array.isArray(replies) || replies.length !== commands.length ||
          replies.some((reply) => reply?.error || typeof reply?.result !== "number")) {
        throw new Error("Unexpected Redis pipeline response.");
      }
      return replies.map((reply) => reply.result);
    }

    let successful = false;
    let cleanupSuccessful = false;

    try {
      // Exactly the INCR / EXPIRE NX operation and order used by the admin gate.
      async function attempt(accountKey) {
        const [globalCount, , accountCount] = await pipeline([
          ["INCR", globalKey],
          ["EXPIRE", globalKey, ttl, "NX"],
          ["INCR", accountKey],
          ["EXPIRE", accountKey, ttl, "NX"],
        ]);
        return {
          globalCount,
          accountCount,
          allowed: globalCount <= 80 && accountCount <= 30,
        };
      }

      const initial = await attempt(accountA);
      if (initial.globalCount !== 1 || initial.accountCount !== 1 || !initial.allowed) {
        throw new Error("First attempt should be allowed with counters at 1.");
      }
      console.log("PASS: isolated Redis counters initialize and permit normal attempts.");

      let accountLimit = initial;
      for (let i = 2; i <= 30; i++) {
        accountLimit = await attempt(accountA);
      }
      if (accountLimit.accountCount !== 30 || accountLimit.globalCount !== 30 || !accountLimit.allowed) {
        throw new Error("The 30th per-account attempt should still be allowed.");
      }
      const blockedAccount = await attempt(accountA);
      if (blockedAccount.accountCount !== 31 || blockedAccount.globalCount !== 31 || blockedAccount.allowed) {
        throw new Error("The 31st per-account attempt was not blocked.");
      }
      console.log("PASS: the per-username 30/10-minute threshold blocks attempt 31.");

      // Use fresh identities to prove global limit independently from
      // any per-account limit. A already accounts for 31 global requests.
      let secondLast = null;
      for (let i = 1; i <= 30; i++) secondLast = await attempt(accountB);
      if (!secondLast || secondLast.globalCount !== 61 || secondLast.accountCount !== 30 || !secondLast.allowed) {
        throw new Error("Account B should be allowed on its 30th attempt.");
      }
      let globalAtThreshold = null;
      for (let i = 1; i <= 19; i++) globalAtThreshold = await attempt(accountC);
      if (!globalAtThreshold || globalAtThreshold.globalCount !== 80 ||
          globalAtThreshold.accountCount !== 19 || !globalAtThreshold.allowed) {
        throw new Error("The 80th global attempt should remain allowed.");
      }
      const blockedGlobal = await attempt(accountC);
      if (blockedGlobal.globalCount !== 81 || blockedGlobal.accountCount !== 20 || blockedGlobal.allowed) {
        throw new Error("The 81st global attempt was not blocked independently.");
      }
      console.log("PASS: the global 80/10-minute limit independently blocks attempt 81.");

      const [globalTtl, accountTtl] = await pipeline([["TTL", globalKey], ["TTL", accountC]]);
      if (globalTtl < 1 || globalTtl > ttl || accountTtl < 1 || accountTtl > ttl) {
        throw new Error("Throttle keys have missing or invalid expiry.");
      }
      console.log("PASS: disposable counter TTLs exist and are bounded to 10 minutes.");

      // An ordinary valid attempt would be checked independently using the
      // same Redis service, but this diagnostic NEVER sends a password.
      successful = true;
    } catch (error) {
      console.error("FAIL: isolated throttle validation:", error instanceof Error ? error.message : "unknown error");
      process.exitCode = 1;
    } finally {
      try {
        const [removed] = await pipeline([["DEL", globalKey, accountA, accountB, accountC]]);
        if (removed !== 4) throw new Error("Expected all four isolated counters to exist.");
        cleanupSuccessful = true;
        console.log("PASS: all four disposable test counters deleted.");
      } catch {
        halt("Could not confirm test-key cleanup. Inspect diagnostic-prefix Redis keys; do not retry until safe.");
      }
    }

    if (successful && cleanupSuccessful) {
      console.log("PASS: admin rate-limit thresholds verified using isolated Redis keys only.");
    } else {
      process.exitCode = 1;
    }
  }
}
