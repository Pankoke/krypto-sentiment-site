import { NextResponse } from 'next/server';
import { getSnapshotHistory } from 'lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const daysParam = Number(searchParams.get('days') ?? '30');
  const daysBack = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 90));
  const history = await getSnapshotHistory(daysBack);
  return NextResponse.json(history, { headers: JSON_HEADERS });
}
