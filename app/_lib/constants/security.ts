/**
 * Public API Security Configuration
 * Shared across all public API routes.
 */

export const SECURITY = {
  /**
   * Allowed Origins
   */
  ALLOWED_ORIGINS: [
    "http://localhost:3000",
    "https://tayobolarinwa.dev",
    "https://www.tayobolarinwa.dev",
  ],

  /**
   * Honeypot Field
   */
  HONEYPOT_FIELD: "website",

  /**
   * Message Length
   */
  MIN_MESSAGE_LENGTH: 30,

  MAX_MESSAGE_LENGTH: 5000,

  /**
   * Rate Limiting
   */
  RATE_LIMIT_WINDOW: 60 * 1000,

  RATE_LIMIT_REQUESTS: 5,
} as const;