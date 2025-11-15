import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { aggregateNews } from '../../../../lib/news/aggregator';
import { persistDailyNewsSnapshots } from '../../../../lib/news/snapshot';
import { generateDailyReport, DailyGenerateMode } from '../../../../lib/daily/generator';
import { berlinDateString } from '../../../../lib/timezone';
import { saveDailyRunMetrics, writeDailyRunDumpMetrics } from '../../../../lib/generate/metrics';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;
const LOCALES: Array<'de' | 'en'> = ['de', 'en'];

function getSecret() {
  return (
    process.env.CRON_SECRET ??
    process.env.NEWS_GENERATE_SECRET ??
    process.env.DAILY_GENERATE_SECRET ??
    null
  );
}

type PartResultBase = {
  ok: boolean;
  warnings: string[];
  reason?: string;
};

type NewsResult = PartResultBase & {
  name: 'news';
  durationMs: number;
  items: number;
  localeCount?: number;
};

type ReportsResult = PartResultBase & {
  name: 'reports';
  durationMs: number;
  assets: number;
  skipped?: boolean;
};

function buildResult(name: 'news', durationMs: number, payload: Partial<NewsResult>): NewsResult;
function buildResult(name: 'reports', durationMs: number, payload: Partial<ReportsResult>): ReportsResult;
function buildResult(
  name: 'news' | 'reports',
  durationMs: number,
  payload: Partial<NewsResult> | Partial<ReportsResult>
) {
  return {
    name,
    durationMs,
    warnings: [],
    ...payload,
  };
}

async function runNewsPart(mode: DailyGenerateMode, options?: { forceSnapshot?: boolean }) {
  const start = Date.now();
  const payload: Partial<NewsResult> = { ok: false, items: 0, warnings: [] };
  try {
    const report = await aggregateNews();
    const warnings = [
      ...(report.method_note ? [report.method_note] : []),
      ...(report.adapterWarnings ?? []),
    ];
    const forceSnapshot = options?.forceSnapshot ?? mode === 'overwrite';
    await persistDailyNewsSnapshots(report, { force: forceSnapshot });
    payload.ok = true;
    payload.items = report.assets.length;
    payload.warnings = warnings;
    payload.localeCount = LOCALES.length;
  } catch (error) {
    payload.reason = error instanceof Error ? error.message : String(error);
  }
  return buildResult('news', Date.now() - start, payload);
}

async function runReportsPart(mode: DailyGenerateMode, berlinDate: string) {
  const start = Date.now();
  const payload: Partial<ReportsResult> = { ok: false, assets: 0, warnings: [] };
  try {
    const { report, skipped } = await generateDailyReport({ mode, date: berlinDate });
    payload.ok = true;
    payload.assets = report.assets.length;
    payload.skipped = skipped;
  } catch (error) {
    payload.reason = error instanceof Error ? error.message : String(error);
  }
  return buildResult('reports', Date.now() - start, payload);
}

export async function GET(req: Request) {
  const secret = getSecret();
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? req.headers.get('x-cron-secret');
  if (!secret || key !== secret) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized', partial: false },
      { status: 401, headers: JSON_HEADERS }
    );
  }

  const requestedMode = url.searchParams.get('mode');
  const isDump = requestedMode === 'dump';
  const mode: DailyGenerateMode = requestedMode === 'skip' ? 'skip' : 'overwrite';
  const dateBerlin = berlinDateString(new Date());
  const start = Date.now();

  const newsResult = await runNewsPart(mode, {
    forceSnapshot: isDump || mode === 'overwrite',
  });
  const reportsResult = await runReportsPart(mode, dateBerlin);

  const partial = !(newsResult.ok && reportsResult.ok);
  const allFailed = !newsResult.ok && !reportsResult.ok;
  const status: 'ok' | 'partial' | 'fail' =
    newsResult.ok && reportsResult.ok ? 'ok' : partial ? 'partial' : 'fail';
  const response = {
    date: dateBerlin,
    locales: LOCALES,
    news: newsResult,
    reports: reportsResult,
    partial: partial && !allFailed,
    durationMs: Date.now() - start,
  };

  await revalidateTag('news-daily');
  await revalidateTag('reports-daily');
  console.info('daily-run summary', {
    dateBerlin,
    partial: response.partial,
    durationMs: response.durationMs,
    newsItems: newsResult.items,
    assets: reportsResult.assets,
    dumpMode: isDump,
  });

  await saveDailyRunMetrics({
    date: dateBerlin,
    locales: LOCALES,
    news: {
      ok: newsResult.ok,
      items: newsResult.items ?? 0,
      warnings: newsResult.warnings ?? [],
      durationMs: newsResult.durationMs ?? 0,
    },
    reports: {
      ok: reportsResult.ok,
      assets: reportsResult.assets ?? 0,
      warnings: reportsResult.warnings ?? [],
      durationMs: reportsResult.durationMs ?? 0,
    },
    partial,
    durationMs: response.durationMs,
    status,
  });

  if (isDump) {
    const dumpMetrics = {
      date: dateBerlin,
      locales: LOCALES,
      newsItemsDE: newsResult.items ?? 0,
      newsItemsEN: newsResult.items ?? 0,
      assetsCount: reportsResult.assets ?? 0,
      partial: response.partial,
      durationMs: response.durationMs,
      commit:
        process.env.VERCEL_GIT_COMMIT_SHA ??
        process.env.GITHUB_SHA ??
        process.env.GITHUB_REF?.split('/').pop() ??
        'unknown',
    };
    try {
      await writeDailyRunDumpMetrics(dumpMetrics);
    } catch (error) {
      console.warn('Failed to write dump metrics', error);
    }
  }

  return NextResponse.json(response, {
    headers: JSON_HEADERS,
    status: allFailed ? 500 : 200,
  });
}
