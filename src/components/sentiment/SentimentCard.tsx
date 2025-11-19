 'use client';

import React, { useMemo } from 'react';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import type { SentimentItem } from 'lib/sentiment/types';
import type { AssetSentimentPoint } from 'lib/news/snapshot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScorePill } from './ScorePill';
import { ConfidencePill } from './ConfidencePill';
import { TrendBadge } from './TrendBadge';
import { Sparkline } from './Sparkline';
import { InfoTooltip } from './InfoTooltip';

interface SentimentCardProps {
  item: SentimentItem;
  onOpenDetails?: (item: SentimentItem) => void;
}
export function SentimentCard({ item, onOpenDetails }: SentimentCardProps) {
  const t = useTranslations();
  const grouped = useMemo(() => {
    const g: Record<'news' | 'onchain' | 'social', string[]> = { news: [], onchain: [], social: [] };
    for (const b of item.bullets) g[b.group].push(b.text);
    return g;
  }, [item.bullets]);
  const fetcher = (url: string) => fetch(url).then((resp) => resp.json() as Promise<{ asset: string; points: AssetSentimentPoint[] }>);
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

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{item.symbol}</CardTitle>
          <div className="flex items-center gap-2">
            <TrendBadge trend={item.trend} />
            <Sparkline data={sparklinePoints} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <ScorePill score={item.score} />
          <ConfidencePill
            confidence={item.confidence}
            tooltip={
              <InfoTooltip
                content={
                  <div>
                    <div>
                      <b>{t('tooltip.definitionTitle')}</b>: {t('tooltip.calibration')}
                    </div>
                  </div>
                }
              />
            }
          />
        </div>

        <p className="text-sm text-muted-foreground">{t('label.updated')}: {new Date(item.generatedAt).toLocaleString()}</p>

        <ul className="text-sm space-y-2">
          {grouped.news.length > 0 && (
            <li>
              <b>📰 {t('group.news')}:</b> {grouped.news.slice(0, 2).join(' • ')}
            </li>
          )}
          {grouped.onchain.length > 0 && (
            <li>
              <b>⛓️ {t('group.onchain')}:</b> {grouped.onchain.slice(0, 2).join(' • ')}
            </li>
          )}
          {grouped.social.length > 0 && (
            <li>
              <b>💬 {t('group.social')}:</b> {grouped.social.slice(0, 2).join(' • ')}
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between">
          <button className="text-sm underline" onClick={() => onOpenDetails?.(item)}>
            {t('action.details')}
          </button>
          <span className="text-xs text-muted-foreground">{t('footer.disclaimerShort')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
