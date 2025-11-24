"use client";

import type { SentimentItem } from "lib/sentiment/types";
import type { AssetSentimentPoint } from "lib/news/snapshot";
import { Sparkline } from "./Sparkline";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";

interface SentimentCardProps {
  item: SentimentItem;
  historyPoints?: AssetSentimentPoint[];
}

const sentimentBadgeClasses: Record<SentimentItem["trend"], string> = {
  bullish: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  bearish: "bg-rose-50 text-rose-700 ring-rose-100",
};

const signalClassByGroup: Record<SentimentItem["bullets"][number]["group"], string> = {
  social: "bg-sky-50 text-sky-700 ring-sky-100",
  news: "bg-amber-50 text-amber-800 ring-amber-100",
  onchain: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

const truncate = (value: string, limit: number) =>
  value.length > limit ? `${value.slice(0, limit - 3)}...` : value;

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
  const limitedSignals = topSignals.slice(0, 4);
  const primaryRationale = topSignals[0]?.text ?? "";
  const truncatedRationale = primaryRationale ? truncate(primaryRationale, 180) : null;

  return (
    <Card className="flex h-full flex-col transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span>{item.symbol}</span>
            {item.name && <span className="text-xs font-medium text-slate-500">{item.name}</span>}
          </CardTitle>
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
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Sentiment-Score</p>
            <p className="text-2xl font-semibold text-slate-900">{item.score.toFixed(2)}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100">
            Vertrauen {confidencePercent}%
          </span>
        </div>

        {truncatedRationale && (
          <p className="text-xs leading-relaxed text-slate-600">{truncatedRationale}</p>
        )}

        {limitedSignals.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {limitedSignals.map((sig, index) => (
              <span
                key={`${sig.group}-${index}`}
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                  signalClassByGroup[sig.group] ?? "bg-slate-100 text-slate-700 ring-slate-200",
                ].join(" ")}
              >
                {sig.source ? `${sig.source}: ${truncate(sig.text, 80)}` : truncate(sig.text, 80)}
              </span>
            ))}
            {topSignals.length > limitedSignals.length && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                +{topSignals.length - limitedSignals.length} weitere
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-center border-t border-slate-100">
        <Sparkline data={sparklinePoints} />
      </CardFooter>
    </Card>
  );
}
