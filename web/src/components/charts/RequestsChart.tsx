import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import type { UsageDataPoint } from "../../types";

export function RequestsChart({ data }: { data: UsageDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tickFormatter={(d) => format(new Date(d), "MMM d")} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
        <Area type="monotone" dataKey="requests" stroke="var(--brand)" fill="url(#reqGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
