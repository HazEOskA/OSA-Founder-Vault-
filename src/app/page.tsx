import Link from "next/link";
import { PassGrid } from "@/components/pass-grid";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <div className="eyebrow">Only 50 exist · Genesis 2026</div>
          <h1>OWN THE<br />BEGINNING.</h1>
          <p className="lead">
            OSA Genesis is a numbered Lifetime Founder Pass. A physical artifact,
            a permanent digital record and verifiable Founder access to the OSA ecosystem.
          </p>
          <div className="actions">
            <a className="button" href="#registry">View available passes</a>
            <Link className="button secondary" href="/claim">Claim a pass</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="eyebrow">The artifact</div>
        <div className="pass-shell">
          <div className="pass-top"><span>OSA · Genesis</span><span>Founder Class · 2026</span></div>
          <div className="pass-title">LIFETIME<br />FOUNDER PASS</div>
          <div className="pass-number">007 / 050</div>
        </div>
      </section>

      <section className="section">
        <div className="eyebrow">What you own</div>
        <h2>Not a coupon. An identity layer.</h2>
        <div className="grid">
          <div className="cell"><strong>Numbered Genesis Pass</strong><span>One serial. One record. One owner.</span></div>
          <div className="cell"><strong>Founder Vault</strong><span>Your permanent OSA Founder record and Chronicle.</span></div>
          <div className="cell"><strong>Lifetime Founder Tier</strong><span>Founder software access and future Founder benefits.</span></div>
          <div className="cell"><strong>Public Proof</strong><span>Authenticity can be verified without exposing private data.</span></div>
        </div>
      </section>

      <section className="section" id="registry">
        <div className="eyebrow">The first fifty</div>
        <h2>Genesis Registry</h2>
        <p>#001 is reserved for the creator. #002–#050 are the immutable Genesis supply.</p>
        <PassGrid />
      </section>

      <section className="section">
        <div className="eyebrow">Lifetime terms</div>
        <h2>Founder access. Not infinite compute.</h2>
        <p>
          Lifetime Founder membership covers the OSA Founder Tier for the commercial life of the
          applicable OSA service. External API usage, model tokens, GPU time, cloud compute and
          third-party paid services are not included unless explicitly stated.
        </p>
      </section>

      <div className="footer-note">OSA Genesis · Founder Vault · CLAIM ≠ PROOF</div>
    </main>
  );
}
