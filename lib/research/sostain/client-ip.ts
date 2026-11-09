import { isIP } from "node:net";

/**
 * Parse only the Vercel-injected client-IP header. This is meaningful solely
 * when the request arrives through Vercel's trusted edge configuration.
 * Never fall back to a caller-provided generic header.
 *
 * A forwarded chain can contain multiple addresses; the first represents
 * the external client when the edge is configured as documented.
 */
export function getVercelClientIp(value: string | null): string | null {
  if (!value || value.length > 512) return null;
  const parts = value.split(",");
  if (parts.length > 16) return null;
  const first = parts[0]?.trim();
  if (!first || first.length > 64 || isIP(first) === 0) return null;
  return first.toLowerCase();
}
