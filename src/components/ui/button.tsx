import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md bg-black px-3 py-1.5 text-white text-sm hover:bg-gray-800 disabled:opacity-60 ${className}`}
      {...props}
    />
  );
});

