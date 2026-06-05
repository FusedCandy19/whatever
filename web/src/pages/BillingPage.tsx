import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "../api/billing";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { formatDate, formatCurrency, formatNumber } from "../lib/utils";
import { PLANS } from "../lib/constants";
import { toast } from "sonner";

export default function BillingPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["billing"], queryFn: () => billingApi.get().then((r) => r.data) });

  const upgradeMut = useMutation({
    mutationFn: (plan: string) => billingApi.updatePlan(plan),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["billing"] }); toast.success("Plan updated"); },
    onError: () => toast.error("Failed to update plan"),
  });

  if (isLoading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["FREE", "PRO", "ENTERPRISE"] as const).map((plan) => {
          const info = PLANS[plan];
          const isCurrent = data?.plan === plan;
          return (
            <Card key={plan} className={isCurrent ? "border-brand" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {info.name}
                  {isCurrent && <Badge variant="default">Current</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-bold">${info.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{info.requests < 0 ? "Unlimited" : formatNumber(info.requests)} requests</li>
                  <li>{info.tokens < 0 ? "Unlimited" : formatNumber(info.tokens)} tokens</li>
                </ul>
                {!isCurrent && (
                  <Button variant="outline" size="sm" className="w-full" loading={upgradeMut.isPending} onClick={() => upgradeMut.mutate(plan)}>
                    {plan === "FREE" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
        <CardContent>
          {data?.invoices.length === 0 ? (
            <p className="text-muted-foreground text-sm">No invoices yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {data?.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{inv.period}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(inv.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={inv.status === "PAID" ? "success" : inv.status === "OPEN" ? "warning" : "outline"}>
                      {inv.status}
                    </Badge>
                    <span className="text-sm font-medium">{formatCurrency(inv.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
