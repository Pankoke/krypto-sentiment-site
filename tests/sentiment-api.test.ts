import { beforeEach, afterAll, describe, expect, it } from 'vitest';

import { GET as sentimentGet } from '../app/api/sentiment/route';
import { GET as sentimentHistoryBulkGet } from '../app/api/sentiment/history/bulk/route';
import type { AssetSentimentPoint } from '../lib/news/snapshot';
import { clearNewsDates, registerNewsDate, setSnapshot, newsSnapshotKey, closeRedis } from '../lib/cache/redis';

describe('sentiment API', () => {
  beforeEach(async () => {
    await clearNewsDates('de');
    await clearNewsDates('en');
  });

  afterAll(async () => {
    await clearNewsDates('de');
    await clearNewsDates('en');
    await closeRedis();
  });

  describe('GET /api/sentiment', () => {
    it('liefert 404, wenn kein Snapshot vorhanden ist', async () => {
      const response = await sentimentGet(new Request('http://localhost/api/sentiment'));
      expect(response.status).toBe(404);
      const payload = await response.json();
      expect(payload.error).toMatch(/No sentiment snapshot available/i);
    });

    it('liefert Daten aus dem neuesten Snapshot (Redis)', async () => {
      const olderDate = '2025-01-01';
      const newerDate = '2025-01-02';
      await registerNewsDate('de', olderDate);
      await setSnapshot(
        newsSnapshotKey('de', olderDate),
        {
          date: olderDate,
          universe: ['BTC'],
          assets: [{ symbol: 'BTC', sentiment: 'bullish', score: 0.8, confidence: 0.9, rationale: 'r', top_signals: [] }],
          method_note: 'old',
          generatedAt: new Date().toISOString(),
          locale: 'de',
        }
      );
    await registerNewsDate('de', newerDate);
    await setSnapshot(
      newsSnapshotKey('de', newerDate),
      {
        date: newerDate,
          universe: ['ETH', 'SOL'],
          assets: [
            { symbol: 'ETH', sentiment: 'bearish', score: 0.2, confidence: 0.6, rationale: 'x', top_signals: [] },
            { symbol: 'SOL', sentiment: 'neutral', score: 0.5, confidence: 0.5, rationale: 'y', top_signals: [] },
          ],
          method_note: 'new',
          generatedAt: new Date().toISOString(),
          locale: 'de',
        }
      );

      const response = await sentimentGet(new Request('http://localhost/api/sentiment'));
      expect(response.status).toBe(200);
      const payload = await response.json();
      expect(payload.assets.length).toBe(2);
      const symbols = payload.assets.map((it: { ticker: string }) => it.ticker);
      expect(symbols).toEqual(expect.arrayContaining(['ETH', 'SOL']));
      expect(symbols).not.toContain('BTC');
    });
  });

  describe('GET /api/sentiment/history/bulk', () => {
    beforeEach(async () => {
      await clearNewsDates('de');
      await clearNewsDates('en');
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
