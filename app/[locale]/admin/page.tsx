"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SentimentCard } from "@/components/sentiment/SentimentCard";
import type { LogEntry } from "lib/monitoring/logs";
import type { SnapshotHistoryPoint } from "lib/news/snapshot";
import type { SentimentItem } from "lib/sentiment/types";
import { allowedTickerOrder } from "lib/assets";
import type { AssetSentimentPoint } from "lib/news/snapshot";

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

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Maintenance & Monitoring</h1>
          <p className="text-sm text-slate-600">
            Trigger tägliche Läufe, prüfe Logs und sieh dir Snapshot- sowie Asset-Historien an.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Button
                  disabled={actionState.dailyRun.loading}
                  onClick={() => runAction("dailyRun", "/api/admin/trigger-daily-run")}
                >
                  {actionState.dailyRun.loading ? "Lauf..." : "Daily-Run anstoßen"}
                </Button>
                {actionState.dailyRun.message && (
                  <p className="text-xs text-emerald-700 break-all">{actionState.dailyRun.message}</p>
                )}
                {actionState.dailyRun.error && (
                  <p className="text-xs text-rose-700 break-all">Fehler: {actionState.dailyRun.error}</p>
                )}
              </div>
              <div className="space-y-1">
                <Button
                  variant="secondary"
                  disabled={actionState.clearSnapshots.loading}
                  onClick={() => runAction("clearSnapshots", "/api/admin/clear-snapshots", { method: "POST" })}
                >
                  {actionState.clearSnapshots.loading ? "Löschen..." : "Snapshots leeren (Redis)"}
                </Button>
                {actionState.clearSnapshots.message && (
                  <p className="text-xs text-emerald-700 break-all">{actionState.clearSnapshots.message}</p>
                )}
                {actionState.clearSnapshots.error && (
                  <p className="text-xs text-rose-700 break-all">Fehler: {actionState.clearSnapshots.error}</p>
                )}
              </div>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  disabled={actionState.revalidate.loading}
                  onClick={() => runAction("revalidate", "/api/admin/revalidate-sentiment", { method: "POST" })}
                >
                  {actionState.revalidate.loading ? "Revalidiere..." : "Sentiment-Seiten revalidieren"}
                </Button>
                {actionState.revalidate.message && (
                  <p className="text-xs text-emerald-700 break-all">{actionState.revalidate.message}</p>
                )}
                {actionState.revalidate.error && (
                  <p className="text-xs text-rose-700 break-all">Fehler: {actionState.revalidate.error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {logsLoading && <p className="text-sm text-slate-500">Lade Logs...</p>}
              {logsError && <p className="text-sm text-rose-700">Fehler: {logsError.message}</p>}
              {!logsLoading && !logsError && (
                <div className="space-y-2">
                  {logs?.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                        <Badge
                          className={
                            entry.level === "error"
                              ? "bg-rose-100 text-rose-800"
                              : entry.level === "warn"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                          }
                        >
                          {entry.level}
                        </Badge>
                      </div>
                      <p className="text-slate-800">{entry.message}</p>
                      {entry.context && <p className="text-xs text-slate-500">Context: {entry.context}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => refreshLogs()}>
                  Refresh
                </Button>
                <Link href="/api/admin/logs?limit=200" className="text-xs text-indigo-600 underline">
                  API öffnen
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Snapshot-Historie (Assets pro Tag)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {historyLoading && <p className="text-sm text-slate-500">Lade Snapshot-Historie...</p>}
            {historyError && (
              <p className="text-sm text-rose-700">
                Fehler: {historyError instanceof Error ? historyError.message : "Unbekannter Fehler"}
              </p>
            )}
            {!historyLoading && !historyError && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-2 py-1">Datum</th>
                      <th className="px-2 py-1">Assets mit Daten</th>
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
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => refreshHistory()}>
                Refresh
              </Button>
              <Link href="/api/admin/snapshot-history?days=30" className="text-xs text-indigo-600 underline">
                API öffnen
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset-Historie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-700">Asset auswählen:</label>
              <select
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
            {assetHistory.length === 0 ? (
              <p className="text-sm text-slate-600">Keine Verlaufspunkte verfügbar.</p>
            ) : sentimentResponse?.items ? (
              <div className="grid gap-3 md:grid-cols-2">
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
            <Link
              href={`/api/sentiment/history/bulk?assets=${asset}&days=30`}
              className="text-xs text-indigo-600 underline"
            >
              API öffnen
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
