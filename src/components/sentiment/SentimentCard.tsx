"use client";

import type { SentimentItem } from "lib/sentiment/types";
import type { AssetSentimentPoint } from "lib/news/snapshot";
import { Sparkline } from "./Sparkline";

interface SentimentCardProps {
  item: SentimentItem;
  historyPoints?: AssetSentimentPoint[];
}

const sentimentBadgeClasses: Record<SentimentItem["sentiment"], string> = {
  bullish: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  bearish: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function SentimentCard({ item, historyPoints }: SentimentCardProps) {
  const sparklinePoints = historyPoints?.length
    ? historyPoints.map((point) => ({
        t: new Date(point.date).getTime(),
        c: point.score,
      }))
    : item.sparkline;

  const change24h = item.change24h ?? 0;
  const sentimentLabel =
    item.sentiment === "bullish" ? "Bullish" : item.sentiment === "bearish" ? "Bearish" : "Neutral";
  const confidencePercent = Math.round((item.confidence ?? 0) * 100);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">{item.symbol}</span>
            {item.name && <span className="text-xs font-medium text-slate-500">{item.name}</span>}
          </div>
          {item.category && <p className="mt-1 text-xs text-slate-500">{item.category}</p>}
          <p className="mt-1 text-xs text-slate-500">
            Confidence {confidencePercent}%
          </p>
        </div>
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
            sentimentBadgeClasses[item.sentiment],
          ].join(" ")}
        >
          {sentimentLabel}
        </span>
      </header>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Sentiment-Score</p>
          <p className="text-2xl font-semibold text-slate-900">{item.score.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-400">24h Änderung</p>
          <p
            className={
              change24h > 0
                ? "text-sm font-medium text-emerald-600"
                : change24h < 0
                ? "text-sm font-medium text-rose-600"
                : "text-sm font-medium text-slate-500"
            }
          >
            {change24h > 0 ? "+" : ""}
            {change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-1">
        <Sparkline data={sparklinePoints} />
      </div>
    </article>
  );
}
