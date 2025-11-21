import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const TEST_DATA_DIR = join(process.cwd(), 'tmp-test-data', 'health');
const REPORT_DIR = join(TEST_DATA_DIR, 'reports');

describe('health endpoint integration', () => {
  let healthGet: typeof import('../app/api/health/route').GET;
  let registerNewsDate: typeof import('../lib/cache/redis').registerNewsDate;
  let setSnapshot: typeof import('../lib/cache/redis').setSnapshot;
  let newsSnapshotKey: typeof import('../lib/cache/redis').newsSnapshotKey;
  let clearNewsDates: typeof import('../lib/cache/redis').clearNewsDates;
  let closeRedis: typeof import('../lib/cache/redis').closeRedis;

  beforeEach(async () => {
    process.env.GENERATE_DATA_DIR = TEST_DATA_DIR;
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
    vi.resetModules();
    ({ registerNewsDate, setSnapshot, newsSnapshotKey, clearNewsDates, closeRedis } = await import('../lib/cache/redis'));
    await clearNewsDates('de');
    await clearNewsDates('en');
    ({ GET: healthGet } = await import('../app/api/health/route'));
  });

  afterAll(async () => {
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
    if (closeRedis) {
      await closeRedis();
    }
  });

  it('liefert warming_up/missing wenn keine Reports/Snapshots vorhanden sind', async () => {
    const response = await healthGet(new Request('http://localhost/api/health'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.status).toBe('warming_up');
    expect(payload.news.status).toBe('missing');
    expect(payload.reports.status).toBe('missing');
    expect(payload.reports.lastSnapshotDate).toBeNull();
  });

  it('liefert ok/gefunden wenn Report und News-Snapshot existieren', async () => {
    const date = '2025-12-01';
    await mkdir(REPORT_DIR, { recursive: true });
    const report = {
      date,
      universe: ['BTC'],
      assets: [
        {
          symbol: 'BTC',
          sentiment: 'bullish',
          score: 0.6,
          confidence: 0.7,
          rationale: 'r',
          top_signals: [],
        },
      ],
      macro_summary: 'ms',
      method_note: 'note',
      generatedAt: new Date().toISOString(),
    };
    await writeFile(join(REPORT_DIR, `${date}.json`), JSON.stringify(report, null, 2), 'utf8');

    await registerNewsDate('de', date);
    await setSnapshot(
      newsSnapshotKey('de', date),
      {
        date,
        universe: ['BTC'],
        assets: [{ symbol: 'BTC', sentiment: 'bullish', score: 0.6, confidence: 0.7, rationale: 'r', top_signals: [] }],
        method_note: 'note',
        generatedAt: new Date().toISOString(),
        locale: 'de',
      }
    );

    const response = await healthGet(new Request('http://localhost/api/health'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.status === 'ok' || payload.status === 'partial').toBe(true);
    expect(payload.reports.status).toBe('found');
    expect(payload.reports.lastSnapshotDate).toBe(date);
    expect(payload.reports.itemsCount).toBe(1);
    expect(payload.news.status).toBe('found');
  });
});
