import { describe, expect, it, beforeEach, vi } from 'vitest';

const mockFetchNews = vi.fn();
const mockFetchSocial = vi.fn();
const mockFetchOnchain = vi.fn();

vi.mock('../lib/sources/news', () => ({
  fetchNews: () => mockFetchNews(),
}));
vi.mock('../lib/sources/social', () => ({
  fetchSocial: () => mockFetchSocial(),
}));
vi.mock('../lib/sources/onchain', () => ({
  fetchOnchain: () => mockFetchOnchain(),
}));

import { fetchAllSources, getSourceWarnings } from '../lib/sources';

describe('source aggregation', () => {
  beforeEach(() => {
    mockFetchNews.mockReset();
    mockFetchSocial.mockReset();
    mockFetchOnchain.mockReset();
  });

  it('deduplicates entries and limits to the whitelist', async () => {
    const baseSummary = 'Bitcoin ETF news';
    mockFetchNews.mockResolvedValue([
      {
        type: 'news',
        source: 'news-wire',
        asset: 'BTC',
        summary: baseSummary,
        timestamp: '2025-01-01T12:00:00Z',
        url: 'https://news.example.com/btc',
        externalId: 'news-btc-1',
      },
      {
        type: 'news',
        source: 'news-wire',
        asset: 'BTC',
        summary: baseSummary,
        title: 'ETF-Update',
        timestamp: '2025-01-01T12:05:00Z',
        externalId: 'news-btc-2',
      },
    ]);
    mockFetchSocial.mockResolvedValue([
      {
        type: 'social',
        source: 'social',
        asset: 'XRP',
        summary: 'Ripple bridges increase TVL',
        timestamp: '2025-01-01T13:00:00Z',
        externalId: 'social-xrp-1',
      },
      {
        type: 'social',
        source: 'social',
        asset: 'AVAX',
        summary: 'Foreign asset noise',
        timestamp: '2025-01-01T13:05:00Z',
        externalId: 'social-avax-1',
      },
    ]);
    mockFetchOnchain.mockResolvedValue([]);

    const entries = await fetchAllSources();
    expect(entries.find((entry) => entry.asset === 'AVAX')).toBeUndefined();
    expect(entries.map((entry) => entry.asset).sort()).toEqual(['BTC', 'XRP']);
    expect(entries.find((entry) => entry.asset === 'BTC')?.title).toBeDefined();
  });

  it('continues when an adapter fails', async () => {
    mockFetchNews.mockRejectedValue(new Error('feed down'));
    mockFetchSocial.mockResolvedValue([
      {
        type: 'social',
        source: 'social',
        asset: 'SOL',
        summary: 'Solana volume uptick',
        timestamp: '2025-01-01T14:00:00Z',
        externalId: 'social-sol-1',
      },
    ]);
    mockFetchOnchain.mockResolvedValue([
      {
        type: 'onchain',
        source: 'onchain',
        asset: 'ETH',
        summary: 'Ethereum staking stays strong',
        timestamp: '2025-01-01T14:30:00Z',
        externalId: 'onchain-eth-1',
      },
    ]);

    const entries = await fetchAllSources();
    expect(entries.map((entry) => entry.asset).sort()).toEqual(['ETH', 'SOL']);
    const warnings = getSourceWarnings();
    expect(warnings.some((text) => text.includes('news'))).toBe(true);
  });
});
