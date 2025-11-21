"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import type { LogEntry } from "lib/monitoring/logs";
import type { SnapshotHistoryPoint, AssetSentimentPoint } from "lib/news/snapshot";
import type { SentimentItem } from "lib/sentiment/types";
import { allowedTickerOrder } from "lib/assets";

type ActionState = {
  loading: boolean;
  message: string | null;
  error: string | null;
};

type ActionKey = "dailyRun" | "clearSnapshots" | "revalidate";

type ActionStateMap = Record<ActionKey, ActionState>;

const swrFetcher = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.status}`);
  }
  return response.json() as Promise<T>;
};

type BulkHistoryEntry = {
  asset: string;
  points: AssetSentimentPoint[];
};

type SentimentApiResponse = {
  items?: SentimentItem[];
};

export default function AdminDashboard() {
  const initialActions: ActionStateMap = {
    dailyRun: { loading: false, message: null, error: null },
    clearSnapshots: { loading: false, message: null, error: null },
    revalidate: { loading: false, message: null, error: null },
  };

  const [actionState, setActionState] = useState<ActionStateMap>(initialActions);
  const [asset, setAsset] = useState<string>(allowedTickerOrder[0] ?? "BTC");
  const [assetHistory, setAssetHistory] = useState<AssetSentimentPoint[]>([]);
  const [isAssetLoading, setIsAssetLoading] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);

  const { data: logs, error: logsError, isValidating: logsLoading, mutate: refreshLogs } = useSWR<LogEntry[]>(
    "/api/admin/logs?limit=50",
    swrFetcher
  );
  const { data: history, error: historyError, isValidating: historyLoading, mutate: refreshHistory } =
    useSWR<SnapshotHistoryPoint[]>("/api/admin/snapshot-history?days=30", swrFetcher);
  const { data: sentimentResponse } = useSWR<SentimentApiResponse>("/api/sentiment", swrFetcher);

  const historyByDate = useMemo(() => history ?? [], [history]);
  const latestSnapshot = historyByDate[0];

  async function runAction(key: ActionKey, path: string, init?: RequestInit) {
    setActionState((prev) => ({
      ...prev,
      [key]: { loading: true, message: null, error: null },
    }));
    try {
      const res = await fetch(path, init);
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || `HTTP ${res.status}`);
      }
      setActionState((prev) => ({
        ...prev,
        [key]: { loading: false, message: JSON.stringify(payload), error: null },
      }));
      refreshLogs();
      refreshHistory();
    } catch (error) {
      setActionState((prev) => ({
        ...prev,
        [key]: { loading: false, message: null, error: error instanceof Error ? error.message : String(error) },
      }));
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    async function loadAssetHistory() {
      setIsAssetLoading(true);
      setAssetError(null);
      try {
        const params = new URLSearchParams({ assets: asset, days: "30" }).toString();
        const res = await fetch(`/api/sentiment/history/bulk?${params}`, { signal: controller.signal });
        const data = (await res.json()) as BulkHistoryEntry[];
        const entry = data.find((item) => item.asset === asset);
        setAssetHistory(entry?.points ?? []);
      } catch (error) {
        setAssetError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsAssetLoading(false);
      }
    }
    loadAssetHistory();
    return () => controller.abort();
  }, [asset]);

  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

  const badgeClass = "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Admin & Monitoring</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Übersicht über Daily-Run, News-Snapshots, Logs und historische Daten. Nutze die Aktionen mit Bedacht – sie triggern echte Backend-Prozesse.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Spalte 1 */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Systemstatus</h2>
              <p className="mt-1 text-xs text-slate-500">Aktueller Zustand von Reports und News-Snapshots laut Health-Check.</p>
              <div className="mt-3 space-y-2 text-xs text-slate-700">
                {latestSnapshot ? (
                  <>
                    <p>
                      Letzter Snapshot: <span className="font-semibold text-slate-900">{latestSnapshot.date}</span>
                    </p>
                    <p>
                      Assets mit Daten: <span className="font-semibold text-slate-900">{latestSnapshot.assetsWithData}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">Keine Snapshot-Daten verfügbar.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Aktionen</h2>
              <p className="mt-1 text-xs text-slate-500">Triggere Daily-Run und News-Maintenance. Aktionen sind nur für Admins gedacht.</p>
              <div className="mt-4 space-y-3">
                <div className="space-y-1">
                  <Button
                    disabled={actionState.dailyRun.loading}
                    onClick={() => runAction("dailyRun", "/api/admin/trigger-daily-run")}
                    className={primaryButtonClass}
                  >
                    {actionState.dailyRun.loading ? "Lauf..." : "Daily-Run anstoßen"}
                  </Button>
                  {actionState.dailyRun.message && (
                    <p className="break-all text-xs text-emerald-700">{actionState.dailyRun.message}</p>
                  )}
                  {actionState.dailyRun.error && (
                    <p className="break-all text-xs text-rose-700">Fehler: {actionState.dailyRun.error}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Button
                    disabled={actionState.clearSnapshots.loading}
                    onClick={() => runAction("clearSnapshots", "/api/admin/clear-snapshots", { method: "POST" })}
                    className={primaryButtonClass}
                  >
                    {actionState.clearSnapshots.loading ? "Löschen..." : "Snapshots leeren (Redis)"}
                  </Button>
                  {actionState.clearSnapshots.message && (
                    <p className="break-all text-xs text-emerald-700">{actionState.clearSnapshots.message}</p>
                  )}
                  {actionState.clearSnapshots.error && (
                    <p className="break-all text-xs text-rose-700">Fehler: {actionState.clearSnapshots.error}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Button
                    disabled={actionState.revalidate.loading}
                    onClick={() => runAction("revalidate", "/api/admin/revalidate-sentiment", { method: "POST" })}
                    className={secondaryButtonClass}
                  >
                    {actionState.revalidate.loading ? "Revalidiere..." : "Sentiment-Seiten revalidieren"}
                  </Button>
                  {actionState.revalidate.message && (
                    <p className="break-all text-xs text-emerald-700">{actionState.revalidate.message}</p>
                  )}
                  {actionState.revalidate.error && (
                    <p className="break-all text-xs text-rose-700">Fehler: {actionState.revalidate.error}</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Spalte 2: Logs */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <h2 className="text-sm font-semibold text-slate-900">Logs</h2>
            <p className="mt-1 text-xs text-slate-500">Letzte Backend-Ereignisse (Daily-Run, News, Fehler). Neueste Einträge oben.</p>
            <div className="mt-4 h-80 overflow-y-auto">
              {logsLoading && <p className="text-sm text-slate-500">Lade Logs...</p>}
              {logsError && <p className="text-sm text-rose-700">Fehler: {logsError.message}</p>}
              {!logsLoading && !logsError && (
                <div className="divide-y divide-slate-100 text-xs">
                  {logs?.map((entry) => (
                    <div key={entry.id} className="py-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
                        <span
                          className={[
                            badgeClass,
                            entry.level === "error"
                              ? "bg-rose-50 text-rose-700 ring-rose-100"
                              : entry.level === "warn"
                                ? "bg-amber-50 text-amber-800 ring-amber-100"
                                : "bg-sky-50 text-sky-700 ring-sky-100",
                          ].join(" ")}
                        >
                          {entry.level}
                        </span>
                      </div>
                      <p className="text-slate-700">{entry.message}</p>
                      {entry.context && <p className="text-[10px] text-slate-500">Context: {entry.context}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button className={secondaryButtonClass} onClick={() => refreshLogs()}>
                Refresh
              </Button>
              <Link href="/api/admin/logs?limit=200" className="text-xs text-indigo-600 underline">
                API öffnen
              </Link>
            </div>
          </section>

          {/* Spalte 3: History */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <h2 className="text-sm font-semibold text-slate-900">History</h2>
            <p className="mt-1 text-xs text-slate-500">Verlauf der Snapshot-Anzahl und Asset-Historie für ausgewählte Coins.</p>

            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <h3 className="text-xs font-semibold text-slate-800">Snapshot-Historie (Assets pro Tag)</h3>
                <div className="mt-2 h-48 overflow-auto">
                  {historyLoading && <p className="text-sm text-slate-500">Lade Snapshot-Historie...</p>}
                  {historyError && (
                    <p className="text-sm text-rose-700">
                      Fehler: {historyError instanceof Error ? historyError.message : "Unbekannter Fehler"}
                    </p>
                  )}
                  {!historyLoading && !historyError && (
                    <table className="min-w-full text-left text-xs">
                      <thead className="text-[11px] uppercase text-slate-500">
                        <tr>
                          <th className="px-2 py-1">Datum</th>
                          <th className="px-2 py-1">Assets</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {historyByDate.map((point) => (
                          <tr key={point.date}>
                            <td className="px-2 py-1 text-slate-700">{point.date}</td>
                            <td className="px-2 py-1 font-semibold text-slate-900">{point.assetsWithData}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button className={secondaryButtonClass} onClick={() => refreshHistory()}>
                    Refresh
                  </Button>
                  <Link href="/api/admin/snapshot-history?days=30" className="text-xs text-indigo-600 underline">
                    API öffnen
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <h3 className="text-xs font-semibold text-slate-800">Asset-Historie</h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-700">
                  <label className="text-sm text-slate-700" htmlFor="asset-select">
                    Asset auswählen:
                  </label>
                  <select
                    id="asset-select"
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                  >
                    {allowedTickerOrder.map((ticker) => (
                      <option key={ticker} value={ticker}>
                        {ticker}
                      </option>
                    ))}
                  </select>
                  {isAssetLoading && <span className="text-xs text-slate-500">Lade...</span>}
                  {assetError && <span className="text-xs text-rose-700">Fehler: {assetError}</span>}
                </div>
                <div className="mt-3 space-y-2">
                  {assetHistory.length === 0 ? (
                    <p className="text-sm text-slate-600">Keine Verlaufspunkte verfügbar.</p>
                  ) : sentimentResponse?.items ? (
                    <div className="grid gap-3 md:grid-cols-1">
                      {sentimentResponse.items
                        .filter((item) => item.symbol.toUpperCase() === asset)
                        .slice(0, 1)
                        .map((item) => (
                          <SentimentCard key={item.symbol} item={item} historyPoints={assetHistory} />
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Keine aktuellen Sentiment-Daten geladen.</p>
                  )}
                </div>
                <Link
                  href={`/api/sentiment/history/bulk?assets=${asset}&days=30`}
                  className="text-xs text-indigo-600 underline"
                >
                  API öffnen
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
