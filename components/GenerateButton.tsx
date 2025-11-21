"use client";

import { useState } from 'react';

type TriggerResponse = {
  ok: boolean;
  error?: string;
  saved?: string;
  date?: string;
  assets?: number;
  mode?: string;
  skipped?: boolean;
};

export default function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/trigger-daily-run', { method: 'POST' });
      const json = (await res.json()) as TriggerResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      const savedPath = json.saved ?? 'Datei gespeichert';
      setResult(`Daily-Run erfolgreich gestartet: ${savedPath}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-black px-3 py-1.5 text-white text-sm hover:bg-gray-800 disabled:opacity-60"
      >
        {loading ? 'Starte Daily-Run…' : 'Daily-Run jetzt starten (Admin)'}
      </button>
      {result && <div className="text-sm text-green-700">{result}</div>}
      {error && (
        <div className="text-sm text-red-700">
          Fehler: {error}
          <div className="text-xs text-gray-600">
            Diese Aktion ist nur für Admins mit gültigem Secret erlaubt.
          </div>
        </div>
      )}
    </div>
  );
}
