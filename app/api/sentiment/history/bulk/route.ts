import { NextResponse } from 'next/server';
import { getAssetHistory, type AssetSentimentPoint } from 'lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

type BulkHistoryEntry = {
  asset: string;
  points: AssetSentimentPoint[];
};

type BulkHistoryResponse = BulkHistoryEntry[];

function parseAssetList(param: string | null): string[] {
  if (!param) return [];
  return param
    .split(',')
    .map((asset) => asset.trim().toUpperCase())
    .filter(Boolean);
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const assets = parseAssetList(url.searchParams.get('assets'));
  const days = Math.min(Math.max(Number(url.searchParams.get('days') ?? '7') || 7, 1), 60);

  if (!assets.length) {
    return NextResponse.json(
      { error: 'Missing assets query parameter (comma-separated list).' },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  try {
    const results: BulkHistoryResponse = [];
    for (const asset of assets) {
      const points = await getAssetHistory(asset, days);
      results.push({ asset, points });
    }
    return NextResponse.json(results, { headers: JSON_HEADERS });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500, headers: JSON_HEADERS });
  }
}
