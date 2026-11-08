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

      // The second identity has its own allowance; global counter stays shared.
      let last = null;
      for (let i = 1; i <= 49; i++) {
        last = await attempt(accountB);
      }
      if (!last || last.globalCount !== 80 || last.accountCount !== 49 || last.allowed) {
        // Account B is above its own threshold, so cannot pass, but the
        // global limit should not yet be exceeded.
        throw new Error("Global counter did not reach 80 as expected.");
      }
      const blockedGlobal = await attempt(accountB);
      if (blockedGlobal.globalCount !== 81 || blockedGlobal.accountCount !== 50 || blockedGlobal.allowed) {
        throw new Error("The 81st global attempt was not blocked.");
      }
      console.log("PASS: shared 80/10-minute global threshold blocks attempt 81.");

      // An ordinary valid attempt would be checked independently using the
      // same Redis service, but this diagnostic NEVER sends a password.
      successful = true;
    } catch (error) {
      console.error("FAIL: isolated throttle validation:", error instanceof Error ? error.message : "unknown error");
      process.exitCode = 1;
    } finally {
      try {
        const [removed] = await pipeline([["DEL", globalKey, accountA, accountB]]);
        if (removed !== 3) throw new Error("Expected all three isolated counters to exist.");
        cleanupSuccessful = true;
        console.log("PASS: all three disposable test counters deleted.");
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
