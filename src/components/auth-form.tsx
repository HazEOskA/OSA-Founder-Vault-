"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      ...(mode === "register" ? { displayName: String(form.get("displayName") ?? "") } : {}),
    };

    const response = await fetch(`/api/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Request failed");
      setBusy(false);
      return;
    }

    router.push("/vault");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={submit}>
      {mode === "register" && (
        <label>
          Display name
          <input name="displayName" autoComplete="nickname" required maxLength={80} />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          minLength={mode === "register" ? 12 : 1}
          required
        />
      </label>
      <button className="button" disabled={busy} type="submit">
        {busy ? "Working…" : mode === "register" ? "Create OSA ID" : "Enter OSA"}
      </button>
      {message && <div className="notice error">{message}</div>}
    </form>
  );
}
