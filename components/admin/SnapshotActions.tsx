"use client";

import { useState } from "react";

const ACTIONS = [
  { label: "Neu generieren", path: "/api/news/generate?mode=overwrite" },
  { label: "Validieren", path: "/api/news/validate" },
];

export default function SnapshotActions() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runAction(path: string) {
    setBusy(true);
    setStatus("Lade …");
    try {
      const res = await fetch(path);
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
          onClick={() => runAction(action.path)}
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
