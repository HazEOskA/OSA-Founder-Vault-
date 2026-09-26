import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db/client";
import { auditEvents, claimTokens, passes } from "../src/db/schema";
import { generateClaimCode, sha256 } from "../src/lib/security";

async function main() {
  const serial = process.argv[2]?.trim().toUpperCase();
  if (!serial) {
    throw new Error("Usage: npm run issue:claim -- OSA-GEN-0007");
  }

  const db = getDb();
  const [pass] = await db.select().from(passes).where(eq(passes.serial, serial)).limit(1);
  if (!pass) throw new Error("Pass not found");
  if (!["AVAILABLE", "SOLD", "SHIPPED"].includes(pass.status)) {
    throw new Error(`Pass status ${pass.status} cannot receive a new claim token`);
  }

  const raw = generateClaimCode();
  const expiresAt = new Date(Date.now() + 30 * 86_400_000);

  await db.transaction(async (tx) => {
    await tx.insert(claimTokens).values({
      id: randomUUID(),
      passId: pass.id,
      tokenHash: sha256(raw),
      expiresAt,
    });

    await tx
      .update(passes)
      .set({ status: "CLAIMABLE", updatedAt: new Date() })
      .where(eq(passes.id, pass.id));

    await tx.insert(auditEvents).values({
      id: randomUUID(),
      passId: pass.id,
      eventType: "CLAIM_TOKEN_ISSUED",
      payload: { expiresAt: expiresAt.toISOString() },
    });
  });

  console.log("CLAIM CODE — DISPLAYED ONCE");
  console.log(raw);
  console.log(`Expires: ${expiresAt.toISOString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
