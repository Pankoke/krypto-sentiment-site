import React from 'react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsList from '../src/components/news/NewsList';

const translations: Record<string, string> = {
  generatedAt: 'Stand: {date}',
  'newsStatus.empty': 'Noch keine News vorhanden.',
  'newsStatus.error': 'Fehler: {error}',
  'newsStatus.stale': 'Stand veraltet ({date}).',
};

vi.mock('next-intl', () => ({
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

const makeAsset = (symbol: string) => ({
  symbol,
  sentiment: 'bullish',
  score: 0.6,
  confidence: 0.8,
  rationale: 'Rechne mit Auftrieb.',
  top_signals: [{ id: '1', source: 'news-wire', evidence: 'Signal staerkt' }],
});

describe('NewsList snapshot renderer', () => {
  it('shows snapshot metadata and derived news items', () => {
    render(
      <NewsList
        items={[
          {
            id: '1',
            source: 'social',
            title: 'Headline',
            summary: 'Kurztext',
            timestamp: '2025-11-14T06:00:00.000Z',
            symbols: ['BTC'],
            sentiment: 'bullish',
            tags: ['BTC', 'bullish'],
          },
          {
            id: '2',
            source: 'news-wire',
            title: 'Headline 2',
            summary: 'Noch ein kurzer Text',
            timestamp: '2025-11-14T06:00:00.000Z',
            symbols: ['ETH'],
            sentiment: 'bullish',
            tags: ['ETH', 'bullish'],
          },
        ]}
        reportDate="2025-11-14"
        generatedAt="2025-11-14T06:00:00.000Z"
        methodNote="Methodisch up to date"
        status="ok"
      />
    );
    expect(screen.getByText(/Stand: 14\.11\.2025, 07:00/)).toBeInTheDocument();
    expect(screen.getByText('Methodisch up to date')).toBeInTheDocument();
    expect(screen.getAllByText(/Headline/).length).toBeGreaterThan(0);
  });

  it('renders empty snapshot message when no assets', () => {
    render(<NewsList items={[]} reportDate="2025-11-14" status="empty" />);
    expect(
      screen.getByText((content) => content.includes('Noch keine News'))
    ).toBeInTheDocument();
  });
});
