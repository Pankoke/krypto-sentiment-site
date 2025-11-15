import { NextResponse } from 'next/server';
import { latestNewsSnapshot } from '../../../lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function normalizeLocale(param?: string | null): 'de' | 'en' {
  return param === 'de' ? 'de' : 'en';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = normalizeLocale(url.searchParams.get('locale'));
  const snapshot = await latestNewsSnapshot(locale);
  if (snapshot) {
    return NextResponse.json(snapshot, { headers: JSON_HEADERS });
  }
  return NextResponse.json({ error: 'No snapshot available' }, { status: 404, headers: JSON_HEADERS });
}
