import assert from "node:assert/strict";
import test from "node:test";
import { getVercelClientIp } from "../lib/research/sostain/client-ip";

test("validates external IPv4 and IPv6 client IPs", () => {
  assert.equal(getVercelClientIp("203.0.113.7"), "203.0.113.7");
  assert.equal(getVercelClientIp(" 203.0.113.7, 10.0.0.1 "), "203.0.113.7");
  assert.equal(getVercelClientIp("2001:db8::7"), "2001:db8::7");
  assert.equal(getVercelClientIp("2001:DB8::7, 203.0.113.8"), "2001:db8::7");
});

test("rejects unverified or malformed IP strings", () => {
  for (const value of [
    null, "", "unknown", "not-an-ip", "203.0.113.7:443",
    "999.1.2.3", "[2001:db8::1]", "198.51.100.1\nInjected: value",
    ", 203.0.113.7", "2001:db8:::7",
    "203.0.113.7," + "10.0.0.1,".repeat(20),
    "X".repeat(513),
  ]) {
    assert.equal(getVercelClientIp(value), null, String(value));
  }
});
