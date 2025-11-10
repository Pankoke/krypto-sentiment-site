import * as React from 'react';

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="inline-block relative">{children}</div>;
}

export function TooltipTrigger({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="inline-flex items-center" {...props}>
      {children}
    </button>
  );
}

export function TooltipContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  // Minimal placeholder (no hover logic); relies on consumer responsibility.
  return <div className={`hidden ${className}`}>{children}</div>;
}

