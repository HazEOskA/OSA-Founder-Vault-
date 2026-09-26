import { asc } from "drizzle-orm";
import { getDb } from "@/db/client";
import { passes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = await db
    .select({
      serial: passes.serial,
      sequenceNumber: passes.sequenceNumber,
      status: passes.status,
    })
    .from(passes)
    .orderBy(asc(passes.sequenceNumber));

  return Response.json({ passes: rows });
}
