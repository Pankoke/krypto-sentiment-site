"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SnapshotOverview } from "lib/news/snapshot";

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
  const [runMessage, setRunMessage] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<DailyRunStatus | null>(null);
  const [isRunning, setIsRunning] = useState(false);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger daily run";
      setRunStatus("failed");
      setRunMessage(message);
    } finally {
      setIsRunning(false);
    }
  }, [mutate, mutateOverview]);

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
            <Button className="w-full" onClick={triggerDailyRun} disabled={isRunning}>
              {isRunning ? "Running daily job…" : "Run daily job"}
            </Button>
            {runStatus && (
              <p className="mt-3 text-sm text-gray-700">
                Latest trigger status: <strong className="capitalize">{runStatus}</strong>
              </p>
            )}
            {runMessage && (
              <p className="mt-1 text-xs text-gray-500">{runMessage}</p>
            )}
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
                    {overview.assetCoverage.slice(0, 8).map((entry) => (
                      <div key={entry.assetId} className="flex items-center justify-between gap-3">
                        <span className="font-medium">{entry.assetId}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{entry.daysWithData}</span>
                          {entry.daysWithData === overview.totalDays && (
                            <Badge className="border bg-emerald-100 text-emerald-800 border-emerald-200">
                              Full coverage
                            </Badge>
                          )}
                          {entry.daysWithData === 1 && (
                            <Badge className="border bg-blue-50 text-blue-800 border-blue-200">
                              New asset
                            </Badge>
                          )}
                          {entry.daysWithData > 0 && overview.totalDays > 0 && entry.daysWithData <= 3 && (
                            <Badge className="border bg-amber-50 text-amber-900 border-amber-200">
                              Low coverage
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {!overview.assetCoverage.length && (
                      <p className="text-xs text-gray-500">No asset details available for the selected window.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
