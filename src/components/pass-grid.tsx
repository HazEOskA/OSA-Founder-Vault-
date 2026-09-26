"use client";

import { useEffect, useState } from "react";

type PublicPass = {
  serial: string;
  sequenceNumber: number;
  status: string;
};

export function PassGrid() {
  const [items, setItems] = useState<PublicPass[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/passes")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => setItems(data.passes))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return <p>Registry is offline until the database is connected.</p>;
  }

  if (!items.length) {
    return <p>Loading the Genesis registry…</p>;
  }

  return (
    <div className="pass-list">
      {items.map((pass) => (
        <a className="pass-chip" href={`/pass/${pass.serial}`} key={pass.serial}>
          <b>#{String(pass.sequenceNumber).padStart(3, "0")}</b>
          {pass.status}
        </a>
      ))}
    </div>
  );
}
