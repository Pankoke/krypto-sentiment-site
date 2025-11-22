"use client";

import type { SentimentItem } from "lib/sentiment/types";
import type { AssetSentimentPoint } from "lib/news/snapshot";
import { Sparkline } from "./Sparkline";

interface SentimentCardProps {
  item: SentimentItem;
  historyPoints?: AssetSentimentPoint[];
}

const sentimentBadgeClasses: Record<SentimentItem["trend"], string> = {
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

  const sentimentLabel =
    item.trend === "bullish" ? "Bullish" : item.trend === "bearish" ? "Bearish" : "Neutral";
  const confidencePercent = Math.round((item.confidence ?? 0) * 100);
  const topSignals = item.bullets ?? [];

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">{item.symbol}</span>
            {item.name && <span className="text-xs font-medium text-slate-500">{item.name}</span>}
          </div>
          {item.category && <p className="mt-1 text-xs text-slate-500">{item.category}</p>}
        </div>
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
            sentimentBadgeClasses[item.trend],
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
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100">
          Vertrauen: {confidencePercent}%
        </span>
      </div>

      {item.bullets.length > 0 && (
        <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.bullets[0]?.text}</p>
      )}

      {topSignals.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topSignals.map((sig) => (
            <span
              key={`${sig.group}-${sig.text}`}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
            >
              {sig.source ? `${sig.source}: ${sig.text}` : sig.text}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1">
        <Sparkline data={sparklinePoints} />
      </div>
    </article>
  );
}

