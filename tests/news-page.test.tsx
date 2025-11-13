import React from 'react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsList from '../src/components/news/NewsList';

const translations: Record<string, string> = {
  'filterLabel': 'Asset',
  'filterAll': 'All assets',
  'loading': 'Loading news…',
  'empty': 'No news available.',
  'errorLoading': 'Error loading: {error}',
  'retry': 'Retry',
  'loadMore': 'Load more',
  'loadingMore': 'Loading more…',
  'reportLabel': 'Report:',
  'showRationale': 'Show rationale',
  'noRationale': 'No rationale',
  'topSignals': 'Top signals',
};

vi.mock('next-intl', (): any => ({
  useTranslations: () => (key: string, opts?: Record<string, string | number>) => {
    let value = translations[key] ?? key;
    if (opts) {
      for (const [param, replacement] of Object.entries(opts)) {
        value = value.replace(`{${param}}`, String(replacement));
      }
    }
    return value;
  },
}));

type AssetReport = {
  symbol: string;
  sentiment?: string;
  score?: number;
  confidence?: number;
  rationale?: string;
  top_signals?: Array<{ source: string; text: string }>;
};

function makeAsset(symbol: string): AssetReport {
  return {
    symbol,
    sentiment: 'bullish',
    score: 0.5,
    confidence: 0.9,
    rationale: 'explain',
    top_signals: [],
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NewsList states', () => {
  it('renders empty state when API returns no entries', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ assets: [], pagination: { hasMore: false } }),
      } as Response);
    vi.stubGlobal('fetch', fetchMock);

    console.log('[news] rendering empty state');
    render(<NewsList />);
    await screen.findByText('No news available.');
  });

  it('shows error message with retry when fetch fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('boom'));
    vi.stubGlobal('fetch', fetchMock);
    console.log('[news] rendering error state');
    render(<NewsList />);
    await screen.findByText('Error loading: boom');
    const retryButtons = screen.getAllByRole('button', { name: 'Retry' });
    expect(retryButtons.length).toBeGreaterThan(0);
  });

  it('filters assets via the dropdown', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [makeAsset('BTC'), makeAsset('ETH')],
          pagination: { hasMore: false },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [makeAsset('SOL')],
          pagination: { hasMore: false },
        }),
      } as Response);

    vi.stubGlobal('fetch', fetchMock);
    console.log('[news] rendering filter state');
    render(<NewsList />);
    await screen.findByText('BTC');
    const select = screen.getAllByLabelText('Asset')[0];
    if (!select) {
      throw new Error('Asset-Filter nicht gefunden');
    }
    fireEvent.change(select, { target: { value: 'SOL' } });
    await waitFor(() => expect(screen.getByText('SOL')).toBeInTheDocument());
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][0]).toContain('universe=SOL');
  });

  it('loads additional pages with pagination', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [makeAsset('BTC')],
          pagination: { hasMore: true },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [makeAsset('ETH')],
          pagination: { hasMore: false },
        }),
      } as Response);

    vi.stubGlobal('fetch', fetchMock);
    console.log('[news] rendering pagination state');
    render(<NewsList />);
    await screen.findByText('BTC');
    fireEvent.click(await screen.findByRole('button', { name: 'Load more' }));
    await waitFor(() => expect(screen.getByText('ETH')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain('page=2');
  });
});


