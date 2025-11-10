"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Card from '../ui/Card';
import type { ArchiveItem } from '../../app/reports/page';
import { useTranslations } from 'next-intl';

type Props = {
  items: ArchiveItem[];
};

export default function ArchiveList({ items }: Props) {
  const t = useTranslations();
  const [query, setQuery] = useState('');
  const [symbol, setSymbol] = useState('');

  const symbols = useMemo(() => {
    const all = new Set<string>();
    for (const it of items) {
      for (const s of it.symbols) all.add(s);
    }
    return Array.from(all).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const qOk = !q || it.date.toLowerCase().includes(q) || it.macroSummary.toLowerCase().includes(q);
      const sOk = !symbol || it.symbols.includes(symbol);
      return qOk && sOk;
    });
  }, [items, query, symbol]);

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('nav.archive')}</h1>
          <div className="text-sm text-gray-600">{filtered.length} / {items.length}</div>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('archive.search', { default: 'Suche (Datum, Summary)' })}
            className="h-9 w-64 rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="h-9 rounded-md border px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="">{t('archive.allAssets', { default: 'Alle Assets' })}</option>
            {symbols.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 text-sm text-gray-700">{t('empty.noResults')}</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((it) => (
            <Card key={it.date}>
              <header className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">{it.date}</h2>
                <div className="text-xs text-gray-600">{it.assetsCount} Assets</div>
              </header>
              <p className="text-sm text-gray-800 line-clamp-3">{it.macroSummary}</p>
              {it.symbols.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">{it.symbols.join(', ')}</div>
              )}
              <div className="mt-3">
                <Link
                  href={`/reports/${it.date}`}
                  className="text-sm text-gray-700 hover:text-black underline underline-offset-4"
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
