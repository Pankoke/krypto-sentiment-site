"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Card from '../ui/Card';
import ScoreBadge from '../ui/ScoreBadge';
import StatusBadges, { type StatusKey } from '../ui/StatusBadges';
import type { ArchiveItem } from '../../lib/types';
import { useTranslations } from 'next-intl';

type Props = {
  items: ArchiveItem[];
  localeRoot?: string;
};

const determineDayStatuses = (item: ArchiveItem): StatusKey[] => {
  const statuses = new Set<StatusKey>();
  if (!item.complete) {
    statuses.add('lowConfidence');
  }
  if (item.avgScore >= 75) {
    statuses.add('highImpact');
  }
  if (item.avgConfidence < 50) {
    statuses.add('lowConfidence');
  }
  return Array.from(statuses);
};

export default function ArchiveList({ items, localeRoot }: Props) {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [symbol, setSymbol] = useState('');
  const reportsBase = `${localeRoot ?? '/reports'}`;

  const symbols = useMemo(() => {
    const all = new Set<string>();
    for (const it of items) {
      it.symbols.forEach((s) => all.add(s));
    }
    return Array.from(all).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesQuery =
        !q ||
        it.date.toLowerCase().includes(q) ||
        it.macroSummary.toLowerCase().includes(q);
      const matchesSymbol = !symbol || it.symbols.includes(symbol);
      return matchesQuery && matchesSymbol;
    });
  }, [items, query, symbol]);

  const statusLabels = {
    highImpact: t('status.highImpact', { default: 'High-Impact' }),
    eventWindow: t('status.eventWindow', { default: 'Event-Window' }),
    lowConfidence: t('status.lowConfidence', { default: 'Low Confidence' }),
    highVolRegime: t('status.highVolRegime', { default: 'High-Vol Regime' }),
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('nav.archive')}</h1>
          <div className="text-sm text-gray-600">
            {filtered.length} / {items.length}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('archive.search', { default: 'Suche (Datum, Summary)' })}
            className="h-9 w-64 rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <select
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            className="h-9 rounded-md border px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="">{t('archive.allAssets', { default: 'Alle Assets' })}</option>
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 text-sm text-gray-700">{t('empty.noResults')}</div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((item) => (
            <Card key={item.date}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{item.date}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.macroSummary}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {t('archive.generatedAt', { date: new Date(item.generatedAt).toLocaleString() })}
                  </p>
                </div>
                <ScoreBadge
                  score={item.avgScore}
                  label={t('scoreCard.scoreLabel', { default: 'Score' })}
                  helperText={t('archive.assets', { count: item.assetsCount })}
                  className="max-w-[120px] flex-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600">
                  {t('archive.avgConfidenceLabel', { value: item.avgConfidence })}
                </span>
                <StatusBadges statuses={determineDayStatuses(item)} labels={statusLabels} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.symbols.map((symbolName) => (
                  <span
                    key={symbolName}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700"
                  >
                    {symbolName}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={`${reportsBase}/${item.date}`}
                  className="text-sm font-semibold text-black hover:text-gray-800 underline underline-offset-4"
                >
                  {t('archive.details', { default: 'Details ansehen' })}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
