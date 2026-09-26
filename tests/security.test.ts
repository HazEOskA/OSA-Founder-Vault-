import { describe, expect, it } from "vitest";
import { hashPassword, sha256, verifyPassword } from "@/lib/security";

describe("security primitives", () => {
  it("hashes and verifies passwords without storing plaintext", () => {
    const password = "a-strong-founder-password";
    const encoded = hashPassword(password);
    expect(encoded).not.toContain(password);
    expect(verifyPassword(password, encoded)).toBe(true);
    expect(verifyPassword("wrong-password", encoded)).toBe(false);
  });

  it("produces deterministic sha256 values", () => {
    expect(sha256("OSA")).toBe(sha256("OSA"));
    expect(sha256("OSA")).not.toBe(sha256("OSA2"));
  });
});
