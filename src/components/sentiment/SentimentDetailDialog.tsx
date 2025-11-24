"use client";
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@/components/ui';
import { ScorePill } from './ScorePill';
import { ConfidencePill } from './ConfidencePill';
import { TrendBadge } from './TrendBadge';
import { Sparkline } from './Sparkline';
import type { SentimentBullet, SentimentItem } from 'lib/sentiment/types';

interface SentimentDetailDialogProps {
  open: boolean;
  item?: SentimentItem;
  onOpenChange: (o: boolean) => void;
}

export function SentimentDetailDialog({ open, item, onOpenChange }: SentimentDetailDialogProps) {
  const t = useTranslations();
  if (!item) return null;

  const groups: Array<SentimentBullet['group']> = ['news', 'onchain', 'social'];
  const groupedBullets = groups.map((group) => ({
    group,
    items: item.bullets.filter((b) => b.group === group),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>
              {item.symbol} – {t('title.sentiment')}
            </span>
            <TrendBadge trend={item.trend} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <ScorePill score={item.score} />
            <ConfidencePill confidence={item.confidence} />
          </div>
          <div className="text-sm text-muted-foreground">
            {t('label.updated')}: {new Date(item.generatedAt).toLocaleString()}
          </div>
          <div className="flex justify-center">
            <Sparkline data={item.sparkline} className="text-slate-400" />
          </div>
          {groupedBullets.map(({ group, items }) => (
            <section key={group} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`group.${group}`)}
              </h3>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">{t('news.noSignals')}</p>
              ) : (
                <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                  {items.map((bullet, idx) => (
                    <li key={`${group}-${idx}`}>{bullet.text}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>{t('action.close')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
