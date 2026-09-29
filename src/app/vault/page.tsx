"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type VaultState = {
  email: string;
  pass: {
    id: string;
    serial: string;
    sequence_number: number;
    edition: string;
    status: string;
    issued_at: string;
    claimed_at: string | null;
  } | null;
  entitlements: { key: string; granted_at: string }[];
  events: { id: string; event_type: string; created_at: string }[];
};

export default function VaultPage() {
  const [state, setState] = useState<VaultState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setState(null);
        setLoading(false);
        return;
      }

      const { data: ownership } = await supabase
        .from("ownerships")
        .select("pass_id,acquired_at,passes(id,serial,sequence_number,edition,status,issued_at,claimed_at)")
        .eq("owner_id", auth.user.id)
        .maybeSingle();

      const rawPass = ownership?.passes;
      const pass = Array.isArray(rawPass) ? rawPass[0] ?? null : rawPass ?? null;

      let entitlements: VaultState["entitlements"] = [];
      let events: VaultState["events"] = [];

      if (pass?.id) {
        const [entitlementsResult, eventsResult] = await Promise.all([
          supabase
            .from("entitlements")
            .select("key,granted_at")
            .eq("pass_id", pass.id)
            .order("granted_at", { ascending: true }),
          supabase
            .from("audit_events")
            .select("id,event_type,created_at")
            .eq("pass_id", pass.id)
            .order("created_at", { ascending: false })
            .limit(30),
        ]);

        entitlements = (entitlementsResult.data ?? []) as VaultState["entitlements"];
        events = (eventsResult.data ?? []) as VaultState["events"];
      }

      setState({
        email: auth.user.email ?? "",
        pass: pass as VaultState["pass"],
        entitlements,
        events,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <main><div className="form-wrap"><p>Opening Founder Vault…</p></div></main>;
  }

  if (!state) {
    return (
      <main><div className="form-wrap">
        <div className="eyebrow">Founder Vault</div>
        <h2>Authentication required.</h2>
        <Link className="button" href="/login">Enter with OSA ID</Link>
      </div></main>
    );
  }

  if (!state.pass) {
    return (
      <main><div className="form-wrap">
        <div className="eyebrow">Founder Vault</div>
        <h2>No Pass claimed yet.</h2>
        <p>{state.email}</p>
        <Link className="button" href="/claim">Claim Genesis</Link>
      </div></main>
    );
  }

  const ageDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(state.pass.issued_at).getTime()) / 86_400_000),
  );

  return (
    <main>
      <section className="section">
        <div className="eyebrow">Founder Vault · Verified</div>
        <div className="pass-shell">
          <div className="pass-top"><span>{state.pass.edition}</span><span className="status">{state.pass.status}</span></div>
          <div className="pass-title">#{String(state.pass.sequence_number).padStart(3, "0")} / 050</div>
          <div className="pass-number">{state.pass.serial}</div>
        </div>
        <div className="grid">
          <div className="cell"><strong>Founder since</strong><span>{state.pass.claimed_at ? new Date(state.pass.claimed_at).toLocaleDateString() : "—"}</span></div>
          <div className="cell"><strong>Pass age</strong><span>{ageDays} days</span></div>
          <div className="cell"><strong>Access class</strong><span>Lifetime Founder</span></div>
          <div className="cell"><strong>Authenticity</strong><span>Verified</span></div>
        </div>
      </section>
      <section className="section">
        <div className="eyebrow">Entitlements</div>
        <h2>Founder access.</h2>
        <div className="grid">
          {state.entitlements.map((item) => (
            <div className="cell" key={item.key}><strong>{item.key}</strong><span>{new Date(item.granted_at).toLocaleDateString()}</span></div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="eyebrow">Chronicle</div>
        <h2>Proof history.</h2>
        {state.events.length ? state.events.map((event) => (
          <div className="cell" key={event.id}>
            <strong>{event.event_type}</strong>
            <span>{new Date(event.created_at).toLocaleString()}</span>
          </div>
        )) : <p>No Chronicle events yet.</p>}
      </section>
    </main>
  );
}
