import { type ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "./Card";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  sparkline?: { date: string; requests: number }[];
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 mt-1 text-xs", positive ? "text-green-400" : "text-red-400")}>
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {positive ? "+" : ""}{change.toFixed(1)}% vs last period
              </div>
            )}
          </div>
          {icon && <div className="text-brand">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
