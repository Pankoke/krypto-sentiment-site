"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger daily run";
      setRunStatus("failed");
      setRunMessage(message);
    } finally {
      setIsRunning(false);
    }
  }, [mutate]);

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
      <div className="grid gap-6 lg:grid-cols-2">
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
      </div>
    </div>
  );
}
