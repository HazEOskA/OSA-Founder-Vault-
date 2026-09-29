"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

type PublicPass = {
  serial: string;
  edition: string;
  sequence_number: number;
  status: string;
  issued_at: string;
  claimed_at: string | null;
};

export default function PublicPassPage() {
  const params = useParams<{ serial: string }>();
  const [pass, setPass] = useState<PublicPass | null | undefined>(undefined);

  useEffect(() => {
    const serial = decodeURIComponent(params.serial).toUpperCase();
    supabase
      .from("passes")
      .select("serial,edition,sequence_number,status,issued_at,claimed_at")
      .eq("serial", serial)
      .maybeSingle()
      .then(({ data }) => setPass((data as PublicPass | null) ?? null));
  }, [params.serial]);

  if (pass === undefined) return <main><div className="form-wrap"><p>Verifying…</p></div></main>;
  if (pass === null) return <main><div className="form-wrap"><h2>Pass not found.</h2></div></main>;

  return (
    <main>
      <section className="section">
        <div className="eyebrow">Public authenticity record</div>
        <div className="pass-shell">
          <div className="pass-top"><span>OSA · {pass.edition}</span><span className="status">AUTHENTIC</span></div>
          <div className="pass-title">#{String(pass.sequence_number).padStart(3, "0")} / 050</div>
          <div className="pass-number">{pass.serial}</div>
        </div>
        <div className="grid">
          <div className="cell"><strong>Status</strong><span>{pass.status}</span></div>
          <div className="cell"><strong>Issued</strong><span>{new Date(pass.issued_at).getUTCFullYear()}</span></div>
          <div className="cell"><strong>Claimed</strong><span>{pass.claimed_at ? "YES" : "NO"}</span></div>
          <div className="cell"><strong>Owner privacy</strong><span>Private by default</span></div>
        </div>
      </section>
    </main>
  );
}
