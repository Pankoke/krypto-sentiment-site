import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { aggregateNews } from '../../../../lib/news/aggregator';
import { fetchAllSources } from '../../../../lib/sources';
import { runDailySentiment } from '../../../../lib/sentiment';
import { berlinDateString } from '../../../../lib/timezone';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;
const LOCALES: Array<'de' | 'en'> = ['de', 'en'];

type PartResultBase = {
  ok: boolean;
  warnings: string[];
  reason?: string;
};

type NewsResult = PartResultBase & {
  name: 'news';
  durationMs: number;
  items: number;
  report?: Awaited<ReturnType<typeof aggregateNews>>;
};

type ReportsResult = PartResultBase & {
  name: 'reports';
  durationMs: number;
  assets: number;
  report?: Awaited<ReturnType<typeof runDailySentiment>>;
};

function buildResult(name: 'news', durationMs: number, payload: Partial<NewsResult>): NewsResult;
function buildResult(
  name: 'reports',
  durationMs: number,
  payload: Partial<ReportsResult>
): ReportsResult;
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

async function runNewsPart() {
  const start = Date.now();
  const payload: Partial<NewsResult> = { ok: false, items: 0, warnings: [] };
  try {
    const report = await aggregateNews();
    const warnings = [
      ...(report.method_note ? [report.method_note] : []),
      ...(report.adapterWarnings ?? []),
    ];
    payload.ok = true;
    payload.items = report.assets.length;
    payload.warnings = warnings;
    payload.report = report;
  } catch (error) {
    payload.reason = error instanceof Error ? error.message : String(error);
  }
  return buildResult('news', Date.now() - start, payload);
}

async function runReportsPart() {
  const start = Date.now();
  const payload: Partial<ReportsResult> = { ok: false, assets: 0, warnings: [] };
  try {
    const posts = await fetchAllSources();
    const sentiment = await runDailySentiment(posts);
    payload.ok = true;
    payload.assets = sentiment.assets.length;
    payload.report = sentiment;
  } catch (error) {
    payload.reason = error instanceof Error ? error.message : String(error);
  }
  return buildResult('reports', Date.now() - start, payload);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? req.headers.get('x-cron-secret');
  const secret = process.env.CRON_SECRET ?? process.env.NEWS_GENERATE_SECRET ?? null;
  if (!secret || key !== secret) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized', partial: false },
      { status: 401, headers: JSON_HEADERS }
    );
  }

  const start = Date.now();
  const dateBerlin = berlinDateString(new Date());

  const newsResult = await runNewsPart();
  const reportsResult = await runReportsPart();

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
    status,
  };

  await revalidateTag('news-daily');
  await revalidateTag('reports-daily');
  console.info('daily-run summary', {
    dateBerlin,
    partial: response.partial,
    durationMs: response.durationMs,
  });

  return NextResponse.json(response, {
    headers: JSON_HEADERS,
    status: allFailed ? 500 : 200,
  });
}
