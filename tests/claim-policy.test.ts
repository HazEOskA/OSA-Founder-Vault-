import { describe, expect, it } from "vitest";
import { assertClaimable } from "@/domain/claim-policy";

describe("claim policy", () => {
  it("accepts a fresh claimable pass", () => {
    expect(() =>
      assertClaimable({
        status: "CLAIMABLE",
        tokenConsumed: false,
        tokenExpired: false,
        hasOwner: false,
      }),
    ).not.toThrow();
  });

  it.each([
    ["ACTIVE", false, false, false],
    ["CLAIMABLE", true, false, false],
    ["CLAIMABLE", false, true, false],
    ["CLAIMABLE", false, false, true],
  ])("rejects invalid claim state", (status, tokenConsumed, tokenExpired, hasOwner) => {
    expect(() =>
      assertClaimable({ status, tokenConsumed, tokenExpired, hasOwner }),
    ).toThrow();
  });
});
