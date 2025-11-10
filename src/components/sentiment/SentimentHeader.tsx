import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

interface SentimentHeaderProps {
  dateISO: string;
  lastUpdatedISO: string;
  nextRefreshETASeconds?: number;
  filter: { trend?: 'bullish' | 'neutral' | 'bearish' | 'all'; sort: 'score' | 'confidence' | 'symbol' };
  onChangeFilter: (f: SentimentHeaderProps['filter']) => void;
}
export function SentimentHeader({ dateISO, lastUpdatedISO, nextRefreshETASeconds, filter, onChangeFilter }: SentimentHeaderProps) {
  const eta = typeof nextRefreshETASeconds === 'number' ? Math.max(0, nextRefreshETASeconds) : undefined;
  const t = useTranslations();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{t('title.sentiment')} · {new Date(dateISO).toLocaleDateString()}</h1>
        <p className="text-sm text-muted-foreground">
          {t('label.updated')} {new Date(lastUpdatedISO).toLocaleTimeString()}
          {typeof eta === 'number' && ` · ${t('label.nextUpdate', { mins: Math.ceil(eta / 60) })}`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={filter.trend ?? 'all'} onValueChange={(v) => onChangeFilter({ ...filter, trend: v as typeof filter.trend })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('select.trend')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('select.trend.all')}</SelectItem>
            <SelectItem value="bullish">{t('badge.bullish')}</SelectItem>
            <SelectItem value="neutral">{t('badge.neutral')}</SelectItem>
            <SelectItem value="bearish">{t('badge.bearish')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filter.sort} onValueChange={(v) => onChangeFilter({ ...filter, sort: v as typeof filter.sort })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t('select.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score">{t('select.sort.score')}</SelectItem>
            <SelectItem value="confidence">{t('select.sort.confidence')}</SelectItem>
            <SelectItem value="symbol">{t('select.sort.symbol')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
