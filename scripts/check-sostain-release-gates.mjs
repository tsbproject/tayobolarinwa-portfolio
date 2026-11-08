/**
 * Read-only security regression check for the local Sostain research portal.
 * Usage: node --env-file=.env.local scripts/check-sostain-release-gates.mjs
 *
 * It intentionally never sends valid survey answers or admin credentials.
 * No Neon records are created, and no Redis counters should be touched because
 * the public backend flag is checked before any external work.
 */
const base = process.env.SOSTAIN_SECURITY_CHECK_BASE_URL ?? "http://localhost:3000";
const flags = ["SOSTAIN_SURVEY_BACKEND_READY", "NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN"];
let failed = false;

if (process.env.NODE_ENV === "production") {
  console.error("FAIL: Do not run this local diagnostic in production mode.");
  process.exit(1);
}
if (base !== "http://localhost:3000") {
  console.error("FAIL: This diagnostic is limited to http://localhost:3000.");
  process.exit(1);
}
for (const flag of flags) {
  if (process.env[flag] !== "false") {
    console.error(`FAIL: ${flag} must be explicitly false for this diagnostic.`);
    failed = true;
  } else {
    console.log(`PASS: ${flag} is disabled.`);
  }
}
if (failed) process.exit(1);

const checks = [
  {
    label: "Public survey POST returns 503 while disabled",
    path: "/api/research/sostain/submit",
    options: {method:"POST",headers:{"Origin":base,"Content-Type":"application/json"},body:"{}"},
    expected:503,
  },
  {
    label: "Admin overview rejects unauthenticated access",
    path: "/api/research/sostain/admin/overview",
    options: {method:"GET"},
    expected:401,
  },
  {
    label: "CSV export rejects unauthenticated access",
    path: "/api/research/sostain/admin/export",
    options: {method:"GET"},
    expected:401,
  },
  {
    label: "Excel export rejects unauthenticated access",
    path: "/api/research/sostain/admin/excel",
    options: {method:"GET"},
    expected:401,
  },
  {
    label: "Admin rejects malformed Basic authentication",
    path: "/api/research/sostain/admin/overview",
    options: {method:"GET",headers:{"Authorization":"Basic malformed@header"}},
    expected:401,
  },
  {
    label: "Admin rejects oversized Basic authentication",
    path: "/api/research/sostain/admin/overview",
    options: {method:"GET",headers:{"Authorization":"Basic "+ "A".repeat(5000)}},
    expected:401,
  },
  {
    label: "Write test rejects unauthorised invocation",
    path: "/api/research/sostain/write-check",
    options: {method:"POST",headers:{"Origin":base,"Content-Type":"application/json"},body:"{}"},
    expected:403,
  },
];

for (const check of checks) {
  try {
    const response = await fetch(base + check.path, {
      ...check.options,
      cache:"no-store",
      signal: AbortSignal.timeout(10000),
    });
    const cacheHeader = response.headers.get("cache-control") ?? "";
    const cacheSafe = /no-store/i.test(cacheHeader);
    const ok = response.status === check.expected && cacheSafe;
    console.log(`${ok?"PASS":"FAIL"}: ${check.label} (HTTP ${response.status}, no-store: ${cacheSafe})`);
    if (!ok) failed = true;
  } catch {
    console.error(`FAIL: ${check.label}. Check that npm run dev is running on localhost:3000.`);
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
