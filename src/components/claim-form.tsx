"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function ClaimForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setOk(false);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/claim", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        serial: String(form.get("serial") ?? ""),
        claimCode: String(form.get("claimCode") ?? ""),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Claim failed");
      return;
    }

    setOk(true);
    setMessage(`${data.pass.serial} is now active.`);
    setTimeout(() => {
      router.push("/vault");
      router.refresh();
    }, 700);
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
      <button className="button" type="submit">Claim Pass</button>
      {message && <div className={`notice ${ok ? "success" : "error"}`}>{message}</div>}
    </form>
  );
}
