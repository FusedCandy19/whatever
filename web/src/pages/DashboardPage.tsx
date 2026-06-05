import { useQuery } from "@tanstack/react-query";
import { Activity, Key, Zap, DollarSign } from "lucide-react";
import { dashboardApi } from "../api/dashboard";
import { StatCard } from "../components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { SparklineChart } from "../components/charts/SparklineChart";
import { Skeleton } from "../components/ui/Skeleton";
import { formatNumber, formatTokens, formatCurrency } from "../lib/utils";

function pct(current: number, prev: number) {
  if (!prev) return 0;
  return ((current - prev) / prev) * 100;
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.summary().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Requests (30d)" value={formatNumber(data?.requests.current ?? 0)} change={pct(data?.requests.current ?? 0, data?.requests.prev ?? 0)} icon={<Activity className="w-5 h-5" />} />
        <StatCard title="Tokens (30d)" value={formatTokens(data?.tokens.current ?? 0)} change={pct(data?.tokens.current ?? 0, data?.tokens.prev ?? 0)} icon={<Zap className="w-5 h-5" />} />
        <StatCard title="Errors (30d)" value={formatNumber(data?.errors.current ?? 0)} change={pct(data?.errors.current ?? 0, data?.errors.prev ?? 0)} icon={<Key className="w-5 h-5" />} />
        <StatCard title="Cost (30d)" value={formatCurrency(data?.cost.current ?? 0)} change={pct(data?.cost.current ?? 0, data?.cost.prev ?? 0)} icon={<DollarSign className="w-5 h-5" />} />
      </div>
      {data?.sparkline && (
        <Card>
          <CardHeader><CardTitle>Requests — Last 7 Days</CardTitle></CardHeader>
          <CardContent>
            <SparklineChart data={data.sparkline} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
