import { useQuery } from "@tanstack/react-query";
import { Users, Key, Activity, DollarSign } from "lucide-react";
import { adminHealthApi } from "../../api/admin/health";
import { StatCard } from "../../components/ui/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { SparklineChart } from "../../components/charts/SparklineChart";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatNumber, formatCurrency } from "../../lib/utils";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminHealthApi.dashboard().then((r) => r.data),
  });

  if (isLoading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={formatNumber(data?.users ?? 0)} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Keys" value={formatNumber(data?.activeKeys ?? 0)} icon={<Key className="w-5 h-5" />} />
        <StatCard title="Requests Today" value={formatNumber(data?.requestsToday ?? 0)} icon={<Activity className="w-5 h-5" />} />
        <StatCard title="Revenue (MoM)" value={formatCurrency(data?.revenue ?? 0)} icon={<DollarSign className="w-5 h-5" />} />
      </div>
      {data?.sparkline && (
        <Card>
          <CardHeader><CardTitle>Request Trend — 7 Days</CardTitle></CardHeader>
          <CardContent><SparklineChart data={data.sparkline} /></CardContent>
        </Card>
      )}
    </div>
  );
}
