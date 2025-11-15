import { NextResponse } from 'next/server';
import { loadSnapshotForLocale } from '../../../../lib/news/snapshot';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export async function GET() {
  const locales: Array<'de' | 'en'> = ['de', 'en'];
  const results = [];
  for (const locale of locales) {
    const snapshotResult = await loadSnapshotForLocale(locale);
    results.push({
      locale,
      status: snapshotResult.status,
      date: snapshotResult.snapshot?.date ?? null,
      usedFallback: snapshotResult.usedFallback ?? false,
      reason: snapshotResult.reason ?? null,
    });
  }
  return NextResponse.json({ ok: true, results }, { headers: JSON_HEADERS });
}
