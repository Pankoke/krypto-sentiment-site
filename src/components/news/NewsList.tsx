"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useTranslations } from 'next-intl';
import { allowedAssets } from 'lib/assets';

type Signal = {
  id?: string;
  source?: string;
  text?: string;
  timestamp?: string;
  engagement?: number;
};

type AssetReport = {
  symbol: string;
  sentiment: "bullish" | "bearish" | "neutral" | string;
  score?: number;
  confidence?: number;
  rationale?: string;
  top_signals?: Signal[];
};

const PAGE_LIMIT = 3;

export default function NewsList({ className = "" }: { className?: string }) {
  const t = useTranslations('news');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<AssetReport[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const universeFilter = useMemo(() => (filter === 'all' ? undefined : [filter]), [filter]);
  const options = useMemo(() => {
    return [...allowedAssets].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, []);

  const fetchPage = useCallback(async (targetPage: number, universe?: string[]) => {
    if (targetPage === 1) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }
    try {
      const params = new URLSearchParams();
      params.set('page', targetPage.toString());
      params.set('limit', PAGE_LIMIT.toString());
      if (universe?.length) {
        params.set('universe', universe.join(','));
      }
      const res = await fetch(`/api/news?${params}`);
      if (!res.ok) {
        throw new Error(res.statusText || 'news.errorLoading');
      }
      const data = (await res.json()) as {
        assets?: AssetReport[];
        pagination?: { hasMore?: boolean };
        error?: string;
      };
      if (data.error) {
        throw new Error(data.error);
      }
      const newAssets = Array.isArray(data.assets) ? data.assets : [];
      setItems((prev) => (targetPage === 1 ? newAssets : [...prev, ...newAssets]));
      setHasMore(Boolean(data.pagination?.hasMore));
      setPage(targetPage);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);
    fetchPage(1, universeFilter);
  }, [fetchPage, universeFilter, retryKey]);

  const handleRetry = () => setRetryKey((prev) => prev + 1);

  const isEmpty = !isLoading && !error && items.length === 0;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-4 border-b pb-4">
        <div className="text-sm font-medium">{t('filterLabel')}</div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-9 rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          aria-label={t('filterLabel')}
        >
          <option value="all">{t('filterAll')}</option>
          {options.map((asset) => (
            <option key={asset.ticker} value={asset.ticker}>
              {asset.name} ({asset.ticker})
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-3" aria-live="polite">
          <p className="text-sm text-gray-600">{t('loading')}</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
          <p>{t('errorLoading', { error })}</p>
          <button
            onClick={handleRetry}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700 hover:bg-red-100"
          >
            {t('retry')}
          </button>
        </div>
      ) : isEmpty ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600" role="status" aria-live="polite">
          <p>{t('empty')}</p>
          <button
            onClick={handleRetry}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900 hover:bg-gray-50"
          >
            {t('retry')}
          </button>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-500">{t('reportLabel')} {new Date().toISOString().slice(0, 10)}</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Card key={`${a.symbol}-${a.sentiment}-${a.score}`} className="p-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{a.symbol}</CardTitle>
                      <div className="text-sm text-gray-600">{a.sentiment ?? '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{t('label.score')}</div>
                      <div className="text-lg font-semibold">{typeof a.score === 'number' ? a.score.toFixed(2) : '—'}</div>
                      <div className="text-xs text-gray-500">
                        {t('label.confidence')}: {typeof a.confidence === 'number' ? `${Math.round(a.confidence * 100)}%` : '—'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {a.rationale ? (
                    <details>
                      <summary className="cursor-pointer text-sm text-gray-700">{t('showRationale')}</summary>
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{a.rationale}</p>
                    </details>
                  ) : (
                    <p className="text-sm text-gray-600">{t('noRationale')}</p>
                  )}

                  {a.top_signals && a.top_signals.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">{t('topSignals')}</div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {a.top_signals.slice(0, 3).map((s, i) => (
                          <li key={s.id ?? i} className="truncate">{s.text ?? `${s.source ?? 'signal'} ${s.timestamp ?? ''}`}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchPage(page + 1, universeFilter)}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-900 transition hover:bg-gray-50 disabled:opacity-40"
                aria-live="polite"
              >
                {isLoadingMore ? t('loadingMore') : t('loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


