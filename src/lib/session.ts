import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db/client";
import { sessions, users } from "@/db/schema";
import { generateOpaqueToken, sha256 } from "@/lib/security";

export const SESSION_COOKIE = "osa_session";

function sessionTtlDays() {
  const parsed = Number(process.env.SESSION_TTL_DAYS ?? "30");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

export async function createSession(userId: string) {
  const db = getDb();
  const token = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + sessionTtlDays() * 86_400_000);

  await db.insert(sessions).values({
    id: randomUUID(),
    userId,
    tokenHash: sha256(token),
    expiresAt,
  });

  return { token, expiresAt };
}

export async function getCurrentUser() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const db = getDb();
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, sha256(raw)), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return rows[0] ?? null;
}

export async function deleteCurrentSession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return;

  const db = getDb();
  await db.delete(sessions).where(eq(sessions.tokenHash, sha256(raw)));
}
