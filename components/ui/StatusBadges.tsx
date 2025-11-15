 'use client';

/**
 * StatusBadges zeigen kontextuelle Markierungen (Event, High-Vol etc.).
 */
export type StatusKey = 'highImpact' | 'eventWindow' | 'lowConfidence' | 'highVolRegime';

type Props = {
  statuses: StatusKey[];
  labels?: Record<StatusKey, string>;
  className?: string;
  loading?: boolean;
};

const defaultLabels: Record<StatusKey, string> = {
  highImpact: 'High-Impact',
  eventWindow: 'Event-Window',
  lowConfidence: 'Low Confidence',
  highVolRegime: 'High-Vol Regime',
};

const highlightStyles: Record<StatusKey, string> = {
  highImpact: 'border-orange-300 bg-orange-50 text-orange-700',
  eventWindow: 'border-blue-300 bg-blue-50 text-blue-700',
  lowConfidence: 'border-gray-300 bg-gray-50 text-gray-700',
  highVolRegime: 'border-purple-300 bg-purple-50 text-purple-700',
};

export default function StatusBadges({
  statuses,
  labels = defaultLabels,
  className = '',
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <span className="h-6 w-20 animate-pulse rounded-full bg-gray-200" aria-hidden />
        <span className="h-6 w-16 animate-pulse rounded-full bg-gray-200" aria-hidden />
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {statuses.map((status) => (
        <span
          key={status}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${highlightStyles[status]}`}
          aria-label={labels[status]}
        >
          {labels[status]}
        </span>
      ))}
    </div>
  );
}
