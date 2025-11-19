"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SnapshotHistoryPoint, SnapshotOverview } from "lib/news/snapshot";
import type { LogEntry } from "lib/monitoring/logs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type HealthStatus = "ok" | "partial" | "stale" | "warming_up" | "fail";

interface HealthResponse {
  status: HealthStatus;
  latestGeneratedAt?: string | null;
  warnings?: string[];
  news?: Record<string, unknown>;
  reports?: Record<string, unknown>;
}

type DailyRunStatus = "created" | "updated" | "skipped" | "failed";

interface DailyRunResponse {
  status: "ok" | "partial" | "fail";
  runStatus: DailyRunStatus;
  reason?: string;
  message?: string;
}

const swrFetcher = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Unexpected response ${response.status}`);
  }
  return response.json();
};

const statusLabels: Record<HealthStatus, string> = {
  ok: "Healthy",
  partial: "Partial",
  stale: "Stale",
  warming_up: "Warming up",
  fail: "Error",
};

const statusStyles: Record<HealthStatus, string> = {
  ok: "bg-emerald-100 text-emerald-800 border-emerald-200",
  partial: "bg-amber-100 text-amber-800 border-amber-200",
  stale: "bg-amber-100 text-amber-900 border-amber-200",
  warming_up: "bg-blue-100 text-blue-800 border-blue-200",
  fail: "bg-rose-100 text-rose-900 border-rose-200",
};

type CoverageLevel = "full" | "medium" | "low" | "critical";

const badgeStyles: Record<CoverageLevel, { label: string; className: string }> = {
  full: { label: "Full coverage", className: "border bg-emerald-100 text-emerald-800 border-emerald-200" },
  medium: { label: "Medium coverage", className: "border bg-amber-100 text-amber-800 border-amber-200" },
  low: { label: "Low coverage", className: "border bg-amber-50 text-amber-900 border-amber-200" },
  critical: { label: "Critical coverage", className: "border bg-rose-50 text-rose-800 border-rose-200" },
};

function getCoverageLevel(daysWithData: number, totalDays: number): CoverageLevel {
  if (totalDays <= 0) {
    return "low";
  }
  if (daysWithData === totalDays) {
    return "full";
  }
  if (daysWithData <= 2) {
    return "critical";
  }
  const ratio = daysWithData / totalDays;
  if (ratio >= 0.5) {
    return "medium";
  }
  return "low";
}

const logLevelStyles: Record<LogEntry["level"], string> = {
  info: "border bg-emerald-50 text-emerald-800 border-emerald-200",
  warn: "border bg-amber-50 text-amber-900 border-amber-200",
  error: "border bg-rose-50 text-rose-800 border-rose-200",
};

export default function AdminStatusPage() {
  const { data, error, isValidating, mutate } = useSWR<HealthResponse>("/api/health", swrFetcher, {
    revalidateOnFocus: true,
  });
  const {
    data: overview,
    error: overviewError,
    isValidating: overviewValidating,
    mutate: mutateOverview,
  } = useSWR<SnapshotOverview>("/api/admin/snapshot-overview?days=30", swrFetcher);
  const {
    data: history,
    error: historyError,
    isValidating: historyValidating,
    mutate: mutateHistory,
  } = useSWR<SnapshotHistoryPoint[]>("/api/admin/snapshot-history?days=30", swrFetcher);
  const { data: logs, error: logsError, isValidating: logsValidating } = useSWR<LogEntry[]>("/api/admin/logs?limit=50", swrFetcher);
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<DailyRunStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [clearStatus, setClearStatus] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [revalidateStatus, setRevalidateStatus] = useState<string | null>(null);
  const [isRevalidating, setIsRevalidating] = useState(false);

  const formattedGeneratedAt = useMemo(() => {
    if (!data?.latestGeneratedAt) {
      return "Not available";
    }
    const timestamp = Date.parse(data.latestGeneratedAt);
    if (Number.isNaN(timestamp)) {
      return data.latestGeneratedAt;
    }
    return new Date(timestamp).toLocaleString();
  }, [data]);

  const triggerDailyRun = useCallback(async () => {
    setIsRunning(true);
    setRunMessage(null);
    try {
      const response = await swrFetcher("/api/admin/trigger-daily-run", { method: "POST" });
      const body = response as DailyRunResponse;
      setRunStatus(body.runStatus);
      setRunMessage(body.reason ?? body.message ?? "Daily run completed");
      await mutate();
      await mutateOverview?.();
      await mutateHistory?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger daily run";
      setRunStatus("failed");
      setRunMessage(message);
    } finally {
      setIsRunning(false);
    }
  }, [mutate, mutateOverview, mutateHistory]);

  const handleClearSnapshots = useCallback(async () => {
    setIsClearing(true);
    setClearStatus(null);
    try {
      const response = await swrFetcher("/api/admin/clear-snapshots", { method: "POST" });
      const payload = response as { status: "ok" | "error"; deletedKeys?: number; message?: string };
      if (payload.status === "ok") {
        setClearStatus(`Cleared ${payload.deletedKeys ?? 0} keys.`);
        await mutate();
        await mutateOverview?.();
        await mutateHistory?.();
      } else {
        setClearStatus(payload.message ?? "Snapshot clear failed.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Snapshot clear failed";
      setClearStatus(message);
    } finally {
      setIsClearing(false);
    }
  }, [mutate, mutateOverview, mutateHistory]);

  const handleRevalidateSentiment = useCallback(async () => {
    setIsRevalidating(true);
    setRevalidateStatus(null);
    try {
      const response = await swrFetcher("/api/admin/revalidate-sentiment", { method: "POST" });
      const payload = response as { status: "ok" | "error"; message?: string };
      if (payload.status === "ok") {
        setRevalidateStatus(payload.message ?? "Sentiment page revalidated.");
      } else {
        setRevalidateStatus(payload.message ?? "Revalidation failed.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Revalidation failed";
      setRevalidateStatus(message);
    } finally {
      setIsRevalidating(false);
    }
  }, []);

  const healthStatusBadge = useMemo(
    () => ({
      label: data ? statusLabels[data.status] : "Unknown",
      styles: data ? statusStyles[data.status] : "bg-gray-100 text-gray-800 border-gray-200",
    }),
    [data]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin / System Status</h1>
        <p className="text-sm text-gray-500">Monitor pipeline health and trigger daily snapshots manually.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border">
          <CardHeader>
            <CardTitle>Health</CardTitle>
            <p className="text-sm text-gray-500">Latest system snapshot</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`border ${healthStatusBadge.styles}`}>{healthStatusBadge.label}</Badge>
              {isValidating && (
                <span className="text-xs text-gray-500">Refreshing...</span>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd className="font-medium">{data?.status ?? "unknown"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Last generated</dt>
                <dd className="font-medium">{formattedGeneratedAt}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Warnings</dt>
                <dd className="font-medium">{data?.warnings?.length ? data.warnings.join("; ") : "None"}</dd>
              </div>
            </dl>
            {error && (
              <p className="mt-3 text-sm text-rose-600">Could not load health status: {error instanceof Error ? error.message : "Unknown error"}</p>
            )}
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <p className="text-sm text-gray-500">Manual controls</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Button className="w-full" onClick={triggerDailyRun} disabled={isRunning}>
                  {isRunning ? "Running daily job…" : "Run daily job"}
                </Button>
                {runStatus && (
                  <p className="text-sm text-gray-700">
                    Latest trigger status: <strong className="capitalize">{runStatus}</strong>
                  </p>
                )}
                {runMessage && (
                  <p className="text-xs text-gray-500">{runMessage}</p>
                )}
              </div>
              <div className="border-t pt-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Maintenance
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800" onClick={handleClearSnapshots} disabled={isClearing}>
                    {isClearing ? "Clearing snapshots…" : "Clear snapshots"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Dev/debug only — removes Redis snapshot keys.
                  </p>
                  {clearStatus && (
                    <p className="text-xs text-gray-500">{clearStatus}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={handleRevalidateSentiment} disabled={isRevalidating}>
                    {isRevalidating ? "Revalidating sentiment…" : "Revalidate sentiment page"}
                  </Button>
                  {revalidateStatus && (
                    <p className="text-xs text-gray-500">{revalidateStatus}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Snapshot overview</CardTitle>
            <p className="text-sm text-gray-500">Last 30 days of persisted data</p>
          </CardHeader>
          <CardContent>
            {overviewValidating && <p className="text-sm text-gray-500">Loading coverage…</p>}
            {overviewError && (
              <p className="text-sm text-rose-600">
                Could not load snapshot overview: {overviewError instanceof Error ? overviewError.message : "Unknown error"}
              </p>
            )}
            {overview && (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Snapshots available on {overview.totalDays} day{overview.totalDays === 1 ? "" : "s"} in the last 30 days.
                </p>
                {overview.totalDays === 0 ? (
                  <p className="mt-3 text-xs text-gray-500">No snapshots stored yet on disk/Redis.</p>
                ) : (
                  <div className="mt-3 space-y-2 text-sm">
                    {overview.assetCoverage.slice(0, 8).map((entry) => {
                      const level = getCoverageLevel(entry.daysWithData, overview.totalDays);
                      const badge = badgeStyles[level];
                      return (
                        <div key={entry.assetId} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{entry.assetId}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{entry.daysWithData}</span>
                              <Badge className={badge.className}>{badge.label}</Badge>
                            </div>
                          </div>
                          {level !== "full" && (
                            <p className="text-xs text-gray-500">
                              Data on {entry.daysWithData} of {overview.totalDays} days.
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {!overview.assetCoverage.length && (
                      <p className="text-xs text-gray-500">No asset details available for the selected window.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Snapshot history</CardTitle>
            <p className="text-sm text-gray-500">Assets per day over the last 30 days</p>
          </CardHeader>
          <CardContent>
            {historyValidating && <p className="text-sm text-gray-500">Loading history…</p>}
            {historyError && (
              <p className="text-sm text-rose-600">
                Could not load snapshot history: {historyError instanceof Error ? historyError.message : "Unknown error"}
              </p>
            )}
            {history && history.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [value, "assets"]}
                    labelFormatter={(label: string) => `Date: ${label}`}
                  />
                  <Line type="monotone" dataKey="assetsWithData" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No snapshot history available yet.</p>
            )}
          </CardContent>
        </Card>
        <Card className="border">
          <CardHeader>
            <CardTitle>Recent logs</CardTitle>
            <p className="text-sm text-gray-500">Latest system events (max 50)</p>
          </CardHeader>
          <CardContent>
            {logsValidating && <p className="text-sm text-gray-500">Loading logs…</p>}
            {logsError && (
              <p className="text-sm text-rose-600">Could not load logs: {logsError instanceof Error ? logsError.message : 'Unknown error'}</p>
            )}
            {logs && logs.length > 0 ? (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {logs.map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between gap-4 border-b pb-2 last:border-none">
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                      <p className="text-sm font-medium text-gray-700">{entry.message}</p>
                      {entry.context && (
                        <p className="text-xs uppercase tracking-wide text-gray-500">{entry.context}</p>
                      )}
                    </div>
                    <Badge className={`text-xs font-semibold ${logLevelStyles[entry.level]}`}>{entry.level}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No logs yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
