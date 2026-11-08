import "server-only";
import { neon } from "@neondatabase/serverless";
import { safeResearchCsv } from "./csv";

const allowedColumns = [
  "submitted_at", "business_category", "team_size", "main_channel",
  "tracking", "challenges", "challenge_frequency", "price",
] as const;

function database() {
  const url = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!url) throw new Error("Research DB unavailable");
  return neon(url);
}

export async function getResearchOverview() {
  const sql = database();
  const [totalRows, categories, recent] = await Promise.all([
    sql`SELECT COUNT(*)::integer AS total FROM research_responses WHERE survey_version = '1.1-short'`,
    sql`SELECT business_category AS category, COUNT(*)::integer AS total
         FROM research_responses WHERE survey_version = '1.1-short'
         GROUP BY business_category ORDER BY total DESC, category LIMIT 30`,
    sql`SELECT submitted_at, business_category, answers
         FROM research_responses WHERE survey_version = '1.1-short'
         ORDER BY submitted_at DESC, id DESC LIMIT 20`,
  ]);
  const mapped = recent.map(row => {
    const a = row.answers as Record<string, unknown>;
    return {
      submittedAt: new Date(String(row.submitted_at)).toISOString(),
      category: String(row.business_category),
      challengeSummary: Array.isArray(a.challenges) ? a.challenges.map(String).join("; ") : "",
      price: typeof a.price === "string" ? a.price : "",
    };
  });
  return {
    total: Number(totalRows[0]?.total ?? 0),
    categories: categories.map(row => ({ category: String(row.category), count: Number(row.total) })),
    recent: mapped,
  };
}

export async function exportResearchCsv(): Promise<string> {
  const sql = database();
  // Response count capped deliberately; never include contact/consent tables,
  // submission IDs, IPs or Turnstile tokens in exported CSV.
  const rows = await sql`
    SELECT submitted_at, business_category,
           answers->>'teamSize' AS team_size,
           answers->>'mainChannel' AS main_channel,
           answers->>'tracking' AS tracking,
           answers->'challenges' AS challenges,
           answers->>'challengeFrequency' AS challenge_frequency,
           answers->>'price' AS price
    FROM research_responses
    WHERE survey_version = '1.1-short'
    ORDER BY submitted_at DESC, id DESC
    LIMIT 10000
  `;
  return "\uFEFF" + safeResearchCsv(rows.map(row => ({
    submitted_at: new Date(String(row.submitted_at)).toISOString(),
    business_category: row.business_category,
    team_size: row.team_size,
    main_channel: row.main_channel,
    tracking: row.tracking,
    challenges: row.challenges,
    challenge_frequency: row.challenge_frequency,
    price: row.price,
  })), allowedColumns);
}
