import { describe, it, expect } from "vitest";

// Import only the pure functions (no DB or Next.js cookies dependency)
// We test the password hashing logic directly by duplicating the pure functions
// since auth.ts imports Next.js server-only modules.

const PBKDF2_ITERATIONS = 310000;

async function pbkdf2Hash(password: string, salt: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const saltHex = Array.from(salt, (b) => b.toString(16).padStart(2, "0")).join("");
  const hash = await pbkdf2Hash(password, salt);
  return `pbkdf2:${saltHex}:${hash}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;

  if (storedHash.startsWith("pbkdf2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const saltHex = parts[1];
    const expectedHash = parts[2];
    const salt = new Uint8Array(
      (saltHex.match(/.{2}/g) || []).map((byte) => parseInt(byte, 16)),
    );
    const computed = await pbkdf2Hash(password, salt);
    return computed === expectedHash;
  }

  // Legacy: "<randomSalt>:<sha256Hash>"
  if (storedHash.includes(":")) {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const computed = await crypto.subtle.digest("SHA-256", data);
    const computedHex = Array.from(new Uint8Array(computed))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return computedHex === hash;
  }

  // Oldest legacy: SHA-256 with static salt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "mediatrend-salt-2024");
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === storedHash;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("hashPassword", () => {
  it("returns a pbkdf2-prefixed string", async () => {
    const hash = await hashPassword("mypassword");
    expect(hash).toMatch(/^pbkdf2:[0-9a-f]{32}:[0-9a-f]{64}$/);
  });

  it("produces different hashes for the same password (random salt)", async () => {
    const hash1 = await hashPassword("samepassword");
    const hash2 = await hashPassword("samepassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword — PBKDF2 format", () => {
  it("returns true for correct password", async () => {
    const stored = await hashPassword("correct-horse-battery");
    expect(await verifyPassword("correct-horse-battery", stored)).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const stored = await hashPassword("correct-horse-battery");
    expect(await verifyPassword("wrong-password", stored)).toBe(false);
  });

  it("returns false for empty stored hash", async () => {
    expect(await verifyPassword("any", "")).toBe(false);
  });

  it("returns false for malformed pbkdf2 hash", async () => {
    expect(await verifyPassword("any", "pbkdf2:onlytwoparts")).toBe(false);
  });
});

describe("verifyPassword — legacy SHA-256 with static salt", () => {
  it("verifies accounts using the oldest legacy format", async () => {
    const password = "legacypassword";
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "mediatrend-salt-2024");
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    expect(await verifyPassword(password, hashHex)).toBe(true);
    expect(await verifyPassword("wrongpass", hashHex)).toBe(false);
  });
});

describe("verifyPassword — legacy SHA-256 with random salt", () => {
  it("verifies accounts using the intermediate legacy format", async () => {
    const password = "legacyv2password";
    const salt = "a1b2c3d4";
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    expect(await verifyPassword(password, `${salt}:${hashHex}`)).toBe(true);
    expect(await verifyPassword("wrongpass", `${salt}:${hashHex}`)).toBe(false);
  });
});
