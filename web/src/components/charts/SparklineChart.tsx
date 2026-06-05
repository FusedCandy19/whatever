import { AreaChart, Area, ResponsiveContainer } from "recharts";

export function SparklineChart({ data }: { data: { requests: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="requests" stroke="var(--brand)" fill="url(#spark)" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
