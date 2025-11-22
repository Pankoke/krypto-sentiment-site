"use client";

import React, { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { AssetReport } from "lib/news/aggregator";

export type NewsSnapshotStatus = "ok" | "empty" | "stale" | "error";

type NewsCardItem = {
  id: string;
  source: string;
  title: string;
  summary?: string;
  timestamp?: string;
  tags?: string[];
  url?: string;
};

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

  const newsItems: NewsCardItem[] = assets.flatMap((asset, assetIdx) => {
    const signals = asset.top_signals ?? [];
    if (!signals.length) {
      return [
        {
          id: `${asset.symbol}-${assetIdx}`,
          source: "signal",
          title: asset.rationale || asset.symbol,
          summary: asset.rationale,
          timestamp: displayDate,
          tags: [asset.symbol, asset.sentiment],
        },
      ];
    }
    return signals.map((sig, idx) => ({
      id: `${asset.symbol}-${idx}`,
      source: sig.source ?? "signal",
      title: sig.evidence || asset.symbol,
      summary: asset.rationale,
      timestamp: displayDate,
      tags: [asset.symbol, asset.sentiment],
      url: undefined,
    }));
  });

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

      {newsItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Aktuell liegen keine News vor. Bitte später erneut prüfen.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                    item.source === "twitter" || item.source === "social"
                      ? "bg-sky-50 text-sky-700 ring-sky-100"
                      : "bg-slate-50 text-slate-700 ring-slate-200",
                  ].join(" ")}
                >
                  {item.source}
                </span>

                {item.timestamp && (
                  <time className="text-[11px] text-slate-400">
                    {new Date(item.timestamp).toLocaleString(locale ?? "de-DE")}
                  </time>
                )}
              </div>

              <h3 className="text-base font-semibold leading-snug text-slate-900">{item.title}</h3>

              {item.summary ? (
                <p className="text-sm leading-relaxed text-slate-600">{item.summary}</p>
              ) : null}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.filter(Boolean).map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  Quelle öffnen →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
