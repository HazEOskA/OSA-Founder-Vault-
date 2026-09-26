import { getDb } from "../src/db/client";
import { passes } from "../src/db/schema";
import { buildGenesisInventory } from "../src/domain/genesis";

async function main() {
  const db = getDb();
  const inventory = buildGenesisInventory();

  await db
    .insert(passes)
    .values(inventory)
    .onConflictDoNothing({ target: passes.serial });

  console.log(`Genesis registry seeded: ${inventory.length} canonical passes.`);
  console.log("#001 RESERVED; #002–#050 AVAILABLE.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
