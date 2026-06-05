import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminBillingApi } from "../../api/admin/billing";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Dialog } from "../../components/ui/Dialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatCurrency } from "../../lib/utils";
import { toast } from "sonner";

export default function AdminBillingPage() {
  const [showCredit, setShowCredit] = useState(false);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-billing"],
    queryFn: () => adminBillingApi.invoices().then((r) => r.data),
  });

  const creditMut = useMutation({
    mutationFn: () => adminBillingApi.addCredits(userId, Number(amount) * 100, note),
    onSuccess: () => { toast.success("Credits added"); setShowCredit(false); setUserId(""); setAmount(""); setNote(""); },
    onError: () => toast.error("Failed to add credits"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing</h1>
        <Button onClick={() => setShowCredit(true)}>Add Credits</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Invoices ({data?.total ?? 0})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-48" /> : (
            <div className="divide-y divide-border">
              {data?.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{inv.period}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(inv.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={inv.status === "PAID" ? "success" : inv.status === "OPEN" ? "warning" : "outline"}>{inv.status}</Badge>
                    <span className="text-sm font-medium">{formatCurrency(inv.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showCredit} onClose={() => setShowCredit(false)} title="Add Credits">
        <div className="space-y-4">
          <Input label="User ID" placeholder="usr_..." value={userId} onChange={(e) => setUserId(e.target.value)} />
          <Input label="Amount ($)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Note" placeholder="Promo credit" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCredit(false)}>Cancel</Button>
            <Button loading={creditMut.isPending} onClick={() => creditMut.mutate()}>Add Credits</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
