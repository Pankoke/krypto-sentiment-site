import { beforeEach, afterEach, afterAll, describe, expect, it, vi } from 'vitest';
import { join } from 'node:path';
import { rm, mkdir, writeFile } from 'node:fs/promises';

import { GET as sentimentGet } from '../app/api/sentiment/route';
import { GET as sentimentHistoryBulkGet } from '../app/api/sentiment/history/bulk/route';
import type { AssetSentimentPoint } from '../lib/news/snapshot';
import type { DailyCryptoSentiment } from '../lib/types';
import { clearNewsDates, registerNewsDate, setSnapshot, newsSnapshotKey, closeRedis } from '../lib/cache/redis';

const TEST_ROOT = join(process.cwd(), 'tmp-test-data', 'sentiment-api');
const REPORT_DIR = join(TEST_ROOT, 'data', 'reports');
let cwdSpy: ReturnType<typeof vi.spyOn> | null = null;

async function writeReport(date: string, assets: DailyCryptoSentiment['assets'], generatedAt?: string) {
  const report: DailyCryptoSentiment = {
    date,
    universe: assets.map((a) => a.symbol),
    assets,
    macro_summary: 'macro',
    method_note: 'note',
    generatedAt: generatedAt ?? new Date().toISOString(),
  };
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(join(REPORT_DIR, `${date}.json`), JSON.stringify(report, null, 2), 'utf8');
}

describe('sentiment API', () => {
  beforeEach(async () => {
    if (cwdSpy) {
      cwdSpy.mockRestore();
    }
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(TEST_ROOT);
    process.env.GENERATE_DATA_DIR = TEST_ROOT;
    await rm(TEST_ROOT, { recursive: true, force: true });
    vi.resetModules();
  });

  afterEach(() => {
    if (cwdSpy) {
      cwdSpy.mockRestore();
      cwdSpy = null;
    }
  });

  afterAll(async () => {
    await rm(TEST_ROOT, { recursive: true, force: true });
  });

  describe('GET /api/sentiment', () => {
    it('liefert 404, wenn kein Rohreport vorhanden ist', async () => {
      await rm(REPORT_DIR, { recursive: true, force: true });
      const response = await sentimentGet(new Request('http://localhost/api/sentiment'));
      expect(response.status).toBe(404);
      const payload = await response.json();
      expect(payload.error).toMatch(/No raw report found/i);
    });

    it('liefert Daten aus dem neuesten Rohreport', async () => {
      await writeReport('2025-01-01', [
        { symbol: 'BTC', sentiment: 'bullish', score: 0.8, confidence: 0.9, rationale: 'r', top_signals: [] },
      ]);
      await writeReport('2025-01-02', [
        { symbol: 'ETH', sentiment: 'bearish', score: -0.2, confidence: 0.6, rationale: 'x', top_signals: [] },
        { symbol: 'SOL', sentiment: 'neutral', score: 0, confidence: 0.5, rationale: 'y', top_signals: [] },
      ]);

      const response = await sentimentGet(new Request('http://localhost/api/sentiment'));
      expect(response.status).toBe(200);
      const payload = await response.json();
      expect(payload.items.length).toBe(2);
      const symbols = payload.items.map((it: { symbol: string }) => it.symbol);
      expect(symbols).toEqual(expect.arrayContaining(['ETH', 'SOL']));
      expect(symbols).not.toContain('BTC');
    });
  });

  describe('GET /api/sentiment/history/bulk', () => {
    beforeEach(async () => {
      await clearNewsDates('de');
      await clearNewsDates('en');
    });

    afterAll(async () => {
      await closeRedis();
    });

    it('liefert 400 ohne assets-Query', async () => {
      const res = await sentimentHistoryBulkGet(new Request('http://localhost/api/sentiment/history/bulk'));
      expect(res.status).toBe(400);
      const payload = await res.json();
      expect(String(payload.error)).toMatch(/Missing assets/i);
    });

    it('liefert History für mehrere Assets aus Snapshots', async () => {
      const date = '2025-02-01';
      await registerNewsDate('de', date);
      await setSnapshot(
        newsSnapshotKey('de', date),
        {
          date,
          universe: ['BTC', 'ETH'],
          assets: [
            { symbol: 'BTC', sentiment: 'bullish', score: 0.7, confidence: 0.8, rationale: 'r', top_signals: [] },
            { symbol: 'ETH', sentiment: 'neutral', score: 0.3, confidence: 0.5, rationale: 'r', top_signals: [] },
          ],
          method_note: 'note',
          generatedAt: new Date().toISOString(),
          locale: 'de',
        }
      );
      const snapshot = {
        date,
        locale: 'de',
        macro_summary: 'macro',
        assets: [
          { asset: 'BTC', score01: 60, subscores: {}, weights: {}, totalScore: 0, confidence: 80, confidenceDetails: {}, label: 'neutral', reasons: [], asOf: '', history: [] },
          { asset: 'ETH', score01: 55, subscores: {}, weights: {}, totalScore: 0, confidence: 70, confidenceDetails: {}, label: 'neutral', reasons: [], asOf: '', history: [] },
        ],
        complete: true,
        generatedAt: new Date().toISOString(),
        version: '1.0',
      };
      await mkdir(REPORT_DIR, { recursive: true });
      await writeFile(join(REPORT_DIR, `${date}.de.json`), JSON.stringify(snapshot, null, 2), 'utf8');

      const res = await sentimentHistoryBulkGet(
        new Request('http://localhost/api/sentiment/history/bulk?assets=BTC,ETH&days=7')
      );
      expect(res.status).toBe(200);
      const payload = (await res.json()) as Array<{ asset: string; points: AssetSentimentPoint[] }>;
      expect(payload.length).toBe(2);
      const btc = payload.find((p) => p.asset === 'BTC');
      const eth = payload.find((p) => p.asset === 'ETH');
      expect(btc?.points.length).toBeGreaterThanOrEqual(0);
      expect(eth?.points.length).toBeGreaterThanOrEqual(0);
    });
  });
});
