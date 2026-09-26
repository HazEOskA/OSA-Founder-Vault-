import { describe, expect, it } from "vitest";
import { buildGenesisInventory, serialFor } from "@/domain/genesis";

describe("Genesis inventory", () => {
  it("contains exactly 50 immutable serial slots", () => {
    const passes = buildGenesisInventory();
    expect(passes).toHaveLength(50);
    expect(new Set(passes.map((pass) => pass.serial)).size).toBe(50);
    expect(passes[0]).toMatchObject({
      serial: "OSA-GEN-0001",
      sequenceNumber: 1,
      status: "RESERVED",
    });
    expect(passes[49]).toMatchObject({
      serial: "OSA-GEN-0050",
      sequenceNumber: 50,
      status: "AVAILABLE",
    });
  });

  it("rejects serials outside the Genesis supply", () => {
    expect(() => serialFor(0)).toThrow();
    expect(() => serialFor(51)).toThrow();
  });
});
