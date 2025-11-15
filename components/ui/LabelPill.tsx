 'use client';

/**
 * LabelPill zeigt den Zustand (bullish/neutral/bearish) mit Accessibilty-Hilfe.
 */
type Tone = 'bullish' | 'neutral' | 'bearish';

type Props = {
  tone: Tone;
  className?: string;
  'aria-label'?: string;
};

const toneStyles: Record<Tone, string> = {
  bullish: 'bg-green-50 text-green-700 ring-green-200',
  bearish: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-gray-50 text-gray-700 ring-gray-200',
};

export default function LabelPill({ tone, className = '', 'aria-label': ariaLabel }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${toneStyles[tone]} ${className}`}
      aria-label={ariaLabel ?? `${tone.charAt(0).toUpperCase() + tone.slice(1)} label`}
    >
      {tone}
    </span>
  );
}
