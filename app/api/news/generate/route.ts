import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { aggregateNews } from '../../../../lib/news/aggregator';
import {
  persistDailyNewsSnapshots,
  latestNewsSnapshot,
} from '../../../../lib/news/snapshot';
import { saveNewsMetrics } from '../../../../lib/news/metrics';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

function normalizeLocale(param?: string | null): 'de' | 'en' {
  return param === 'de' ? 'de' : 'en';
}

type GenerateMode = 'overwrite' | 'skip';

async function triggerAlert(durationMs: number, itemCount: number) {
  const maxDuration = Number(process.env.NEWS_ALERT_MAX_MS ?? 5000);
  const minItems = Number(process.env.NEWS_ALERT_MIN_ITEMS ?? 1);
  if (durationMs <= maxDuration && itemCount >= minItems) {
    return;
  }
  const webhook = process.env.NEWS_ALERT_WEBHOOK;
  if (!webhook) {
    console.warn('Alert condition met but NEWS_ALERT_WEBHOOK is not configured.');
    return;
  }
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alert: 'news-generate',
      durationMs,
      itemCount,
      threshold: { maxDuration, minItems },
    }),
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode: GenerateMode = url.searchParams.get('mode') === 'skip' ? 'skip' : 'overwrite';
  const locale = normalizeLocale(url.searchParams.get('locale'));

  if (mode === 'skip') {
    const existing = await latestNewsSnapshot(locale);
    if (existing) {
      return NextResponse.json(
        { ok: true, skipped: true, date: existing.date, assets: existing.assets.length },
        { headers: JSON_HEADERS }
      );
    }
  }

  const start = Date.now();
  try {
    const report = await aggregateNews({ universe: undefined });
    await persistDailyNewsSnapshots(report, { force: true });
    const durationMs = Date.now() - start;
    const unique = new Set(report.assets.map((asset) => asset.symbol)).size;
    const dedupeRatio = report.assets.length ? unique / report.assets.length : 0;
    const warnings: string[] = [
      ...(report.method_note ? [report.method_note] : []),
      ...(report.adapterWarnings ?? []),
    ];
    await saveNewsMetrics({
      timestamp: new Date().toISOString(),
      durationMs,
      items: report.assets.length,
      dedupeRatio,
      warnings,
    });
    console.info('News-Generate Duration', durationMs);
    console.info('Items total', report.assets.length);
    console.info('Dedupe Ratio', dedupeRatio);
    if (report.adapterWarnings?.length) {
      console.warn('Adapter warnings', report.adapterWarnings);
    }
    if (warnings.length) {
      console.warn('News warnings', warnings);
    }
    await triggerAlert(durationMs, report.assets.length);
    revalidateTag('news-daily');
    return NextResponse.json(
      {
        ok: true,
        date: report.date,
        assets: report.assets.length,
        dedupeRatio,
        warnings,
      },
      { headers: JSON_HEADERS }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500, headers: JSON_HEADERS });
  }
}
