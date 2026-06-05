import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ModelUsage } from "../../types";

const COLORS = ["#8b5cf6", "#14b8a6", "#f59e0b", "#f43f5e", "#60a5fa"];

export function ModelPieChart({ data }: { data: ModelUsage[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="requests" nameKey="model" cx="50%" cy="50%" outerRadius={70}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
