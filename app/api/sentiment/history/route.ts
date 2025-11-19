import { NextResponse } from 'next/server';
import { getAssetHistory } from '../../../../lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const asset = (url.searchParams.get('asset') ?? '').trim().toUpperCase();
  const daysParam = Number(url.searchParams.get('days') ?? '7');
  if (!asset) {
    return NextResponse.json(
      { error: 'Missing asset query parameter' },
      { status: 400, headers: JSON_HEADERS }
    );
  }
  const days = Math.min(Math.max(daysParam, 1), 60);
  const points = await getAssetHistory(asset, days);
  return NextResponse.json(
    { asset, points },
    { headers: JSON_HEADERS }
  );
}
