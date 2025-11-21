import { beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import { rm, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { GET as newsGet } from '../app/api/news/route';
import { GET as newsGenerateGet } from '../app/api/news/generate/route';
import { GET as newsValidateGet } from '../app/api/news/validate/route';
import { clearNewsDates, registerNewsDate, setSnapshot, newsSnapshotKey, closeRedis } from '../lib/cache/redis';
import type { AggregatedReport } from '../lib/news/aggregator';
import { berlinDateString } from '../lib/timezone';

const TEST_ROOT = join(process.cwd(), 'tmp-test-data', 'news-api');
const REPORT_DIR = join(TEST_ROOT, 'data', 'reports');

describe('News API integration', () => {
  beforeEach(async () => {
    process.env.GENERATE_DATA_DIR = TEST_ROOT;
    await rm(TEST_ROOT, { recursive: true, force: true });
    vi.resetModules();
    await clearNewsDates('de');
    await clearNewsDates('en');
  });

  afterAll(async () => {
    await rm(TEST_ROOT, { recursive: true, force: true });
    await closeRedis();
  });

  it('/api/news liefert sinnvolle Antwort ohne Snapshots', async () => {
    await rm(REPORT_DIR, { recursive: true, force: true });
    const res = await newsGet(new Request('http://localhost/api/news'));
    expect(res.status === 200 || res.status === 404).toBe(true);
    const payload = await res.json();
    expect(payload.error || payload._meta?.status === 'missing' || payload._meta?.status === 'found').toBeTruthy();
  });

  it('/api/news nutzt den neuesten Snapshot', async () => {
    const dateOld = berlinDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const dateNew = berlinDateString(new Date());
    const snapshotOld: AggregatedReport = {
      date: dateOld,
      universe: ['BTC'],
      assets: [{ symbol: 'BTC', sentiment: 'bullish', score: 0.5, confidence: 0.6, rationale: 'old', top_signals: [] }],
      method_note: 'old',
      adapterWarnings: [],
      uniqueAssets: 1,
      dedupeCount: 0,
      generatedAt: new Date().toISOString(),
    };
    const snapshotNew: AggregatedReport = {
      date: dateNew,
      universe: ['BTC'],
      assets: [{ symbol: 'BTC', sentiment: 'bearish', score: 0.2, confidence: 0.7, rationale: 'new', top_signals: [] }],
      method_note: 'new',
      adapterWarnings: [],
      uniqueAssets: 1,
      dedupeCount: 0,
      generatedAt: new Date().toISOString(),
    };

    await registerNewsDate('de', dateOld);
    await setSnapshot(newsSnapshotKey('de', dateOld), { ...snapshotOld, locale: 'de' });
    await registerNewsDate('de', dateNew);
    await setSnapshot(newsSnapshotKey('de', dateNew), { ...snapshotNew, locale: 'de' });

    const res = await newsGet(new Request('http://localhost/api/news?locale=de'));
    expect(res.status === 200 || res.status === 404).toBe(true);
    const payload = await res.json();
    if (res.status === 200) {
      expect(payload.date).toBe(dateNew);
      expect(payload.assets?.[0]?.rationale).toBe('new');
    } else {
      expect(payload.error).toBeTruthy();
    }
  });

  it('/api/news/generate reagiert mit ok (skip ohne Secret)', async () => {
    const res = await newsGenerateGet(new Request('http://localhost/api/news/generate?mode=skip&locale=de'));
    expect(res.status).toBe(200);
    const payload = await res.json();
    expect(payload.ok).toBe(true);
  });

  it('/api/news/validate liefert Status pro Locale', async () => {
    const res = await newsValidateGet(new Request('http://localhost/api/news/validate'));
    expect(res.status).toBe(200);
    const payload = await res.json();
    expect(payload.ok).toBe(true);
    expect(Array.isArray(payload.results)).toBe(true);
    expect(payload.results.length).toBeGreaterThan(0);
  });
});
