"use client";

import { useState } from 'react';

export default function GenerateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/daily-report');
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setResult('Bericht erzeugt: ' + (json.saved ?? '')); 
      // Optional: Seite neu laden, damit der Bericht sichtbar wird
      setTimeout(() => window.location.reload(), 500);
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
        {loading ? 'Erzeuge…' : 'Jetzt Tagesbericht erzeugen'}
      </button>
      {result && <div className="text-sm text-green-700">{result}</div>}
      {error && (
        <div className="text-sm text-red-700">
          Fehler: {error}
          <div className="text-xs text-gray-600">
            Falls der Endpoint geschützt ist, bitte per Terminal mit `?key=CRON_SECRET` aufrufen.
          </div>
        </div>
      )}
    </div>
  );
}

