import type { AggregatedReport } from "./aggregator";
import type { NewsItem } from "./types";

const truncate = (value: string, limit: number): string =>
  value.length > limit ? `${value.slice(0, limit - 3)}...` : value;

const sanitizeText = (value?: string): string => {
  if (!value) return "";
  // Remove anything starting with a JSON block
  const cutBeforeBrace = value.includes("{") ? value.slice(0, value.indexOf("{")) : value;
  const withoutJsonKeys = cutBeforeBrace.replace(/"[\w-]+":\s*[^,}]+/g, " ");
  const withoutBrackets = withoutJsonKeys.replace(/\[[^\]]*\]/g, " ");
  const singleLine = withoutBrackets.replace(/\s+/g, " ").trim();
  // Keep only the first couple of sentences to avoid model rambles
  const sentences = singleLine.split(/(?<=[.!?])\s+/).filter(Boolean);
  const condensed = sentences.slice(0, 2).join(" ");
  return condensed || singleLine;
};

export function snapshotToNewsItems(report: AggregatedReport, timestamp?: string): NewsItem[] {
  const items: NewsItem[] = [];
  const ts = timestamp ?? report.generatedAt ?? new Date().toISOString();

  for (const asset of report.assets) {
    const symbols = Array.from(new Set([asset.symbol].filter(Boolean)));
    const tags = Array.from(new Set([asset.symbol, asset.sentiment].filter(Boolean)));
    const summaryClean = sanitizeText(asset.rationale);
    const summary = summaryClean ? truncate(summaryClean, 220) : undefined;
    const detailBase = asset.rationale ? sanitizeText(asset.rationale) : "";

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
        details: detailBase ? truncate(detailBase, 400) : undefined,
      });
      continue;
    }

    asset.top_signals.forEach((sig, idx) => {
      const cleanEvidence = sanitizeText(sig.evidence);
      const title = truncate(cleanEvidence || asset.symbol, 140);
      const detailsCombined = `${cleanEvidence} ${detailBase}`.trim();
      items.push({
        id: `${asset.symbol}-${idx}`,
        source: sig.source ?? "signal",
        title,
        summary,
        timestamp: ts,
        symbols,
        sentiment: asset.sentiment,
        tags,
        details: detailsCombined ? truncate(detailsCombined, 420) : undefined,
      });
    });
  }

  return items;
}
