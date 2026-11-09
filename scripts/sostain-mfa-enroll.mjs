#!/usr/bin/env node
/**
 * LOCAL-ONLY, one-time research admin MFA QR enrollment.
 *
 * Requires an ephemeral local dependency (not imported by Next.js):
 *   npm install --no-save --package-lock=false qrcode
 *   node scripts/sostain-mfa-enroll.mjs
 *
 * The secret is generated locally and written to .env.local; no secret is
 * printed, uploaded, committed, sent to a QR service or placed in /public.
 * The QR PNG is created under the OS temporary directory. Delete it after
 * scanning and validating the authenticator.
 */
import { randomBytes } from "node:crypto";
import { readFile, writeFile, mkdtemp, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32(buffer) {
  let accumulator = 0;
  let bits = 0;
  let output = "";
  for (const byte of buffer) {
    accumulator = (accumulator << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += alphabet[(accumulator >>> bits) & 31];
    }
  }
  if (bits > 0) output += alphabet[(accumulator << (5 - bits)) & 31];
  return output;
}

function settingExists(env, name) {
  return new RegExp("^[ \\t]*(?:export[ \\t]+)?" + name + "[ \\t]*=", "m").test(env);
}

function settingValue(env, name) {
  const match = env.match(new RegExp("^[ \\t]*(?:export[ \\t]+)?" + name + "[ \\t]*=[ \\t]*(.*)$", "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, "");
}

async function main() {
  const pkg = JSON.parse(await readFile(resolve("package.json"), "utf8"));
  if (pkg.name !== "tayobolarinwa-portfolio") {
    throw new Error("Run from the tayobolarinwa-portfolio repository root.");
  }

  const env = await readFile(envPath, "utf8").catch(() => {
    throw new Error(".env.local is missing. Refusing to create an untracked secret file.");
  });
  if (settingValue(env, "SOSTAIN_ADMIN_SESSION_ENABLED") === "true") {
    throw new Error("Disable SOSTAIN_ADMIN_SESSION_ENABLED before enrollment.");
  }
  for (const name of ["SOSTAIN_SURVEY_BACKEND_READY", "NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN"]) {
    if (settingValue(env, name) !== "false") {
      throw new Error(name + " must be explicitly false. Survey launch flags were not changed.");
    }
  }
  if (settingExists(env, "SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET")) {
    throw new Error("MFA secret already configured in .env.local. Refusing to replace it.");
  }

  let QRCode;
  try {
    QRCode = (await import("qrcode")).default;
  } catch {
    throw new Error('Local QR renderer missing. Run: npm install --no-save --package-lock=false qrcode');
  }

  const secret = base32(randomBytes(32));
  const issuer = "Sostain Research";
  const account = "Research Admin (Local)";
  const uri = "otpauth://totp/" + encodeURIComponent(issuer + ":" + account) +
    "?secret=" + encodeURIComponent(secret) +
    "&issuer=" + encodeURIComponent(issuer) +
    "&algorithm=SHA1&digits=6&period=30";

  const dir = await mkdtemp(join(tmpdir(), "sostain-mfa-"));
  const qrPath = join(dir, "enrollment.png");
  // An offline QR encoder; no web/third-party QR rendering endpoint involved.
  await QRCode.toFile(qrPath, uri, {
    type: "png", errorCorrectionLevel: "M", margin: 3, width: 440,
  });
  await chmod(qrPath, 0o600);

  // Make one narrowly scoped env edit; keep the existing file intact otherwise.
  // Do not enable MFA. Review / enroll / confirm before changing the switch.
  const newline = env.includes("\r\n") ? "\r\n" : "\n";
  const next = env + (env.endsWith("\n") ? "" : newline) +
    "SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET=\"" + secret + "\"" + newline;
  await writeFile(envPath, next, { encoding: "utf8", mode: 0o600 });

  console.log("PASS: New MFA secret saved privately to .env.local.");
  console.log("PASS: QR image generated entirely locally.");
  console.log("QR image: " + qrPath);
  console.log("Next: open the PNG on this computer, scan it using an authenticator app,");
  console.log("and delete the PNG (and its empty temporary folder) after enrollment.");
  console.log("MFA is NOT enabled. SOSTAIN_ADMIN_SESSION_ENABLED remains false/unset.");
  console.log("Never share the QR image, secret, or any otpauth:// URL.");
}

main().catch((error) => {
  console.error("MFA enrollment was not completed:", error instanceof Error ? error.message : "unknown error");
  process.exitCode = 1;
});
