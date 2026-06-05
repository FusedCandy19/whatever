import { useQuery } from "@tanstack/react-query";
import { adminHealthApi } from "../../api/admin/health";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Skeleton } from "../../components/ui/Skeleton";

function Gauge({ label, value, unit = "%", max = 100, warn = 70, danger = 90 }: {
  label: string; value: number; unit?: string; max?: number; warn?: number; danger?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= danger ? "bg-red-500" : value >= warn ? "bg-amber-500" : "bg-brand";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminHealthPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-health"],
    queryFn: () => adminHealthApi.metrics().then((r) => r.data),
    refetchInterval: 10_000,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Health</h1>
      <Card>
        <CardHeader><CardTitle>Live Metrics (auto-refresh 10s)</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-48" /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Gauge label="CPU Usage" value={data?.cpu ?? 0} />
              <Gauge label="Memory Usage" value={data?.memory ?? 0} />
              <Gauge label="DB Connections" value={data?.dbConnections ?? 0} unit="" max={100} />
              <Gauge label="Error Rate" value={data?.errorRate ?? 0} warn={1} danger={5} />
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Requests / min</p>
                <p className="text-2xl font-bold">{data?.requestsPerMin ?? 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">P99 Latency</p>
                <p className="text-2xl font-bold">{data?.p99Latency ?? 0}<span className="text-sm font-normal text-muted-foreground">ms</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Uptime</p>
                <p className="text-2xl font-bold">{((data?.uptime ?? 0) / 3600).toFixed(1)}<span className="text-sm font-normal text-muted-foreground">h</span></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
