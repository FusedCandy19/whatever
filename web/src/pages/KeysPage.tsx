import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Copy, Trash2, Check } from "lucide-react";
import { keysApi } from "../api/keys";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Dialog } from "../components/ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { formatDate, formatRelative } from "../lib/utils";
import { toast } from "sonner";
import type { ApiKey } from "../types";

function KeyRow({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{apiKey.name}</p>
        <p className="text-xs text-muted-foreground font-mono">{apiKey.plaintext ?? apiKey.masked}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {apiKey.lastUsedAt ? `Last used ${formatRelative(apiKey.lastUsedAt)}` : "Never used"} · Created {formatDate(apiKey.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Badge variant={apiKey.status === "ACTIVE" ? "success" : "outline"}>{apiKey.status}</Badge>
        {(apiKey.plaintext ?? apiKey.masked) && (
          <Button variant="ghost" size="sm" onClick={() => copy(apiKey.plaintext ?? apiKey.masked)}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
        )}
        {apiKey.status === "ACTIVE" && (
          <Button variant="ghost" size="sm" onClick={() => onRevoke(apiKey.id)}>
            <Trash2 className="w-3 h-3 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function KeysPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState<ApiKey | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["keys"], queryFn: () => keysApi.list().then((r) => r.data) });

  const createMut = useMutation({
    mutationFn: () => keysApi.create(name).then((r) => r.data),
    onSuccess: (key) => {
      setNewKey(key);
      setShowCreate(false);
      setName("");
      qc.invalidateQueries({ queryKey: ["keys"] });
    },
    onError: () => toast.error("Failed to create key"),
  });

  const revokeMut = useMutation({
    mutationFn: keysApi.revoke,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["keys"] }); toast.success("Key revoked"); },
    onError: () => toast.error("Failed to revoke key"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" />New Key</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Your Keys</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : data?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No API keys yet. Create one to get started.</p>
          ) : (
            data?.map((k) => <KeyRow key={k.id} apiKey={k} onRevoke={(id) => revokeMut.mutate(id)} />)
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <div className="space-y-4">
          <Input label="Key Name" placeholder="e.g. Production" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMut.mutate()} loading={createMut.isPending} disabled={!name.trim()}>Create</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!newKey} onClose={() => setNewKey(null)} title="API Key Created">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Copy your key now — it won't be shown again.</p>
          <div className="bg-secondary rounded-md p-3 font-mono text-sm break-all">{newKey?.plaintext}</div>
          <Button className="w-full" onClick={() => { navigator.clipboard.writeText(newKey?.plaintext ?? ""); toast.success("Copied"); }}>
            <Copy className="w-4 h-4 mr-2" />Copy Key
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
