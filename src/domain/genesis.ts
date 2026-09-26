export const GENESIS_EDITION = "GENESIS" as const;
export const GENESIS_SUPPLY = 50 as const;

export type GenesisSeedPass = {
  id: string;
  edition: typeof GENESIS_EDITION;
  serial: string;
  sequenceNumber: number;
  status: "RESERVED" | "AVAILABLE";
};

export function serialFor(sequenceNumber: number) {
  if (!Number.isInteger(sequenceNumber) || sequenceNumber < 1 || sequenceNumber > GENESIS_SUPPLY) {
    throw new Error("Genesis sequence must be between 1 and 50");
  }

  return `OSA-GEN-${String(sequenceNumber).padStart(4, "0")}`;
}

export function buildGenesisInventory(): GenesisSeedPass[] {
  return Array.from({ length: GENESIS_SUPPLY }, (_, index) => {
    const sequenceNumber = index + 1;
    return {
      id: `osa-genesis-${String(sequenceNumber).padStart(4, "0")}`,
      edition: GENESIS_EDITION,
      serial: serialFor(sequenceNumber),
      sequenceNumber,
      status: sequenceNumber === 1 ? "RESERVED" : "AVAILABLE",
    };
  });
}
