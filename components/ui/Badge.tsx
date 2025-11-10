import type { ReactNode } from 'react';
import type { SentimentTone } from '../../lib/ui/sentiment';
import { badgeClasses } from '../../lib/ui/sentiment';

type Props = {
  tone: SentimentTone;
  children: ReactNode;
  className?: string;
};

export default function Badge({ tone, children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${badgeClasses(
        tone
      )} ${className}`}
    >
      {children}
    </span>
  );
}

