import { NextResponse } from 'next/server';
import { loadSnapshotForLocale } from '../../../lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function normalizeLocale(param?: string | null): 'de' | 'en' {
  return param === 'de' ? 'de' : 'en';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = normalizeLocale(url.searchParams.get('locale'));
  const result = await loadSnapshotForLocale(locale);
  if (result.snapshot) {
    const payload = {
      ...result.snapshot,
      _meta: {
        path: result.path,
        size: result.size,
        mtime: result.mtime,
        usedFallback: result.usedFallback,
        fallbackDate: result.fallbackDate,
        fallbackReason: result.fallbackReason,
        status: 'found',
      },
    };
    return NextResponse.json(payload, { headers: JSON_HEADERS });
  }
  const status = result.status === 'error' ? 500 : 404;
  return NextResponse.json(
    { error: result.reason ?? 'No snapshot available' },
    { status, headers: JSON_HEADERS }
  );
}
