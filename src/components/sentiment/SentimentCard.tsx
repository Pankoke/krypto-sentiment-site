"use client";

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import type { SentimentItem } from 'lib/sentiment/types';
import type { AssetSentimentPoint } from 'lib/news/snapshot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendBadge } from './TrendBadge';
import { Sparkline } from './Sparkline';

interface SentimentCardProps {
  item: SentimentItem;
}

const sentimentColors: Record<SentimentItem['trend'], string> = {
  bullish: 'bg-emerald-100 text-emerald-800',
  neutral: 'bg-slate-100 text-slate-700',
  bearish: 'bg-rose-100 text-rose-800',
};

const formatScore = (score: number) => score.toFixed(2);
const asPercent = (value: number) => `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;

export function SentimentCard({ item }: SentimentCardProps) {
  const t = useTranslations();
  const [expandedRationale, setExpandedRationale] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const fetcher = (url: string) =>
    fetch(url).then((resp) => resp.json() as Promise<{ asset: string; points: AssetSentimentPoint[] }>);
  const { data: historyData } = useSWR(
    item.symbol ? `/api/sentiment/history?asset=${item.symbol}&days=30` : null,
    fetcher
  );
  const sparklinePoints = historyData?.points.length
    ? historyData.points.map((point) => ({
        t: new Date(point.date).getTime(),
        c: point.score,
      }))
    : item.sparkline;

  const groupedSignals = useMemo(() => {
    const groups: Record<'news' | 'onchain' | 'social', string[]> = {
      news: [],
      onchain: [],
      social: [],
    };
    for (const bullet of item.bullets) {
      groups[bullet.group].push(bullet.text);
    }
    return groups;
  }, [item.bullets]);

  const rationaleText = useMemo(() => item.bullets.slice(0, 4).map((b) => b.text).join(' '), [item.bullets]);
  const truncatedRationale = rationaleText.length > 220 ? `${rationaleText.slice(0, 220)}…` : rationaleText;
  const hasMore = rationaleText.length > 220;

  return (
    <Card className="flex flex-col space-y-3">
      <CardHeader className="pt-4 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">{item.symbol}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {t('label.updated')}: {new Date(item.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-2xl font-bold tracking-tight">{formatScore(item.score)}</p>
              <p className="text-xs text-muted-foreground">Confidence {asPercent(item.confidence)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendBadge trend={item.trend} />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sentimentColors[item.trend]}`}>
              {item.trend}
            </span>
          </div>
          <div className="flex justify-end">
            <Sparkline data={sparklinePoints} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {expandedRationale ? rationaleText || t('label.noSignals') : truncatedRationale || t('label.noSignals')}
          </p>
          {hasMore && (
            <button
              type="button"
              className="text-xs font-semibold text-sky-600 underline-offset-2 hover:text-sky-500"
              onClick={() => setExpandedRationale((prev) => !prev)}
            >
              {expandedRationale ? t('action.less') : t('action.more')}
            </button>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">{t('label.topSignals')}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {(['social', 'news', 'onchain'] as const).map((group) => {
              const entries = groupedSignals[group];
              if (!entries.length) return null;
              return (
                <div key={group} className="space-y-1 rounded-xl border border-border p-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t(`group.${group}`)}
                  </p>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {entries.slice(0, 4).map((text, index) => (
                      <li key={`${group}-${index}`} className="list-disc pl-4">
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:text-muted-foreground/80"
          onClick={() => setShowRawJson((prev) => !prev)}
        >
          {showRawJson ? t('action.hideJson') : t('action.showJson')}
        </button>
        {showRawJson && (
          <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-muted p-3 text-xs font-mono text-slate-600">
            {JSON.stringify(item, null, 2)}
          </pre>
        )}
      </div>
    </Card>
  );
}
