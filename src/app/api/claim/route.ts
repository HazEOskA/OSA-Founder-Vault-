import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { claimPass } from "@/services/claim-pass";

const schema = z.object({
  serial: z.string().trim().min(8).max(40),
  claimCode: z.string().trim().min(12).max(80),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid claim payload" }, { status: 400 });
  }

  try {
    const claimed = await claimPass({
      userId: user.id,
      serial: parsed.data.serial,
      claimCode: parsed.data.claimCode,
    });
    return Response.json({ ok: true, pass: claimed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Claim failed";
    return Response.json({ error: message }, { status: 409 });
  }
}
