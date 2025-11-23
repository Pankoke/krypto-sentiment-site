import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/sentiment/SentimentCard', () => ({
  SentimentCard: ({ item }: { item: { symbol: string } }) => <div>{item.symbol}</div>,
}));
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import SentimentPage from '../app/[locale]/(pages)/sentiment/page';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/de/sentiment',
}));

describe('Sentiment page', () => {
  beforeEach(() => {
    (global as unknown as { React: typeof React }).React = React;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('rendert Grundstruktur', async () => {
    (global.fetch as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    (global.fetch as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );

    const ui = await SentimentPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText(/Sentiment/i).length).toBeGreaterThan(0);
  });

  it('zeigt Hinweis, wenn keine Daten vorhanden sind', async () => {
    (global.fetch as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ items: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    (global.fetch as vi.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    const ui = await SentimentPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText(/Keine Sentiment-Daten/i).length).toBeGreaterThan(0);
  });

  it('rendert Cards bei gelieferten Daten', async () => {
    (global.fetch as vi.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [
            { symbol: 'BTC', sentiment: 'bullish', score: 0.8, confidence: 0.9, bullets: [], generatedAt: new Date().toISOString(), sparkline: [] },
            { symbol: 'ETH', sentiment: 'bearish', score: -0.2, confidence: 0.6, bullets: [], generatedAt: new Date().toISOString(), sparkline: [] },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    (global.fetch as vi.Mock).mockResolvedValueOnce(
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
