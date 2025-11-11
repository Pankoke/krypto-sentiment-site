import { beforeEach, describe, expect, it, vi } from 'vitest';

// Use mutable bindings so the hoisted vi.mock factory can reference them safely.
// default no-op implementations to satisfy the hoisted mock factory until tests initialize them
let mockFetchAllSources: any = async (..._args: any[]) => [];
let mockCreate: any = async (..._args: any[]) => ({ choices: [] });

vi.mock('../lib/sources', () => ({
  fetchAllSources: (...args: any[]) => mockFetchAllSources(...args),
}));

vi.mock('../lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: (...args: any[]) => mockCreate(...args),
      },
    },
  },
}));

import { aggregateNews } from '../lib/news/aggregator';

function createMockPosts() {
  return [
    {
      source: 'news',
      asset: 'BTC',
      text: 'Bitcoin-ETF-Zuflüsse steigen, Kurs hält sich oben.',
      ts: '2024-01-02T10:00:00Z',
      engagement: 1200,
    },
    {
      source: 'social',
      asset: 'BTC',
      text: 'Whale-Transaktionen zeigen Ansammlung auf den Börsen.',
      ts: '2024-01-02T08:30:00Z',
      engagement: 400,
    },
    {
      source: 'onchain',
      asset: 'ETH',
      text: 'Ethereum-TVl wächst, Layer-2-Netzwerke stark frequentiert.',
      ts: '2024-01-02T11:00:00Z',
      engagement: 600,
    },
  ];
}

describe('aggregateNews', () => {
  beforeEach(() => {
    // initialize mocks before each test
    mockFetchAllSources = vi.fn();
    mockCreate = vi.fn();
  });

  it('aggregates assets using OpenAI summaries', async () => {
    mockFetchAllSources.mockResolvedValue(createMockPosts());
    mockCreate.mockResolvedValue({ choices: [{ message: { content: 'OpenAI rationale text' } }] });

    const report = await aggregateNews({ universe: ['btc', 'eth'], since: '2024-01-01T00:00:00Z' });

    expect(report.universe).toEqual(['BTC', 'ETH']);
    expect(report.assets).toHaveLength(2);
  const btcAsset = report.assets.find((asset) => asset.symbol === 'BTC');
  expect(btcAsset).toBeDefined();
  expect(btcAsset!.rationale).toBe('OpenAI rationale text');
    expect(report.assets.every((asset) => asset.score >= 0 && asset.score <= 1)).toBe(true);
    expect(report.assets.every((asset) => asset.confidence >= 0 && asset.confidence <= 1)).toBe(true);
    expect(report.method_note).not.toContain('OpenAI-Fallback');
    expect(mockCreate).toHaveBeenCalledTimes(report.assets.length);
  });

  it('falls back to heuristic rationale when OpenAI fails', async () => {
    mockFetchAllSources.mockResolvedValue(createMockPosts());
    mockCreate.mockRejectedValue(new Error('timeout'));

  const report = await aggregateNews({ universe: ['btc'], since: '2024-01-01T00:00:00Z' });

  expect(report.assets).toHaveLength(1);
  const btc = report.assets.find((a) => a.symbol === 'BTC');
  expect(btc).toBeDefined();
  expect(btc!.rationale).toContain('Heuristische Zusammenfassung');
    expect(report.method_note).toContain('OpenAI-Fallback');
    expect(mockCreate).toHaveBeenCalled();
  });
});
