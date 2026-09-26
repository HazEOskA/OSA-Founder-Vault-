import { randomUUID } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  auditEvents,
  claimTokens,
  entitlements,
  ownerships,
  passes,
} from "@/db/schema";
import { assertClaimable } from "@/domain/claim-policy";
import { sha256 } from "@/lib/security";

export async function claimPass(input: {
  userId: string;
  serial: string;
  claimCode: string;
}) {
  const db = getDb();
  const serial = input.serial.trim().toUpperCase();
  const tokenHash = sha256(input.claimCode.trim());

  return db.transaction(async (tx) => {
    await tx.execute(sql`select id from passes where serial = ${serial} for update`);

    const [pass] = await tx.select().from(passes).where(eq(passes.serial, serial)).limit(1);
    if (!pass) throw new Error("Pass not found");

    const [token] = await tx
      .select()
      .from(claimTokens)
      .where(
        and(
          eq(claimTokens.passId, pass.id),
          eq(claimTokens.tokenHash, tokenHash),
          isNull(claimTokens.consumedAt),
          gt(claimTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    assertClaimable({
      status: pass.status,
      hasOwner: Boolean(pass.ownerId),
      tokenConsumed: !token || Boolean(token.consumedAt),
      tokenExpired: !token || token.expiresAt <= new Date(),
    });

    if (!token) {
      throw new Error("Invalid claim token");
    }

    const now = new Date();

    await tx
      .update(claimTokens)
      .set({ consumedAt: now })
      .where(eq(claimTokens.id, token.id));

    await tx
      .update(passes)
      .set({
        ownerId: input.userId,
        status: "ACTIVE",
        claimedAt: now,
        updatedAt: now,
      })
      .where(eq(passes.id, pass.id));

    await tx.insert(ownerships).values({
      id: randomUUID(),
      passId: pass.id,
      ownerId: input.userId,
      acquiredAt: now,
    });

    await tx.insert(entitlements).values([
      {
        id: randomUUID(),
        userId: input.userId,
        passId: pass.id,
        key: "founder:lifetime",
        grantedAt: now,
      },
      {
        id: randomUUID(),
        userId: input.userId,
        passId: pass.id,
        key: "founder:genesis",
        grantedAt: now,
      },
    ]);

    await tx.insert(auditEvents).values({
      id: randomUUID(),
      passId: pass.id,
      actorUserId: input.userId,
      eventType: "PASS_CLAIMED",
      payload: { serial },
      createdAt: now,
    });

    return {
      serial,
      status: "ACTIVE" as const,
      claimedAt: now,
    };
  });
}
