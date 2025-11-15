 'use client';

import type { SnapshotAsset } from 'lib/persistence';
import ScoreBadge from './ScoreBadge';
import LabelPill from './LabelPill';
import ConfidenceBar from './ConfidenceBar';
import ReasonChips from './ReasonChips';
import StatusBadges, { type StatusKey } from './StatusBadges';

type TranslationFn = (key: string, values?: Record<string, string | number>) => string;

type Props = {
  asset: SnapshotAsset;
  t: TranslationFn;
  scoreLabel?: string;
};

function determineStatuses(asset: SnapshotAsset): StatusKey[] {
  const statuses = new Set<StatusKey>();
  if (asset.confidence >= 80) statuses.add('highImpact');
  if (asset.weights.news >= 0.25) statuses.add('eventWindow');
  if (asset.confidence < 50) statuses.add('lowConfidence');
  if (asset.weights.derivatives >= 0.3) statuses.add('highVolRegime');
  return Array.from(statuses);
}

export default function AssetScoreCard({ asset, t, scoreLabel }: Props) {
  const statuses = determineStatuses(asset);
  const statusLabels = {
    highImpact: t('status.highImpact', { default: 'High-Impact' }),
    eventWindow: t('status.eventWindow', { default: 'Event-Window' }),
    lowConfidence: t('status.lowConfidence', { default: 'Low Confidence' }),
    highVolRegime: t('status.highVolRegime', { default: 'High-Vol Regime' }),
  };
  const levelLabels = {
    low: t('confidence.level.low', { default: 'Low' }),
    medium: t('confidence.level.medium', { default: 'Medium' }),
    high: t('confidence.level.high', { default: 'High' }),
  };

  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <ScoreBadge
          score={asset.score01}
          label={scoreLabel ?? t('scoreCard.scoreLabel', { default: 'Score' })}
          helperText={t('scoreCard.scoreHelper', { total: asset.totalScore.toFixed(2) })}
          className="flex-1"
        />
        <LabelPill tone={asset.label} />
      </div>
      {statuses.length > 0 && (
        <div className="mt-3">
          <StatusBadges statuses={statuses} labels={statusLabels} />
        </div>
      )}
      <div className="mt-4">
        <ConfidenceBar
          value={asset.confidence}
          label={t('scoreCard.confidenceLabel', { default: 'Confidence' })}
          levelLabels={levelLabels}
        />
      </div>
      <div className="mt-4">
        <ReasonChips reasons={asset.reasons} />
      </div>
      <div className="mt-4 text-xs text-gray-500">
        {t('scoring.asOf', { default: 'Stand' })}: {new Date(asset.asOf).toLocaleTimeString()}
      </div>
    </article>
  );
}
