"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const displayName = String(form.get("displayName") ?? "").trim();

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });

      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").upsert({
          user_id: data.user.id,
          display_name: displayName || null,
        });
      }

      if (!data.session) {
        setMessage("Account created. Check your email to verify OSA ID, then sign in.");
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }
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
          minLength={12}
          required
        />
      </label>
      <button className="button" disabled={busy} type="submit">
        {busy ? "Working…" : mode === "register" ? "Create OSA ID" : "Enter OSA"}
      </button>
      {message && <div className="notice">{message}</div>}
    </form>
  );
}
