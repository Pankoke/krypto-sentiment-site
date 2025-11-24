import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={[
        'inline-flex items-center justify-center rounded-full',
        'bg-slate-900 text-white text-sm font-semibold',
        'px-5 py-2.5',
        'shadow-sm transition',
        'hover:bg-slate-800 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
});
