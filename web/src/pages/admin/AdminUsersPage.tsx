import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../../api/admin/users";
import { useUIStore } from "../../store/ui.store";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate, formatNumber } from "../../lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/constants";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { setImpersonating } = useUIStore();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => adminUsersApi.list({ search }).then((r) => r.data),
  });

  const suspendMut = useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) => adminUsersApi.suspend(id, suspended),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
    onError: () => toast.error("Action failed"),
  });

  const handleImpersonate = (id: string, name: string) => {
    setImpersonating(id, name);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users ({data?.total ?? 0})</CardTitle>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-48" /> : (
            <div className="divide-y divide-border">
              {data?.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email} · Joined {formatDate(u.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(u.totalRequests)} requests · {u.keyCount} keys</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === "ADMIN" ? "default" : "outline"}>{u.role}</Badge>
                    <Badge variant={u.suspended ? "destructive" : "success"}>{u.suspended ? "Suspended" : "Active"}</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleImpersonate(u.id, u.name)}>View As</Button>
                    <Button size="sm" variant={u.suspended ? "outline" : "destructive"} loading={suspendMut.isPending}
                      onClick={() => suspendMut.mutate({ id: u.id, suspended: !u.suspended })}>
                      {u.suspended ? "Unsuspend" : "Suspend"}
                    </Button>
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
