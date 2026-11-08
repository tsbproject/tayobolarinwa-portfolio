import { neon } from "@neondatabase/serverless";

const url = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
if (!url) {
  console.error("Missing SOSTAIN_RESEARCH_DATABASE_URL in your local environment.");
  process.exitCode = 1;
} else {
  try {
    const sql = neon(url);
    const [status] = await sql`
      SELECT
        to_regclass('public.research_responses') IS NOT NULL AS responses_table,
        to_regclass('public.research_consents') IS NOT NULL AS consents_table,
        to_regclass('public.research_contacts') IS NOT NULL AS contacts_table,
        to_regclass('public.research_surveys') IS NOT NULL AS surveys_table
    `;
    if (!Object.values(status).every(value => value === true)) {
      console.error("Connection works but one or more research tables are missing. Run the reviewed schema SQL in Neon Console.");
      process.exitCode = 1;
    } else {
      const [survey] = await sql`SELECT status FROM research_surveys WHERE version = '1.1-short'`;
      console.log("Sostain research database connection: OK");
      console.log("Research tables: OK");
      console.log("Survey status:", survey?.status ?? "missing");
      console.log("No survey answers or credentials were read or printed.");
      if (!survey) process.exitCode = 1;
    }
  } catch (error) {
    // Do not expose connection strings or raw driver errors in logs.
    console.error("Database check failed. Verify the dedicated Neon URL, SQL schema, network access and DB role permissions.");
    if (process.env.NODE_ENV === "development") {
      console.error("Error type:", error instanceof Error ? error.name : "UnknownError");
    }
    process.exitCode = 1;
  }
}
