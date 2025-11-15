/**
 * ScoreBadge zeigt eine Kennzahl (0–100) mit optionalem Trendpfeil.
 * Props erlauben eigene Texte, Trendtipps und Skelettzustände ohne Business-Logik.
 */
 'use client';

type TrendDirection = 'up' | 'down' | 'flat';

type Props = {
  score: number;
  trend?: TrendDirection;
  label?: string;
  helperText?: string;
  className?: string;
  loading?: boolean;
};

const trendGlyph: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const trendColors: Record<TrendDirection, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  flat: 'text-gray-500',
};

export default function ScoreBadge({
  score,
  trend,
  label = 'Score',
  helperText,
  className = '',
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className={`h-10 w-44 rounded-full bg-gray-200 animate-pulse ${className}`} aria-hidden />
    );
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const trendLabel = trend ? `${trendGlyph[trend]} ${trend} trend` : undefined;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm ${className}`}
      aria-label={`${label}: ${clamped} von 100${trendLabel ? ` (${trendLabel})` : ''}`}
    >
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-xl text-black">{clamped}</div>
        {helperText ? <div className="text-xs text-gray-500">{helperText}</div> : null}
      </div>
      {trend && (
        <div className={`${trendColors[trend]} text-2xl`} aria-hidden>
          {trendGlyph[trend]}
        </div>
      )}
    </div>
  );
}
