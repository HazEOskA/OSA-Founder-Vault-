import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db/client";
import { passes } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function PublicPassPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const db = getDb();
  const [pass] = await db
    .select()
    .from(passes)
    .where(eq(passes.serial, serial.toUpperCase()))
    .limit(1);

  if (!pass) notFound();

  return (
    <main>
      <section className="section">
        <div className="eyebrow">Public authenticity record</div>
        <div className="pass-shell">
          <div className="pass-top"><span>OSA · {pass.edition}</span><span className="status">AUTHENTIC</span></div>
          <div className="pass-title">#{String(pass.sequenceNumber).padStart(3, "0")} / 050</div>
          <div className="pass-number">{pass.serial}</div>
        </div>
        <div className="grid">
          <div className="cell"><strong>Status</strong><span>{pass.status}</span></div>
          <div className="cell"><strong>Issued</strong><span>{pass.issuedAt.getUTCFullYear()}</span></div>
          <div className="cell"><strong>Claimed</strong><span>{pass.claimedAt ? "YES" : "NO"}</span></div>
          <div className="cell"><strong>Owner privacy</strong><span>Private by default</span></div>
        </div>
      </section>
    </main>
  );
}
