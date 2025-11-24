import { NextResponse } from 'next/server';
import { getLatestSentimentFromSnapshots } from 'lib/news/snapshot';
import type { SentimentItem, SentimentResponse, SentimentTrend } from 'lib/sentiment/types';
import { filterAssetsByWhitelist, sortAssetsByWhitelistOrder } from 'lib/assets';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function toTrend(sentiment: string): SentimentTrend {
  if (sentiment === 'bullish' || sentiment === 'neutral' || sentiment === 'bearish') return sentiment;
  return 'neutral';
}

function determineLocale(request: Request): 'de' | 'en' {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get('locale');
  if (queryLocale === 'en') return 'en';
  return 'de';
}

export async function GET(request: Request): Promise<Response> {
  const locale = determineLocale(request);
  const latest = await getLatestSentimentFromSnapshots(locale);
  if (!latest) {
    return NextResponse.json({ error: 'No sentiment snapshot available' }, { status: 404, headers: JSON_HEADERS });
  }

  const items: SentimentItem[] = latest.assets.map((asset) => ({
    symbol: asset.ticker,
    score: Math.max(0, Math.min(1, asset.score)),
    confidence: Math.max(0, Math.min(1, asset.confidence ?? 0)),
    trend: toTrend(asset.sentiment ?? 'neutral'),
    bullets: [],
    generatedAt: latest.timestamp,
    sparkline: [],
  }));

  const ordered = sortAssetsByWhitelistOrder(filterAssetsByWhitelist(items));
  const response: SentimentResponse = {
    dateISO: latest.timestamp,
    lastUpdatedISO: latest.timestamp,
    items: ordered,
    dataWindowHours: 24,
    sourcesCount: 0,
  };

  return NextResponse.json(response, { headers: JSON_HEADERS });
}
