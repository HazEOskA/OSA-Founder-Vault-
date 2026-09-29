import Link from "next/link";
import { Suspense } from "react";
import { PassGrid } from "@/components/pass-grid";
import { TrafficTracker } from "@/components/traffic-tracker";

export default function Home() {
  return (
    <main>
      <Suspense fallback={null}><TrafficTracker /></Suspense>

      <section className="hero">
        <div>
          <div className="eyebrow">Only 50 exist · Genesis 2026</div>
          <h1>OWN THE<br />BEGINNING.</h1>
          <p className="lead">
            OSA Genesis is a numbered Lifetime Founder Pass. A physical artifact,
            a permanent digital record and verifiable Founder access to the OSA ecosystem.
          </p>
          <div className="actions">
            <Link className="button" href="/buy">Buy Genesis</Link>
            <a className="button secondary" href="#registry">View registry</a>
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
          <div className="cell"><strong>Numbered Genesis Pass</strong><span>One serial. One permanent registry record.</span></div>
          <div className="cell"><strong>Founder Vault</strong><span>Your OSA Founder record, entitlements and Chronicle.</span></div>
          <div className="cell"><strong>Lifetime Founder Tier</strong><span>Founder software access and future Founder benefits under the published terms.</span></div>
          <div className="cell"><strong>Public Proof</strong><span>Authenticity verified without exposing private owner data.</span></div>
        </div>
      </section>

      <section className="section" id="registry">
        <div className="eyebrow">The first fifty</div>
        <h2>Genesis Registry</h2>
        <p>#001 is reserved for the creator. #002–#050 are the complete Genesis supply.</p>
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
        <div className="actions">
          <Link className="button secondary" href="/terms">Terms</Link>
          <Link className="button secondary" href="/privacy">Privacy</Link>
          <Link className="button secondary" href="/refunds">Refunds & transfer</Link>
        </div>
      </section>

      <div className="footer-note">OSA Genesis · Founder Vault · CLAIM ≠ PROOF</div>
    </main>
  );
}
