import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { SentimentResponse, SentimentItem, SentimentTrend, SentimentBullet } from 'lib/sentiment/types';
import { isDailyCryptoSentiment, type AssetSentiment, type TopSignal } from '../../../lib/types';
import { filterAssetsByWhitelist, sortAssetsByWhitelistOrder } from '../../../lib/assets';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

async function loadLatestFile(): Promise<string | null> {
  const dir = join(process.cwd(), 'data', 'reports');
  try {
    const files = await readdir(dir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    if (jsonFiles.length === 0) return null;
    jsonFiles.sort();
    return join(dir, jsonFiles[jsonFiles.length - 1]!);
  } catch {
    return null;
  }
}

function normalizeScore(score: number): number {
  // map from [-1,1] -> [0,1]
  const s = (score + 1) / 2;
  return Math.max(0, Math.min(1, s));
}

function toTrend(sentiment: string): SentimentTrend {
  if (sentiment === 'bullish' || sentiment === 'neutral' || sentiment === 'bearish') return sentiment;
  return 'neutral';
}

function synthSparkline(seed: number): Array<{ t: number; c: number }> {
  const now = Date.now();
  const points: Array<{ t: number; c: number }> = [];
  let price = 100 + Math.floor(seed * 50);
  for (let i = 23; i >= 0; i--) {
    const t = now - i * 60 * 60 * 1000;
    const drift = (seed - 0.5) * 0.6;
    const noise = (Math.sin((i + seed) * 1.7) + Math.cos((i + seed) * 0.9)) * 0.5;
    price = Math.max(1, price + drift + noise);
    points.push({ t, c: Math.round(price * 100) / 100 });
  }
  return points;
}

export async function GET(req: Request): Promise<Response> {
  // Accept optional window param like 24h, 48h, etc. Currently used only for metadata.
  const url = new URL(req.url);
  const windowParam = url.searchParams.get('window') ?? '24h';
  const match = /^([0-9]+)h$/.exec(windowParam);
  const dataWindowHours = match ? Number(match[1]) : 24;

  const latestPath = await loadLatestFile();
  if (!latestPath) {
    const empty: SentimentResponse = {
      dateISO: new Date().toISOString().slice(0, 10),
      lastUpdatedISO: new Date().toISOString(),
      items: [],
      dataWindowHours,
    };
    return Response.json(empty, { headers: JSON_HEADERS });
  }

  const raw = await readFile(latestPath, 'utf8');
  const json = JSON.parse(raw) as unknown;
  if (!isDailyCryptoSentiment(json)) {
    return Response.json({ error: 'invalid stored report' }, { status: 500, headers: JSON_HEADERS });
  }

  const dateISO = json.date as string;
  const lastUpdatedISO = new Date().toISOString();

  const rawItems: SentimentItem[] = (json.assets as ReadonlyArray<AssetSentiment>).map((a, idx) => {
    const trend = toTrend(a.sentiment);
    const score01 = normalizeScore(a.score);
    const rawSignals: ReadonlyArray<TopSignal> = Array.isArray(a.top_signals) ? a.top_signals : [];
    const bullets: SentimentBullet[] = rawSignals.slice(0, 6).map((s) => ({
      group: s.source,
      text: s.evidence,
    }));
    const generatedAt = new Date().toISOString();
    const sparkline = synthSparkline(score01 + idx * 0.03);
    return {
      symbol: a.symbol,
      score: score01,
      confidence: Math.max(0, Math.min(1, a.confidence)),
      trend,
      bullets,
      generatedAt,
      sparkline,
    };
  });

  const items = sortAssetsByWhitelistOrder(filterAssetsByWhitelist(rawItems));
  const sourcesCount = items.reduce((acc, it) => acc + it.bullets.length, 0);

  const resp: SentimentResponse = {
    dateISO,
    lastUpdatedISO,
    nextRefreshETASeconds: 60 * 30, // placeholder 30 min
    items,
    dataWindowHours,
    sourcesCount,
  };

  return Response.json(resp, { headers: JSON_HEADERS });
}
