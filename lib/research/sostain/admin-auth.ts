import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Simple isolated administrative gate for the early research pilot.
 * Does not confer access to the wider portfolio. Use only with HTTPS in prod.
 * Future upgrade: SSO/MFA with researcher roles and audit logging.
 */
export function allowResearchAdmin(authorization: string | null): boolean {
  const expectedUser = process.env.SOSTAIN_RESEARCH_ADMIN_USERNAME;
  const expectedPassword = process.env.SOSTAIN_RESEARCH_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || expectedPassword.length < 24) return false;
  if (!authorization?.startsWith("Basic ")) return false;
  try {
    const raw = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separator = raw.indexOf(":");
    if (separator < 0) return false;
    const user = raw.slice(0, separator);
    const password = raw.slice(separator + 1);
    const digest = (text: string) => createHash("sha256").update(text, "utf8").digest();
    const a = digest(user), b = digest(expectedUser);
    const c = digest(password), d = digest(expectedPassword);
    return timingSafeEqual(a,b) && timingSafeEqual(c,d);
  } catch {
    return false;
  }
}

export function researchUnauthorizedResponse(): Response {
  return new Response("Research admin authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Sostain Research", charset="UTF-8"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
