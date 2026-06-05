import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { subDays, format } from "date-fns";
import { usageApi } from "../api/usage";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { RequestsChart } from "../components/charts/RequestsChart";
import { TokensChart } from "../components/charts/TokensChart";
import { ModelPieChart } from "../components/charts/ModelPieChart";
import { ErrorRateChart } from "../components/charts/ErrorRateChart";
import { Skeleton } from "../components/ui/Skeleton";

export default function UsagePage() {
  const [days, setDays] = useState(30);
  const to = format(new Date(), "yyyy-MM-dd");
  const from = format(subDays(new Date(), days), "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["usage", from, to],
    queryFn: () => usageApi.get({ from, to }).then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usage</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-card px-3 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-48" /> : <RequestsChart data={data?.data ?? []} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tokens</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-48" /> : <TokensChart data={data?.data ?? []} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By Model</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-48" /> : <ModelPieChart data={data?.byModel ?? []} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Error Rate</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-48" /> : <ErrorRateChart data={data?.data ?? []} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
