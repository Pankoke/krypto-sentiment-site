type Props = {
  percent: number; // 0..100
  colorClass: string; // e.g. 'bg-green-500'
  className?: string;
};

export default function Meter({ percent, colorClass, className = '' }: Props) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 overflow-hidden ${className}`}>
      <div className={`h-full ${colorClass}`} style={{ width: `${p}%` }} />
    </div>
  );
}

