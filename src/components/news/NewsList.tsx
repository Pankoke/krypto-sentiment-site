"use client";

import React, { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { AssetReport } from "lib/news/aggregator";

export type NewsSnapshotStatus = "ok" | "empty" | "stale" | "error";

type Props = {
  assets: AssetReport[];
  reportDate: string;
  generatedAt?: string;
  methodNote?: string;
  status: NewsSnapshotStatus;
  errorMessage?: string;
  action?: ReactNode;
  locale?: string;
};

export default function NewsList({
  assets,
  reportDate,
  generatedAt,
  methodNote,
  status,
  errorMessage,
  action,
  locale,
}: Props) {
  const t = useTranslations("news");
  const displayDate = generatedAt ?? reportDate;

  if (status === "error") {
    return (
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-900">
        <p>{t("newsStatus.error", { error: errorMessage ?? "unknown" })}</p>
        {action ? <div className="flex justify-center">{action}</div> : null}
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
        Noch keine News vorhanden.
      </div>
    );
  }

  const staleAlert =
    status === "stale" ? (
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Momentan liegen keine aktuellen News vor. Es wird der letzte verfügbare Snapshot angezeigt.
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">{t("generatedAt", { date: displayDate })}</p>
        {methodNote ? <p className="mt-1 text-xs text-gray-500">{methodNote}</p> : null}
        {staleAlert ? <div className="mt-2">{staleAlert}</div> : null}
        {action && status === "stale" ? <div className="mt-3 flex justify-center">{action}</div> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => {
          const signals = asset.top_signals ?? [];
          const sourceLabel = signals[0]?.source ?? "signal";
          const timestamp = displayDate;
          const score =
            typeof asset.score === "number" ? asset.score.toFixed(2) : asset.score ?? "--";
          const confidence =
            typeof asset.confidence === "number" ? Math.round(asset.confidence * 100) : null;
          return (
            <article
              key={`${asset.symbol}-${asset.sentiment}-${asset.score}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                    sourceLabel === "twitter"
                      ? "bg-sky-50 text-sky-700 ring-sky-100"
                      : "bg-slate-50 text-slate-700 ring-slate-200",
                  ].join(" ")}
                >
                  {sourceLabel}
                </span>

                {timestamp && (
                  <time className="text-[11px] text-slate-400">
                    {new Date(timestamp).toLocaleString(locale ?? "de-DE")}
                  </time>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold leading-snug text-slate-900">{asset.symbol}</h3>
                <p className="text-xs text-slate-500">{asset.sentiment}</p>
              </div>

              {asset.rationale ? (
                <p className="text-sm leading-relaxed text-slate-600">{asset.rationale}</p>
              ) : null}

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold">Score</span>{" "}
                  <span>{score}</span>
                </div>
                {confidence !== null && (
                  <div>
                    <span className="font-semibold">{t("label.confidence")}</span>{" "}
                    <span>{confidence}%</span>
                  </div>
                )}
              </div>

              {signals.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {signals.slice(0, 4).map((sig, idx) => (
                    <span
                      key={`${sig.source ?? "signal"}-${idx}`}
                      className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-100"
                    >
                      <span>{sig.source ?? "signal"}</span>
                      {sig.evidence ? <span className="pl-1">{sig.evidence}</span> : null}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
