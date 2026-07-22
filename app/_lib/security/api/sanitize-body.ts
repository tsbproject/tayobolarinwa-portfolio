import { sanitizeText } from "./sanitize";

export function sanitizeBody(
  body: Record<string, unknown>
) {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}