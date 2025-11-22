import type { AggregatedReport } from "./aggregator";
import type { NewsItem } from "./types";

const truncate = (value: string, limit: number): string =>
  value.length > limit ? `${value.slice(0, limit - 3)}...` : value;

const stripJsonLike = (value: string): string => {
  // Remove obvious JSON-ish blocks to keep UI text clean
  const withoutBraces = value.replace(/\{.*?\}/g, " ").replace(/\s+/g, " ").trim();
  return withoutBraces.length ? withoutBraces : value;
};

export function snapshotToNewsItems(report: AggregatedReport, timestamp?: string): NewsItem[] {
  const items: NewsItem[] = [];
  const ts = timestamp ?? report.generatedAt ?? new Date().toISOString();

  for (const asset of report.assets) {
    const symbols = [asset.symbol].filter(Boolean);
    const tags = [asset.symbol, asset.sentiment].filter(Boolean);
    const summary = asset.rationale ? truncate(stripJsonLike(asset.rationale), 220) : undefined;

    if (!asset.top_signals?.length) {
      items.push({
        id: `${asset.symbol}-summary`,
        source: "signal",
        title: truncate(summary ?? asset.symbol, 140),
        summary,
        timestamp: ts,
        symbols,
        sentiment: asset.sentiment,
        tags,
      });
      continue;
    }

    asset.top_signals.forEach((sig, idx) => {
      const cleanEvidence = truncate(stripJsonLike(sig.evidence ?? ""), 160);
      const title = cleanEvidence || asset.symbol;
      items.push({
        id: `${asset.symbol}-${idx}`,
        source: sig.source ?? "signal",
        title,
        summary,
        timestamp: ts,
        symbols,
        sentiment: asset.sentiment,
        tags,
      });
    });
  }

  return items;
}
