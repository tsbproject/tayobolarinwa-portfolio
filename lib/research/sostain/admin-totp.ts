import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** RFC 6238 TOTP (SHA-1, six digits, 30-second steps).
 * Enrol a secret with a reputable authenticator out of band.
 * Never generate or expose an otpauth URL from a public endpoint.
 */
function decodeBase32(value: string): Buffer | null {
  const clean = value.toUpperCase().replace(/\s|-/g, "").replace(/=+$/, "");
  if (!/^[A-Z2-7]{32,}$/.test(clean)) return null;
  let bits = 0, acc = 0;
  const out: number[] = [];
  for (const char of clean) {
    const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(char);
    if (n < 0) return null;
    acc = (acc << 5) | n;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((acc >>> bits) & 255);
    }
  }
  return out.length >= 20 ? Buffer.from(out) : null;
}

export function isValidResearchTotpSecret(value: string | undefined): boolean {
  return Boolean(value && decodeBase32(value));
}

function codeAtStep(key: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = createHmac("sha1", key).update(counter).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return String(value).padStart(6, "0");
}

export function verifyResearchTotp(
  candidate: string,
  secret: string,
  nowMs: number = Date.now(),
): number | null {
  if (!/^\d{6}$/.test(candidate)) return null;
  const key = decodeBase32(secret);
  if (!key) return null;
  const current = Math.floor(nowMs / 30_000);
  for (const step of [current - 1, current, current + 1]) {
    if (step < 0) continue;
    const expected = Buffer.from(codeAtStep(key, step), "utf8");
    const actual = Buffer.from(candidate, "utf8");
    if (timingSafeEqual(expected, actual)) return step;
  }
  return null;
}
