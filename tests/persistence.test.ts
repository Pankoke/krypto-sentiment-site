import { beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { AggregatedReport } from 'lib/news/aggregator';
import type { DailySnapshot } from 'lib/persistence';

const TEST_DATA_DIR = join(process.cwd(), 'tmp-test-data', 'persistence');
const REPORT_DIR = join(TEST_DATA_DIR, 'reports');

async function writeJsonFile(path: string, data: unknown) {
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2), 'utf8');
}

describe('persistence utilities', () => {
  let listReportMetadata: typeof import('lib/persistence').listReportMetadata;
  let listSnapshotMetadata: typeof import('lib/news/snapshot').listSnapshotMetadata;
  let readSnapshot: typeof import('lib/persistence').readSnapshot;
  let clearNewsDates: typeof import('lib/cache/redis').clearNewsDates;
  let registerNewsDate: typeof import('lib/cache/redis').registerNewsDate;
  let setSnapshot: typeof import('lib/cache/redis').setSnapshot;
  let newsSnapshotKey: typeof import('lib/cache/redis').newsSnapshotKey;
  let closeRedis: typeof import('lib/cache/redis').closeRedis;

  beforeEach(async () => {
    process.env.GENERATE_DATA_DIR = TEST_DATA_DIR;
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
    vi.resetModules();
    ({ listReportMetadata, readSnapshot } = await import('lib/persistence'));
    ({ listSnapshotMetadata } = await import('lib/news/snapshot'));
    ({
      clearNewsDates,
      registerNewsDate,
      setSnapshot,
      newsSnapshotKey,
      closeRedis,
    } = await import('lib/cache/redis'));
    await clearNewsDates('de');
    await clearNewsDates('en');
  });

  afterAll(async () => {
    await rm(TEST_DATA_DIR, { recursive: true, force: true });
    await closeRedis();
  });

  it('listReportMetadata returns sorted raw reports with items and generatedAt', async () => {
    const reportA = {
      date: '2025-01-01',
      universe: ['BTC'],
      assets: [
        { symbol: 'BTC', sentiment: 'bullish', score: 0.7, confidence: 0.8, rationale: 'r', top_signals: [] },
      ],
      macro_summary: 'a',
      method_note: 'note',
      generatedAt: '2025-01-01T00:00:00.000Z',
    };
    const reportB = {
      ...reportA,
      date: '2025-01-02',
      assets: [
        { symbol: 'BTC', sentiment: 'bullish', score: 0.7, confidence: 0.8, rationale: 'r', top_signals: [] },
        { symbol: 'ETH', sentiment: 'neutral', score: 0.5, confidence: 0.5, rationale: 'r', top_signals: [] },
      ],
      generatedAt: '2025-01-02T00:00:00.000Z',
    };

    await mkdir(REPORT_DIR, { recursive: true });
    await writeJsonFile(join(REPORT_DIR, '2025-01-01.json'), reportA);
    await writeJsonFile(join(REPORT_DIR, '2025-01-02.json'), reportB);

    const metadata = await listReportMetadata(5);

    expect(metadata.length).toBe(2);
    expect(metadata[0]?.date).toBe('2025-01-02');
    expect(metadata[0]?.items).toBe(2);
    expect(metadata[0]?.generatedAt).toBe('2025-01-02T00:00:00.000Z');
    expect(metadata[1]?.date).toBe('2025-01-01');
    expect(metadata[1]?.items).toBe(1);
  });

  it('listReportMetadata returns empty array when no raw reports exist', async () => {
    await rm(REPORT_DIR, { recursive: true, force: true });
    const metadata = await listReportMetadata();
    expect(metadata).toEqual([]);
  });

  it('listSnapshotMetadata returns latest news snapshot from redis', async () => {
    const date = '2025-02-01';
    const snapshot: AggregatedReport = {
      date,
      universe: ['BTC'],
      assets: [{ symbol: 'BTC', sentiment: 'bullish', score: 0.8, confidence: 0.9, rationale: 'r', top_signals: [] }],
      method_note: 'note',
      adapterWarnings: [],
      uniqueAssets: 1,
      dedupeCount: 0,
      generatedAt: '2025-02-01T00:00:00.000Z',
    };

    await registerNewsDate('de', date);
    await setSnapshot(newsSnapshotKey('de', date), { ...snapshot, locale: 'de' });

    const metadata = await listSnapshotMetadata('de', 1);
    expect(metadata.length).toBe(1);
    expect(metadata[0]?.date).toBe(date);
    expect(metadata[0]?.items).toBe(1);
    expect(metadata[0]?.snapshot.locale).toBe('de');
  });

  it('readSnapshot reads localized snapshot file from disk', async () => {
    const date = '2025-03-01';
    const locale = 'de';
    const filePath = join(REPORT_DIR, `${date}.${locale}.json`);
    const snapshot: DailySnapshot = {
      date,
      locale,
      macro_summary: 'macro',
      assets: [
        {
          asset: 'BTC',
          subscores: { social: 0, news: 0, derivatives: 0, onChain: 0, price: 0 },
          weights: { social: 0.2, news: 0.2, derivatives: 0.2, onChain: 0.2, price: 0.2 },
          totalScore: 0,
          score01: 50,
          confidence: 80,
          confidenceDetails: { coverage: 1, diversity: 1, agreement: 1, stability: 1 },
          label: 'neutral',
          reasons: [],
          asOf: new Date().toISOString(),
          history: [],
        },
      ],
      complete: true,
      version: '1.0',
      generatedAt: '2025-03-01T00:00:00.000Z',
    };
    await writeJsonFile(filePath, snapshot);

    const loaded = await readSnapshot(date, locale);
    expect(loaded).not.toBeNull();
    expect(loaded?.date).toBe(date);
    expect(loaded?.locale).toBe(locale);
    expect(loaded?.assets[0]?.asset).toBe('BTC');
  });
});
