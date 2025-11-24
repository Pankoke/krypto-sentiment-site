import { beforeEach, describe, expect, it, vi } from 'vitest';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const TEST_DATA_DIR = join(process.cwd(), 'tmp-test-data');

process.env.GENERATE_DATA_DIR = TEST_DATA_DIR;
process.env.CRON_SECRET = 'SuperLongSecret';
process.env.NEWS_GENERATE_SECRET = 'SuperLongSecret';
process.env.ADMIN_SECRET = 'SuperLongSecret';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(async () => undefined),
}));

const aggregatorMock = async () => {
  const { berlinDateString } = await vi.importActual('lib/timezone');
  const date = berlinDateString(new Date());
  return {
    aggregateNews: vi.fn(async () => ({
      date,
      universe: ['BTC', 'ETH', 'SOL'],
      assets: [
        {
          symbol: 'BTC',
          sentiment: 'bullish',
          score: 0.8,
          confidence: 0.9,
          rationale: 'Test rationale',
          top_signals: [],
        },
      ],
      method_note: 'test',
      adapterWarnings: [],
      uniqueAssets: 1,
      dedupeCount: 0,
      generatedAt: new Date().toISOString(),
    })),
  };
};

const sentimentMock = () => ({
  runDailySentiment: vi.fn(async () => ({
    date: new Date().toISOString().split('T')[0],
    universe: ['BTC', 'ETH'],
    assets: [
      {
        symbol: 'BTC',
        sentiment: 'bullish',
        score: 0.8,
        confidence: 0.9,
        rationale: 'sentiment rationale',
        top_signals: [],
        generatedAt: new Date().toISOString(),
      },
    ],
    macro_summary: 'summary',
    method_note: 'method note',
    complete: true,
    version: '1.0',
    generatedAt: new Date().toISOString(),
  })),
});
let dailyRunHandler: typeof import('../../app/api/generate/daily-run/route').GET;
let healthHandler: typeof import('../../app/api/health/route').GET;
import { closeRedis } from '../../lib/cache/redis';
import { clearRedisTestData } from '../utils/redisTestUtils';

async function cleanTestArtifacts() {
  await rm(TEST_DATA_DIR, { recursive: true, force: true });
  await clearRedisTestData();
  await closeRedis();
}

describe('Daily run + health integration', () => {
  beforeEach(async () => {
    await cleanTestArtifacts();
    vi.resetModules();
    vi.doMock('lib/news/aggregator', aggregatorMock);
    vi.doMock('lib/sentiment', sentimentMock);
    ({ GET: dailyRunHandler } = await import('../../app/api/generate/daily-run/route'));
    ({ GET: healthHandler } = await import('../../app/api/health/route'));
  });

  it('reports warming up without snapshots', async () => {
    const response = await healthHandler(new Request('http://localhost/api/health'));
    const payload = await response.json();
    expect(payload.status).toBe('warming_up');
  });

  it('generates snapshots and health returns ok afterwards', async () => {
    const initialHealth = await healthHandler(new Request('http://localhost/api/health'));
    expect((await initialHealth.json()).status).toBe('warming_up');

    const dailyResponse = await dailyRunHandler(
      new Request('http://localhost/api/generate/daily-run?key=SuperLongSecret&mode=overwrite', {
        headers: { 'x-admin-secret': 'SuperLongSecret' },
      })
    );
    const dailyJson = await dailyResponse.json();
    expect(dailyResponse.status).toBe(200);
    expect(dailyJson.runStatus).toBe('created');

    const secondHealth = await healthHandler(new Request('http://localhost/api/health'));
    const healthPayload = await secondHealth.json();
    expect(healthPayload.status === 'ok' || healthPayload.status === 'partial').toBe(true);
    expect(typeof healthPayload.latestGeneratedAt).toBe('string');
    expect(() => new Date(healthPayload.latestGeneratedAt).toISOString()).not.toThrow();
  });

  it('returns updated status on the second run', async () => {
    const firstResponse = await dailyRunHandler(
      new Request('http://localhost/api/generate/daily-run?key=SuperLongSecret&mode=overwrite', {
        headers: { 'x-admin-secret': 'SuperLongSecret' },
      })
    );
    const firstJson = await firstResponse.json();
    expect(firstJson.runStatus).toBe('created');

    const secondResponse = await dailyRunHandler(
      new Request('http://localhost/api/generate/daily-run?key=SuperLongSecret&mode=overwrite', {
        headers: { 'x-admin-secret': 'SuperLongSecret' },
      })
    );
    const secondJson = await secondResponse.json();
    expect(secondJson.runStatus).toBe('updated');
  });
});
