"use client";

import React, { type ReactNode, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { NewsItem } from "lib/news/types";

export type NewsSnapshotStatus = "ok" | "empty" | "stale" | "error";

type Props = {
  items: NewsItem[];
  reportDate: string;
  generatedAt?: string;
  methodNote?: string;
  status: NewsSnapshotStatus;
  errorMessage?: string;
  action?: ReactNode;
  locale?: string;
};

const truncate = (value?: string, limit = 200) =>
  value && value.length > limit ? `${value.slice(0, limit - 3)}...` : value;

export default function NewsList({
  items,
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
  const [assetFilter, setAssetFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const uniqueSymbols = useMemo(
    () => Array.from(new Set(items.flatMap((it) => it.symbols ?? []))).sort(),
    [items]
  );
  const uniqueSources = useMemo(
    () => Array.from(new Set(items.map((it) => it.source))).sort(),
    [items]
  );

  const formatTimestamp = (value?: string) => {
    if (!value) return "";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString(locale ?? "de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => {
          const matchesSymbol =
            assetFilter === "all" || (item.symbols ?? []).some((sym) => sym === assetFilter);
          const matchesSource = sourceFilter === "all" || item.source === sourceFilter;
          return matchesSymbol && matchesSource;
        })
        .sort((a, b) => {
          const ta = a.timestamp ? Date.parse(a.timestamp) : 0;
          const tb = b.timestamp ? Date.parse(b.timestamp) : 0;
          return tb - ta;
        }),
    [items, assetFilter, sourceFilter]
  );

  const formattedDisplayDate = formatTimestamp(displayDate) || displayDate;

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
        Momentan liegen keine aktuellen News vor. Es wird der letzte verfuegbare Snapshot angezeigt.
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">{t("generatedAt", { date: formattedDisplayDate })}</p>
        {methodNote ? <p className="mt-1 text-xs text-gray-500">{methodNote}</p> : null}
        {staleAlert ? <div className="mt-2">{staleAlert}</div> : null}
        {action && status === "stale" ? <div className="mt-3 flex justify-center">{action}</div> : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Aktuell liegen keine News vor. Bitte spaeter erneut pruefen.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Asset</label>
              <select
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
              >
                <option value="all">Alle</option>
                {uniqueSymbols.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Quelle</label>
              <select
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="all">Alle</option>
                {uniqueSources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
              Keine News fuer die aktuelle Filterauswahl.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                        item.source === "social"
                          ? "bg-sky-50 text-sky-700 ring-sky-100"
                          : item.source === "onchain"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                          : "bg-slate-50 text-slate-700 ring-slate-200",
                      ].join(" ")}
                      title={
                        item.source === "social"
                          ? "Signale aus Social-Media-Daten (z. B. Twitter, Reddit)"
                          : item.source === "onchain"
                          ? "Signale aus On-Chain-Daten (Transaktionen, Adressen etc.)"
                          : "Signale aus Newsfeeds & Artikeln"
                      }
                    >
                      {item.source}
                    </span>
                    {item.timestamp && <time>{formatTimestamp(item.timestamp)}</time>}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold leading-snug text-slate-900">
                      {truncate(item.title, 140)}
                    </h3>
                    {item.summary ? (
                      <p className="text-sm leading-relaxed text-slate-600">
                        {truncate(item.summary, 200)}
                      </p>
                    ) : null}
                  </div>

                  {item.details ? (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.id)}
                      aria-expanded={expandedIds.has(item.id)}
                      className="text-left text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      {expandedIds.has(item.id) ? "Weniger anzeigen" : "Mehr anzeigen"}
                    </button>
                  ) : null}

                  {item.details && expandedIds.has(item.id) ? (
                    <p className="text-sm leading-relaxed text-slate-600">{item.details}</p>
                  ) : null}

                  {(item.tags?.length || item.symbols.length) && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.symbols.map((sym) => (
                        <span
                          key={`${item.id}-${sym}`}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                        >
                          {sym}
                        </span>
                      ))}
                      {item.tags
                        ?.filter((tag) => !(item.symbols ?? []).includes(tag))
                        .map((tag) => (
                          <span
                            key={`${item.id}-${tag}`}
                            className={[
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                              tag === "bullish"
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                : tag === "bearish"
                                ? "bg-rose-50 text-rose-700 ring-rose-100"
                                : "bg-slate-100 text-slate-700 ring-slate-200",
                            ].join(" ")}
                            title={
                              tag === "bullish"
                                ? "Überwiegend positive Signale im aktuellen Zeitraum"
                                : tag === "bearish"
                                ? "Überwiegend negative Signale im aktuellen Zeitraum"
                                : tag === "neutral"
                                ? "Gemischte oder ausgeglichene Signale"
                                : undefined
                            }
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
                      Quelle oeffnen →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
