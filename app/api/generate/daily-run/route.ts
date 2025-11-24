import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { aggregateNews } from 'lib/news/aggregator';
import { hasNewsSnapshotForDate, persistDailyNewsSnapshots } from 'lib/news/snapshot';
import { fetchAllSources } from 'lib/sources';
import { runDailySentiment } from 'lib/sentiment';
import {
  acquireDailyRunLock,
  dailyRunLockKey,
  releaseDailyRunLock,
} from 'lib/cache/redis';
import { berlinDateString } from 'lib/timezone';
import { persistDailySnapshots } from 'lib/persistence';
import type { NormalizedSourceEntry } from '../../../../lib/types';
import { writeLog } from 'lib/monitoring/logs';
import { requireAdminSecret, AdminAuthError } from 'lib/admin/auth';
import { limitWithWindow } from 'lib/monitoring/rate-limit';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;
const LOCALES: Array<'de' | 'en'> = ['de', 'en'];
const LOCK_TTL_SECONDS = 60 * 60;

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

async function runNewsPart(posts: NormalizedSourceEntry[]) {
  const start = Date.now();
  const payload: Partial<NewsResult> = { ok: false, items: 0, warnings: [] };
  try {
    const report = await aggregateNews({ sourceEntries: posts, universe: undefined });
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

async function runReportsPart(posts: NormalizedSourceEntry[]) {
  const start = Date.now();
  const payload: Partial<ReportsResult> = { ok: false, assets: 0, warnings: [] };
  try {
    const sentiment = await runDailySentiment(posts);
    payload.ok = true;
    payload.assets = sentiment.assets.length;
    payload.report = sentiment;
  } catch (error) {
    payload.reason = error instanceof Error ? error.message : String(error);
  }
  return buildResult('reports', Date.now() - start, payload);
}

type DailyRunStatus = 'created' | 'updated' | 'skipped' | 'failed';

export async function GET(req: Request) {
  try {
    requireAdminSecret(req);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized', partial: false },
        { status: 401, headers: JSON_HEADERS }
      );
    }
    throw error;
  }

  const allowed = await limitWithWindow('daily-run', 3, 3600);
  if (!allowed) {
    await writeLog({
      level: 'warning',
      message: 'daily-run blocked by rate limit',
      context: 'api/generate-daily-run',
    });
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429, headers: JSON_HEADERS });
  }

  const dateBerlin = berlinDateString(new Date());
  const lockKey = dailyRunLockKey(dateBerlin);
  let lockAcquired = false;

  try {
    lockAcquired = await acquireDailyRunLock(lockKey, LOCK_TTL_SECONDS);
    if (!lockAcquired) {
      return NextResponse.json(
        {
          status: 'skipped',
          runStatus: 'skipped',
          reason: 'Daily run already in progress or recently completed for today',
          date: dateBerlin,
        },
        { status: 409, headers: JSON_HEADERS }
      );
    }

    const previousSnapshotExists = await hasNewsSnapshotForDate(dateBerlin);
    const start = Date.now();
    const posts = await fetchAllSources();
    const newsResult = await runNewsPart(posts);
    const reportsResult = await runReportsPart(posts);

    const partial = !(newsResult.ok && reportsResult.ok);
    const allFailed = !newsResult.ok && !reportsResult.ok;
    const status: 'ok' | 'partial' | 'fail' =
      newsResult.ok && reportsResult.ok ? 'ok' : partial ? 'partial' : 'fail';
    const runStatus: DailyRunStatus = newsResult.ok && reportsResult.ok
      ? previousSnapshotExists
        ? 'updated'
        : 'created'
      : 'failed';

    if (newsResult.report) {
      await persistDailyNewsSnapshots(newsResult.report, { force: true });
    }
    if (reportsResult.report) {
      await persistDailySnapshots(reportsResult.report);
    }

    const response = {
      runStatus,
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

    await writeLog({
      level: 'info',
      message: `Daily run ${runStatus}`,
      context: 'api/generate-daily-run',
    });

    return NextResponse.json(response, {
      headers: JSON_HEADERS,
      status: allFailed ? 500 : 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await writeLog({
      level: 'error',
      message: `Daily run failed: ${message}`,
      context: 'api/generate-daily-run',
    });
    return NextResponse.json(
      {
        status: 'fail',
        runStatus: 'failed',
        date: dateBerlin,
        reason: message,
      },
      { status: 500, headers: JSON_HEADERS }
    );
  } finally {
    if (lockAcquired) {
      await releaseDailyRunLock(lockKey);
    }
  }
}
