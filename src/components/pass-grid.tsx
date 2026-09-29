"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type PublicPass = {
  serial: string;
  sequence_number: number;
  status: string;
};

export function PassGrid() {
  const [items, setItems] = useState<PublicPass[]>([]);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("passes")
      .select("serial,sequence_number,status")
      .order("sequence_number", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFailed(error.message);
          return;
        }
        setItems((data ?? []) as PublicPass[]);
      });
  }, []);

  if (failed) return <p>Registry temporarily unavailable: {failed}</p>;
  if (!items.length) return <p>Loading the Genesis registry…</p>;

  return (
    <div className="pass-list">
      {items.map((pass) => (
        <a className="pass-chip" href={`/pass/${pass.serial}`} key={pass.serial}>
          <b>#{String(pass.sequence_number).padStart(3, "0")}</b>
          {pass.status}
        </a>
      ))}
    </div>
  );
}
