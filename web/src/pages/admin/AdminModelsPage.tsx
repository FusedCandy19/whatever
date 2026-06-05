import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminModelsApi } from "../../api/admin/models";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Dialog } from "../../components/ui/Dialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { toast } from "sonner";
import type { Model } from "../../types";

export default function AdminModelsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Model | null>(null);
  const [inputPrice, setInputPrice] = useState("");
  const [outputPrice, setOutputPrice] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["admin-models"], queryFn: () => adminModelsApi.list().then((r) => r.data) });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Model> }) => adminModelsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-models"] }); toast.success("Model updated"); setEditing(null); },
    onError: () => toast.error("Failed to update"),
  });

  const openEdit = (m: Model) => {
    setEditing(m);
    setInputPrice(String(m.inputPrice));
    setOutputPrice(String(m.outputPrice));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Models</h1>
      <Card>
        <CardHeader><CardTitle>Available Models</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-48" /> : (
            <div className="divide-y divide-border">
              {data?.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{m.slug}</p>
                    <p className="text-xs text-muted-foreground">In: ${m.inputPrice}/1K · Out: ${m.outputPrice}/1K · {(m.contextWindow / 1000).toFixed(0)}K ctx</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.enabled ? "success" : "outline"}>{m.enabled ? "Enabled" : "Disabled"}</Badge>
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
                    <Button size="sm" variant={m.enabled ? "destructive" : "outline"} onClick={() => updateMut.mutate({ id: m.id, data: { enabled: !m.enabled } })}>
                      {m.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onClose={() => setEditing(null)} title="Edit Model Pricing">
        <div className="space-y-4">
          <Input label="Input Price (per 1K tokens)" type="number" step="0.001" value={inputPrice} onChange={(e) => setInputPrice(e.target.value)} />
          <Input label="Output Price (per 1K tokens)" type="number" step="0.001" value={outputPrice} onChange={(e) => setOutputPrice(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button loading={updateMut.isPending} onClick={() => editing && updateMut.mutate({ id: editing.id, data: { inputPrice: Number(inputPrice), outputPrice: Number(outputPrice) } })}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
