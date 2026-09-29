"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export function TrafficTracker() {
  const params = useSearchParams();

  useEffect(() => {
    const source = params.get("utm_source") ?? "direct";
    const campaign = params.get("utm_campaign");
    const listingId = params.get("listing_id");
    const key = `osa:landing:${source}:${campaign ?? ""}:${listingId ?? ""}`;

    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    void supabase.from("traffic_events").insert({
      source: source.slice(0, 64),
      campaign: campaign?.slice(0, 128) ?? null,
      listing_id: listingId?.slice(0, 128) ?? null,
      event_type: "landing_view",
      metadata: { path: window.location.pathname },
    });
  }, [params]);

  return null;
}
