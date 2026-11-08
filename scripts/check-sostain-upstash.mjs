import { randomUUID } from "node:crypto";

const endpoint = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
const key = "sostain:research:integration-check:" + randomUUID();
let created = false;

async function redis(commands) {
  const response = await fetch((endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint) + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Redis REST request failed (" + response.status + ").");
  }
  const values = await response.json();
  if (!Array.isArray(values) || values.length !== commands.length || values.some(item => item.error)) {
    throw new Error("Redis REST returned an invalid response or command error.");
  }
  return values.map(item => item.result);
}

try {
  if (!endpoint || !token || !/^https:\/\//.test(endpoint)) {
    throw new Error("Missing or invalid SOSTAIN_UPSTASH_REDIS_REST_URL / TOKEN.");
  }
  // Use a unique disposable key; do not read or mutate any application rate limit key.
  // First call follows the exact INCR + EXPIRE NX shape used in the API.
  const first = await redis([["INCR", key], ["EXPIRE", key, 600, "NX"], ["TTL", key]]);
  created = true;
  if (first[0] !== 1 || first[1] !== 1 || typeof first[2] !== "number" || first[2] < 1) {
    throw new Error("Counter, EXPIRE NX or TTL verification failed.");
  }
  for (let i = 2; i <= 7; i++) {
    const [counter, expiry] = await redis([["INCR", key], ["EXPIRE", key, 600, "NX"]]);
    if (counter !== i || expiry !== 0) {
      throw new Error("Rate limit counter/window verification failed at request " + i + ".");
    }
  }
  console.log("Sostain Upstash Redis connection: OK");
  console.log("Counter increments: OK (1 through 7)");
  console.log("EXPIRE NX and 10-minute TTL: OK");
  console.log("API policy simulation: first 6 allowed; 7th would be blocked");
  console.log("Credentials not printed. Temporary test key will be deleted.");
} catch (error) {
  console.error("Redis integration check failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  if (created) {
    try {
      const [deleted] = await redis([["DEL", key]]);
      if (deleted !== 1) {
        console.error("Temporary Redis test key was not deleted. It expires automatically within 10 minutes.");
        process.exitCode = 1;
      } else {
        console.log("Temporary Redis test key: deleted");
      }
    } catch {
      console.error("Could not confirm temporary test-key deletion; its TTL is 10 minutes.");
      process.exitCode = 1;
    }
  }
}
