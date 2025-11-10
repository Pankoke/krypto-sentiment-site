import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: Array<{ t: number; c: number }>;
  className?: string;
}
export function Sparkline({ data, className }: SparklineProps) {
  const chartData = data.map((d) => ({ x: d.t, y: d.c }));
  return (
    <div className={["w-28 h-10", className].filter(Boolean).join(' ')}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

