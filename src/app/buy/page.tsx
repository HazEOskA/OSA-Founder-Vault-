import Link from "next/link";

export default function BuyPage() {
  return (
    <main>
      <section className="section">
        <div className="eyebrow">Genesis acquisition</div>
        <h2>Choose a numbered Founder Pass.</h2>
        <p>
          Genesis #002–#050 are the complete public supply. Initial launch inventory is offered
          through approved marketplace listings while direct card checkout is being connected.
          Every genuine purchase is bound to an OSA serial and verified in Founder Vault.
        </p>
        <div className="grid">
          <div className="cell"><strong>#002–#004</strong><span>Launch target: €299 each</span></div>
          <div className="cell"><strong>#005–#010</strong><span>Next target: €499 each</span></div>
          <div className="cell"><strong>#011–#050</strong><span>Released by market evidence, not by promise.</span></div>
        </div>
        <div className="notice">
          Featured launch pass: #002 / 050 (OSA-GEN-0002). Never buy an OSA Genesis Pass without a matching serial. Public authenticity can be checked before claim.
        </div>
        <div className="actions">
          <Link className="button" href="/pass/OSA-GEN-0002">Verify #002</Link>\n          <Link className="button secondary" href="/#registry">Open registry</Link>
          <Link className="button secondary" href="/terms">Read terms</Link>
        </div>
      </section>
    </main>
  );
}
