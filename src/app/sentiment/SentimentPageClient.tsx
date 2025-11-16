"use client";
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { SentimentResponse, SentimentItem } from 'lib/sentiment/types';
import { SentimentHeader } from '@/components/sentiment/SentimentHeader';
import { SentimentCard } from '@/components/sentiment/SentimentCard';
import { SentimentDetailDialog } from '@/components/sentiment/SentimentDetailDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { filterAssetsByWhitelist, sortAssetsByWhitelistOrder } from '../../../lib/assets';

const fetcher = (u: string) => fetch(u).then((r) => r.json() as Promise<SentimentResponse>);

export default function SentimentPageClient() {
  const t = useTranslations();
  const { data, error, isLoading, mutate } = useSWR<SentimentResponse>('/api/sentiment?window=24h', fetcher, {
    revalidateOnFocus: false,
  });
  const [filter, setFilter] = useState<{ trend?: 'bullish' | 'neutral' | 'bearish' | 'all'; sort: 'score' | 'confidence' | 'symbol' }>({ sort: 'score', trend: 'all' });
  const [selected, setSelected] = useState<SentimentItem | undefined>(undefined);

  const items = useMemo(() => {
    if (!data) return [] as SentimentItem[];
    let arr = sortAssetsByWhitelistOrder(filterAssetsByWhitelist(data.items));
    if (filter.trend && filter.trend !== 'all') arr = arr.filter((i) => i.trend === filter.trend);
    if (filter.sort === 'score') arr.sort((a, b) => b.score - a.score);
    if (filter.sort === 'confidence') arr.sort((a, b) => b.confidence - a.confidence);
    if (filter.sort === 'symbol') arr.sort((a, b) => a.symbol.localeCompare(b.symbol));
    return arr;
  }, [data, filter]);

  return (
    <div className="space-y-4">
      <SentimentHeader
        dateISO={data?.dateISO ?? new Date().toISOString()}
        lastUpdatedISO={data?.lastUpdatedISO ?? new Date().toISOString()}
        nextRefreshETASeconds={data?.nextRefreshETASeconds}
        filter={filter}
        onChangeFilter={setFilter}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 space-y-2">
          <p>{t('error.fetchSentiment')}</p>
          <Button onClick={() => mutate?.()}>{t('action.retry')}</Button>
        </div>
      )}

      {isLoading && (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-xl border" />
          ))}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-xl border p-6 text-sm">{t('empty.noResults')}</div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <SentimentCard key={it.symbol} item={it} onOpenDetails={setSelected} />
        ))}
      </div>

      <SentimentDetailDialog open={!!selected} item={selected} onOpenChange={(o) => !o && setSelected(undefined)} />
    </div>
  );
}
