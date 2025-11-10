import React from 'react';
import { useTranslations } from 'next-intl';

interface ConfidencePillProps {
  confidence: number; // 0..1
  className?: string;
  tooltip?: React.ReactNode; // optionaler Tooltip-Content
}
export function ConfidencePill({ confidence, className, tooltip }: ConfidencePillProps) {
  const pct = Math.max(0, Math.min(1, confidence));
  const t = useTranslations();
  return (
    <div className={["flex items-center gap-2", className].filter(Boolean).join(' ')}>
      <span className="text-sm font-medium">{t('label.confidence')}</span>
      <div className="h-2 w-24 rounded-full bg-muted relative" aria-label="Vertrauen">
        <div className="absolute left-0 top-0 h-2 rounded-full bg-sky-500" style={{ width: `${pct * 100}%` }} />
      </div>
      <span className="text-xs tabular-nums">{Math.round(pct * 100)}%</span>
      {tooltip ?? null}
    </div>
  );
}
