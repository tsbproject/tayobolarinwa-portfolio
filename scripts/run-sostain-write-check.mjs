/**
 * Executes the local-only Sostain write integration check.
 * Run: node --env-file=.env.local scripts/run-sostain-write-check.mjs
 * Does not print credentials or the test key.
 */
const key=process.env.SOSTAIN_RESEARCH_TEST_RUN_KEY;
if (!key || key.length < 32) {
  console.error("Missing SOSTAIN_RESEARCH_TEST_RUN_KEY (must be at least 32 characters).");
  process.exitCode=1;
} else {
  try {
    const response=await fetch("http://localhost:3000/api/research/sostain/write-check",{
      method:"POST",
      headers:{
        "Origin":"http://localhost:3000",
        "x-sostain-test-key":key,
        "Content-Type":"application/json",
      },
      body:"{}",
      signal:AbortSignal.timeout(30000),
      cache:"no-store",
    });
    const data=await response.json();
    console.log("HTTP",response.status);
    console.log(typeof data.message==="string" ? data.message : "Unexpected test response.");
    if(!response.ok) process.exitCode=1;
  } catch {
    console.error("Could not run local database-write test. Ensure npm run dev is running and the test branch is configured.");
    process.exitCode=1;
  }
}
