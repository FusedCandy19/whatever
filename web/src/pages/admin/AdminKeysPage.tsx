import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminKeysApi } from "../../api/admin/keys";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatRelative } from "../../lib/utils";
import { toast } from "sonner";

export default function AdminKeysPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-keys", search],
    queryFn: () => adminKeysApi.list({ search }).then((r) => r.data),
  });

  const revokeMut = useMutation({
    mutationFn: adminKeysApi.revoke,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-keys"] }); toast.success("Key revoked"); },
    onError: () => toast.error("Failed to revoke"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">API Keys (Platform-Wide)</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keys ({data?.total ?? 0})</CardTitle>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-48" /> : (
            <div className="divide-y divide-border">
              {data?.keys.map((k) => (
                <div key={k.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{k.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{k.masked}</p>
                    <p className="text-xs text-muted-foreground">Created {formatDate(k.createdAt)} · {k.lastUsedAt ? `Last used ${formatRelative(k.lastUsedAt)}` : "Never used"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={k.status === "ACTIVE" ? "success" : "outline"}>{k.status}</Badge>
                    {k.status === "ACTIVE" && (
                      <Button size="sm" variant="destructive" loading={revokeMut.isPending} onClick={() => revokeMut.mutate(k.id)}>Revoke</Button>
                    )}
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
