import type { GlobalSentimentResult } from "lib/sentiment/aggregate";

type GlobalMarketBarProps = GlobalSentimentResult & {
  asOf?: string;
};

const labelText: Record<GlobalSentimentResult["label"], string> = {
  "very-bearish": "Sehr bearish",
  bearish: "Bearish",
  neutral: "Neutral",
  bullish: "Bullish",
  "very-bullish": "Sehr bullish",
};

export function GlobalMarketBar({ score, label, count, asOf }: GlobalMarketBarProps) {
  const percent = Math.max(0, Math.min(score, 1)) * 100;
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
        <div className="font-semibold text-slate-900">
          Heutige Marktstimmung: {labelText[label]} (Score {score.toFixed(2)})
        </div>
        <div className="text-xs text-slate-500">
          {count} Assets berücksichtigt{asOf ? ` · Stand: ${asOf}` : ""}
        </div>
      </div>
      <div
        className="relative h-4 overflow-hidden rounded-full bg-gradient-to-r from-rose-100 via-slate-100 to-emerald-100"
        title="Globaler Sentiment-Score (Durchschnitt der Asset-Scores)"
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-200 to-emerald-400 transition-all"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute inset-y-0 w-[2px] bg-slate-700/80"
          style={{ left: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Bärisch</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>
    </div>
  );
}
