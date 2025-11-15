 'use client';

/**
 * ConfidenceBar visualisiert Vertrauen (0–100) plus Textstufe.
 */
type Level = 'low' | 'medium' | 'high';

type LevelLabels = Record<Level, string>;

type Props = {
  value: number;
  label?: string;
  levelLabels?: LevelLabels;
  className?: string;
  loading?: boolean;
};

const defaultLabels: LevelLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const getLevel = (value: number): Level => {
  if (value < 40) return 'low';
  if (value < 70) return 'medium';
  return 'high';
};

export default function ConfidenceBar({
  value,
  label = 'Confidence',
  levelLabels = defaultLabels,
  className = '',
  loading = false,
}: Props) {
  if (loading) {
    return <div className={`h-12 w-full animate-pulse rounded-lg bg-gray-200 ${className}`} aria-hidden />;
  }

  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const level = getLevel(clamped);
  const color =
    level === 'high' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {levelLabels[level]}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <div className="text-xs text-gray-500">{clamped}%</div>
    </div>
  );
}
