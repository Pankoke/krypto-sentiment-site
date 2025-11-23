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
      <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-slate-900">
            Heutige Marktstimmung: {labelText[label]} (Score {score.toFixed(2)})
          </div>
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600"
            title="Der Score kombiniert Signale aus Social Media, Newsfeeds und On-Chain-Daten. Für jedes Asset wird ein Wert zwischen 0 (bearish) und 1 (bullish) berechnet. Der globale Markt-Score ist der Durchschnitt aller berücksichtigten Assets."
          >
            i
          </span>
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
      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
        {[
          { range: "0.0–0.2", label: "stark bearish" },
          { range: "0.2–0.4", label: "leicht bearish" },
          { range: "0.4–0.6", label: "neutral" },
          { range: "0.6–0.8", label: "leicht bullish" },
          { range: "0.8–1.0", label: "stark bullish" },
        ].map((entry) => (
          <span
            key={entry.range}
            className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200"
          >
            <span className="mr-1 font-semibold text-slate-900">{entry.range}</span>
            <span className="text-slate-600">{entry.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
