import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/sentiment/SentimentCard', () => ({
  SentimentCard: ({ item }: { item: { symbol: string } }) => <div>{item.symbol}</div>,
}));
vi.mock('@/components/sentiment/GlobalMarketBar', () => ({
  GlobalMarketBar: () => <div>GlobalMarketBar</div>,
}));
vi.mock('@/components/sentiment/AssetScoreStrip', () => ({
  AssetScoreStrip: ({ items }: { items: Array<{ symbol: string }> }) => (
    <div>{items.map((i) => i.symbol).join(',')}</div>
  ),
}));
vi.mock('@/components/ui', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('next-intl/server', () => ({
  getTranslations: () => () => (key: string) => key,
}));
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/de/sentiment',
}));
vi.mock('lib/news/snapshot', () => ({
  getLatestSentimentFromSnapshots: vi.fn(),
}));

import SentimentPage from '../app/[locale]/(pages)/sentiment/page';
import { getLatestSentimentFromSnapshots } from 'lib/news/snapshot';

describe('Sentiment page', () => {
  beforeEach(() => {
    (global as unknown as { React: typeof React }).React = React;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('rendert Grundstruktur', async () => {
    (getLatestSentimentFromSnapshots as vi.Mock).mockResolvedValue({
      timestamp: new Date().toISOString(),
      locale: 'de',
      globalScore: 0.5,
      assets: [],
    });
    const ui = await SentimentPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText(/Sentiment/i).length).toBeGreaterThan(0);
  });

  it('zeigt Hinweis, wenn keine Daten vorhanden sind', async () => {
    (getLatestSentimentFromSnapshots as vi.Mock).mockResolvedValue(null);
    const ui = await SentimentPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText(/Keine Sentiment-Daten/i).length).toBeGreaterThan(0);
  });

  it('rendert Cards bei gelieferten Daten', async () => {
    (getLatestSentimentFromSnapshots as vi.Mock).mockResolvedValue({
      timestamp: new Date().toISOString(),
      locale: 'de',
      globalScore: 0.5,
      assets: [
        { ticker: 'BTC', score: 0.8 },
        { ticker: 'ETH', score: 0.6 },
      ],
    });
    (global.fetch as vi.Mock).mockResolvedValue(
      new Response(
        JSON.stringify([
          { asset: 'BTC', points: [] },
          { asset: 'ETH', points: [] },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    const ui = await SentimentPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText('BTC').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ETH').length).toBeGreaterThan(0);
  });
});
