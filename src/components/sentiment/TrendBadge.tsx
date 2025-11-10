import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { SentimentTrend } from '@/core/sentiment/types';
import { useTranslations } from 'next-intl';

interface TrendBadgeProps { trend: SentimentTrend; }
export function TrendBadge({ trend }: TrendBadgeProps) {
  const t = useTranslations();
  const label = trend === 'bullish' ? t('badge.bullish') : trend === 'neutral' ? t('badge.neutral') : t('badge.bearish');
  const cls = trend === 'bullish' ? 'bg-emerald-600' : trend === 'neutral' ? 'bg-gray-500' : 'bg-rose-600';
  return <Badge className={`${cls} text-white`}>{label}</Badge>;
}
