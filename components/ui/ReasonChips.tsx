 'use client';

/**
 * ReasonChips zeigt mehrere begründende Kurztexte. Optional mit Skeleton.
 */
type Props = {
  reasons?: string[];
  maxChips?: number;
  className?: string;
  loading?: boolean;
};

const MAX_LENGTH = 80;

function trimReason(reason: string) {
  return reason.length > MAX_LENGTH ? `${reason.slice(0, MAX_LENGTH - 1)}…` : reason;
}

export default function ReasonChips({
  reasons = [],
  maxChips = 3,
  className = '',
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Array.from({ length: maxChips }).map((_, idx) => (
          <span
            key={idx}
            className="h-8 w-24 rounded-full bg-gray-200 text-xs font-semibold text-transparent animate-pulse"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {reasons.slice(0, maxChips).map((reason, idx) => {
        const trimmed = trimReason(reason);
        return (
          <span
            key={idx}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm"
            title={reason}
          >
            {trimmed}
          </span>
        );
      })}
    </div>
  );
}
