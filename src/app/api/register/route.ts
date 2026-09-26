import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/security";
import { createSession, SESSION_COOKIE } from "@/lib/session";

const schema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(12).max(200),
  displayName: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid registration data" }, { status: 400 });
  }

  const db = getDb();
  const userId = randomUUID();

  try {
    await db.insert(users).values({
      id: userId,
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password),
      displayName: parsed.data.displayName,
    });
  } catch {
    return Response.json({ error: "Account already exists or could not be created" }, { status: 409 });
  }

  const session = await createSession(userId);
  const response = Response.json({ ok: true, userId }, { status: 201 });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${session.token}; Path=/; HttpOnly; SameSite=Lax; Expires=${session.expiresAt.toUTCString()}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return response;
}
