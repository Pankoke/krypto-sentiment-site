"use client";
import * as React from 'react';

type Option = { value: string; label: string };

type Ctx = {
  value?: string;
  onValueChange?: (v: string) => void;
  setTriggerClass: (c: string) => void;
  registerOptions: (opts: Option[]) => void;
};

const SelectCtx = React.createContext<Ctx | null>(null);

type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  const [triggerClass, setTriggerClass] = React.useState<string>("inline-flex h-9 items-center justify-between gap-2 rounded-md border px-3");
  const [options, setOptions] = React.useState<Option[]>([]);

  return (
    <SelectCtx.Provider
      value={{
        value,
        onValueChange,
        setTriggerClass: (c) => setTriggerClass(c || ""),
        registerOptions: (opts) => setOptions(opts),
      }}
    >
      <div className="relative inline-block">
        {/* Native select for accessibility & functionality */}
        <select
          className={`${triggerClass} w-full bg-white text-sm`}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* Render children for API compatibility (no popup) */}
        <div className="hidden">{children}</div>
      </div>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger({ className = '', children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(SelectCtx);
  React.useEffect(() => {
    ctx?.setTriggerClass(className);
  }, [className, ctx]);
  return <div className="hidden" aria-hidden>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="hidden" aria-hidden>{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SelectCtx);
  React.useEffect(() => {
    const opts: Option[] = [];
    React.Children.forEach(children, (child) => {
      const el = child as React.ReactElement<{ value: string; children: React.ReactNode }>;
      if (el && typeof el === 'object' && 'props' in el && el.props && typeof el.props.value === 'string') {
        const label = typeof el.props.children === 'string' ? el.props.children : String(el.props.children);
        opts.push({ value: el.props.value, label });
      }
    });
    ctx?.registerOptions(opts);
  }, [children, ctx]);
  return <div className="hidden" aria-hidden>{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <div data-value={value} aria-hidden>{children}</div>;
}
