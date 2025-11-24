"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { useTranslations } from 'next-intl';

export type SentimentStatus = 'ok' | 'stale' | 'empty' | 'error';

export interface SentimentHeaderProps {
  dateISO: string;
  lastUpdatedISO: string;
  nextRefreshETASeconds?: number;
  filter: { trend?: 'bullish' | 'neutral' | 'bearish' | 'all'; sort: 'score' | 'confidence' | 'symbol' };
  onChangeFilter: (f: SentimentHeaderProps['filter']) => void;
  status: SentimentStatus;
  generatedAt?: string;
  errorMessage?: string;
}

const statusStyles: Record<SentimentStatus, string> = {
  ok: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  stale: 'border-amber-200 bg-amber-100 text-amber-800',
  empty: 'border-slate-200 bg-slate-100 text-slate-800',
  error: 'border-red-200 bg-red-100 text-red-800',
};

export function SentimentHeader({
  dateISO,
  lastUpdatedISO,
  nextRefreshETASeconds,
  filter,
  onChangeFilter,
  status,
  generatedAt,
  errorMessage,
}: SentimentHeaderProps) {
  const eta = typeof nextRefreshETASeconds === 'number' ? Math.max(0, nextRefreshETASeconds) : undefined;
  const t = useTranslations();
  const formattedTime = generatedAt ? new Date(generatedAt).toLocaleTimeString() : new Date(lastUpdatedISO).toLocaleTimeString();
  const statusText =
    status === 'ok'
      ? t('sentimentStatus.ok', { time: formattedTime })
      : status === 'stale'
      ? t('sentimentStatus.stale', { time: formattedTime })
      : status === 'empty'
      ? t('sentimentStatus.empty')
      : t('sentimentStatus.error');

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">
          {t('title.sentiment')} · {new Date(dateISO).toLocaleDateString()}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('label.updated')} {new Date(lastUpdatedISO).toLocaleTimeString()}
          {typeof eta === 'number' && ` · ${t('label.nextUpdate', { mins: Math.ceil(eta / 60) })}`}
        </p>
        <p className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
          {statusText}
          {status === 'error' && errorMessage ? (
            <span className="italic text-[0.7rem]">({errorMessage})</span>
          ) : null}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={filter.trend ?? 'all'} onValueChange={(v) => onChangeFilter({ ...filter, trend: v as typeof filter.trend })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('select.trend.label')} />
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
            <SelectValue placeholder={t('select.sort.label')} />
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
