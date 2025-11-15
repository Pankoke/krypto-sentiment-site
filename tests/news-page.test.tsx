import React from 'react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsList from '../src/components/news/NewsList';

const translations: Record<string, string> = {
  generatedAt: 'Stand: {date}',
  emptySnapshot: 'Noch keine News vorhanden.',
  'label.score': 'Score',
  'label.confidence': 'Confidence',
  topSignals: 'Top signals',
  noRationale: 'Keine Rationale',
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
  top_signals: [{ id: '1', source: 'news-wire', evidence: 'Signal stärkt' }],
});

describe('NewsList snapshot renderer', () => {
  it('shows snapshot metadata and assets', () => {
    render(
      <NewsList
        assets={[makeAsset('BTC'), makeAsset('ETH')]}
        reportDate="2025-11-14"
        generatedAt="2025-11-14T06:00:00.000Z"
        methodNote="Methodisch up to date"
      />
    );
    expect(screen.getByText('Stand: 2025-11-14T06:00:00.000Z')).toBeInTheDocument();
    expect(screen.getByText('Methodisch up to date')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getAllByText('Signal stärkt').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Score').length).toBeGreaterThan(0);
  });

  it('renders empty snapshot message when no assets', () => {
    render(<NewsList assets={[]} reportDate="2025-11-14" />);
    expect(screen.getByText('Noch keine News vorhanden.')).toBeInTheDocument();
  });
});
