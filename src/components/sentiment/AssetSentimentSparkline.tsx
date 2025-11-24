"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import type { AssetHistoryPoint } from "lib/news/snapshot";

type AssetSentimentSparklineProps = {
  points: AssetHistoryPoint[];
};

export function AssetSentimentSparkline({ points }: AssetSentimentSparklineProps) {
  const data = points.map((point) => ({
    x: new Date(point.timestamp).getTime(),
    label: new Date(point.timestamp).toLocaleDateString("en-US"),
    y: point.score,
  }));

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            tickMargin={6}
            interval="preserveStartEnd"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 10 }}
            tickMargin={6}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(label) => String(label)}
            formatter={(value: number) => [value.toFixed(2), "Score"]}
          />
          <Line type="monotone" dataKey="y" stroke="#0f172a" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
