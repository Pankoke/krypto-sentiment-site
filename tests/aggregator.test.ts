import { beforeEach, describe, expect, it, vi } from 'vitest';

// Use mutable bindings so the hoisted vi.mock factory can reference them safely.
// default no-op implementations to satisfy the hoisted mock factory until tests initialize them
let mockFetchAllSources: any = async (..._args: any[]) => [];
let mockCreate: any = async (..._args: any[]) => ({ choices: [] });

vi.mock('../lib/sources', () => ({
  fetchAllSources: (...args: any[]) => mockFetchAllSources(...args),
  getSourceWarnings: () => [],
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
      id: 'news-1',
      source: 'news',
      asset: 'BTC',
      summary: 'Bitcoin-ETF-Zuflüsse stärken den Markt deutlich.',
      timestamp: '2024-01-02T10:00:00Z',
      importance: 0.7,
      engagement: 1200,
    },
    {
      id: 'social-1',
      source: 'social',
      asset: 'BTC',
      summary: 'Whale-Transaktionen zeigen Ansammlungen auf den Börsen.',
      timestamp: '2024-01-02T08:30:00Z',
      importance: 0.4,
      engagement: 400,
    },
    {
      id: 'onchain-1',
      source: 'onchain',
      asset: 'ETH',
      summary: 'Ethereum-TVL wächst, Layer-2-Netzwerke sind stark frequentiert.',
      timestamp: '2024-01-02T11:00:00Z',
      importance: 0.5,
      engagement: 600,
    },
  ];
}

describe('aggregateNews', () => {
  beforeEach(() => {
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
