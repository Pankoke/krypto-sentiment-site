import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = '' }: Props) {
  return (
    <article className={`rounded-lg border bg-white shadow-sm p-4 ${className}`}>
      {children}
    </article>
  );
}

