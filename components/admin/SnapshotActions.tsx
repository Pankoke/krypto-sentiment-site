"use client";

import { useState } from "react";

type Action = {
  label: string;
  path: string;
  method?: "GET" | "POST";
};

const ACTIONS: Action[] = [
  { label: "Daily-Run anstoßen", path: "/api/admin/trigger-daily-run", method: "GET" },
  { label: "Snapshots leeren (Redis)", path: "/api/admin/clear-snapshots", method: "POST" },
  { label: "Sentiment-Seiten revalidieren", path: "/api/admin/revalidate-sentiment", method: "POST" },
];

export default function SnapshotActions() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runAction(action: Action) {
    setBusy(true);
    setStatus("Lade …");
    try {
      const res = await fetch(action.path, { method: action.method ?? "GET" });
      const payload = await res.json();
      setStatus(JSON.stringify(payload));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          disabled={busy}
          onClick={() => runAction(action)}
          className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
      {status && (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs">
          <span>Status: </span>
          <span className="font-mono text-slate-700">{status}</span>
        </div>
      )}
    </div>
  );
}
