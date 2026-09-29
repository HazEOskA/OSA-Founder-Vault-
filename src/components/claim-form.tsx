"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export function ClaimForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    setOk(false);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setMessage("Sign in with OSA ID before claiming a pass.");
      setBusy(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const serial = String(form.get("serial") ?? "").trim().toUpperCase();
    const claimCode = String(form.get("claimCode") ?? "").trim();

    const { data, error } = await supabase.rpc("claim_founder_pass", {
      p_serial: serial,
      p_claim_code: claimCode,
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    const claimed = Array.isArray(data) ? data[0] : data;
    setOk(true);
    setMessage(`${claimed?.serial ?? serial} is now ACTIVE.`);
    setBusy(false);

    setTimeout(() => {
      router.push("/vault");
      router.refresh();
    }, 500);
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Pass serial
        <input name="serial" placeholder="OSA-GEN-0007" required />
      </label>
      <label>
        One-time claim code
        <input name="claimCode" placeholder="OSA-XXXXXX-XXXXXX-XXXXXX-XXXXXX" required />
      </label>
      <button className="button" disabled={busy} type="submit">
        {busy ? "Claiming…" : "Claim Pass"}
      </button>
      {message && <div className={`notice ${ok ? "success" : "error"}`}>{message}</div>}
    </form>
  );
}
