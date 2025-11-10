import React from 'react';
import { useTranslations } from 'next-intl';

interface ScorePillProps {
  score: number; // 0..1
  className?: string;
}
export function ScorePill({ score, className }: ScorePillProps) {
  const pct = Math.max(0, Math.min(1, score));
  const t = useTranslations();
  return (
    <div className={["flex items-center gap-2", className].filter(Boolean).join(' ')}>
      <span className="text-sm font-medium">{t('label.score')}</span>
      <div className="h-2 w-28 rounded-full bg-muted relative" aria-label="Score">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-emerald-500" style={{ width: `${pct * 100}%` }} />
      </div>
      <span className="text-xs tabular-nums">{pct.toFixed(2)}</span>
    </div>
  );
}
