import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { passes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ serial: string }> },
) {
  const { serial } = await context.params;
  const db = getDb();
  const [pass] = await db
    .select({
      serial: passes.serial,
      edition: passes.edition,
      sequenceNumber: passes.sequenceNumber,
      status: passes.status,
      issuedAt: passes.issuedAt,
      claimedAt: passes.claimedAt,
    })
    .from(passes)
    .where(eq(passes.serial, serial.toUpperCase()))
    .limit(1);

  if (!pass) {
    return Response.json({ authentic: false }, { status: 404 });
  }

  return Response.json({
    authentic: true,
    pass: {
      ...pass,
      claimed: Boolean(pass.claimedAt),
    },
  });
}
