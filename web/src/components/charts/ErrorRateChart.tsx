import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import type { UsageDataPoint } from "../../types";

export function ErrorRateChart({ data }: { data: UsageDataPoint[] }) {
  const chartData = data.map((d) => ({
    ...d,
    errorRate: d.requests > 0 ? ((d.errors / d.requests) * 100).toFixed(2) : 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "MMM d")} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis unit="%" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
        <Line type="monotone" dataKey="errorRate" stroke="#f43f5e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
