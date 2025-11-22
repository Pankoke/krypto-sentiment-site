import type { AssetReport } from "./aggregator";

export type NewsItem = {
  id: string;
  source: string;
  title: string;
  summary?: string;
  timestamp?: string;
  symbols: string[];
  sentiment: AssetReport["sentiment"];
  tags?: string[];
  url?: string;
};
