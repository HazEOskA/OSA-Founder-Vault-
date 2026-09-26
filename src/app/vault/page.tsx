import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { auditEvents, passes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main>
        <div className="form-wrap">
          <div className="eyebrow">Founder Vault</div>
          <h2>Authentication required.</h2>
          <Link className="button" href="/login">Enter with OSA ID</Link>
        </div>
      </main>
    );
  }

  const db = getDb();
  const [pass] = await db.select().from(passes).where(eq(passes.ownerId, user.id)).limit(1);

  if (!pass) {
    return (
      <main>
        <div className="form-wrap">
          <div className="eyebrow">Founder Vault</div>
          <h2>No Pass claimed yet.</h2>
          <p>{user.email}</p>
          <Link className="button" href="/claim">Claim Genesis</Link>
        </div>
      </main>
    );
  }

  const events = await db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.passId, pass.id))
    .orderBy(desc(auditEvents.createdAt))
    .limit(20);

  const ageDays = Math.max(0, Math.floor((Date.now() - pass.issuedAt.getTime()) / 86_400_000));

  return (
    <main>
      <section className="section">
        <div className="eyebrow">Founder Vault · Verified</div>
        <div className="pass-shell">
          <div className="pass-top"><span>{pass.edition}</span><span className="status">{pass.status}</span></div>
          <div className="pass-title">#{String(pass.sequenceNumber).padStart(3, "0")} / 050</div>
          <div className="pass-number">{pass.serial}</div>
        </div>
        <div className="grid">
          <div className="cell"><strong>Founder since</strong><span>{pass.claimedAt?.toLocaleDateString() ?? "—"}</span></div>
          <div className="cell"><strong>Pass age</strong><span>{ageDays} days</span></div>
          <div className="cell"><strong>Access class</strong><span>Lifetime Founder</span></div>
          <div className="cell"><strong>Authenticity</strong><span>Verified</span></div>
        </div>
      </section>
      <section className="section">
        <div className="eyebrow">Chronicle</div>
        <h2>Proof history.</h2>
        {events.length ? events.map((event) => (
          <div className="cell" key={event.id}>
            <strong>{event.eventType}</strong>
            <span>{event.createdAt.toLocaleString()}</span>
          </div>
        )) : <p>No Chronicle events yet.</p>}
      </section>
    </main>
  );
}
