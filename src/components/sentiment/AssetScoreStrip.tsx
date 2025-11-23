import type { SentimentItem } from "lib/sentiment/types";

type AssetScoreStripProps = {
  items: SentimentItem[];
};

const sentimentClasses: Record<SentimentItem["trend"], string> = {
  bullish: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200",
  bearish: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function AssetScoreStrip({ items }: AssetScoreStripProps) {
  const uniqueItems = items.reduce<SentimentItem[]>((acc, curr) => {
    if (acc.find((it) => it.symbol === curr.symbol)) return acc;
    acc.push(curr);
    return acc;
  }, []);

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {uniqueItems.map((item) => {
        const percent = Math.max(0, Math.min(item.score, 1)) * 100;
        return (
          <div
            key={item.symbol}
            className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
            title={`${item.symbol} – Score ${item.score.toFixed(2)} (${item.trend})`}
          >
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold text-slate-900">{item.symbol}</span>
              <span
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                  sentimentClasses[item.trend],
                ].join(" ")}
                title={
                  item.trend === "bullish"
                    ? "Überwiegend positive Signale"
                    : item.trend === "bearish"
                    ? "Überwiegend negative Signale"
                    : "Gemischte oder ausgeglichene Signale"
                }
              >
                {item.trend}
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-slate-900/60"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-600">Score {item.score.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
}
