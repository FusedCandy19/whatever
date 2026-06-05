import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandingApi } from "../../api/branding";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import { THEME_PRESETS } from "../../lib/constants";
import { toast } from "sonner";

const PRESET_LABELS: Record<string, string> = {
  "dark-violet": "Dark Violet",
  "dark-amber": "Dark Amber",
  "dark-teal": "Dark Teal",
  "dark-rose": "Dark Rose",
  "light": "Light",
};

export default function AdminBrandingPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["branding"], queryFn: () => brandingApi.get().then((r) => r.data) });

  const [platformName, setPlatformName] = useState("");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [theme, setTheme] = useState("dark-violet");

  useEffect(() => {
    if (data) {
      setPlatformName(data.platformName);
      setAccentColor(data.accentColor);
      setTheme(data.theme);
    }
  }, [data]);

  const applyPreview = (t: string, accent?: string) => {
    const preset = THEME_PRESETS[t] ?? THEME_PRESETS["dark-violet"];
    const root = document.documentElement;
    Object.entries(preset).forEach(([k, v]) => root.style.setProperty(k, v));
    if (accent) root.style.setProperty("--brand", accent);
  };

  const updateMut = useMutation({
    mutationFn: () => brandingApi.update({ platformName, accentColor, theme }),
    onSuccess: (res) => {
      qc.setQueryData(["branding"], res.data);
      applyPreview(theme, accentColor);
      document.title = platformName;
      toast.success("Branding saved");
    },
    onError: () => toast.error("Failed to save"),
  });

  if (isLoading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Branding</h1>
      <Card>
        <CardHeader><CardTitle>Platform Identity</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Input label="Platform Name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} placeholder="My API Platform" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={accentColor} onChange={(e) => { setAccentColor(e.target.value); applyPreview(theme, e.target.value); }}
                className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent" />
              <Input value={accentColor} onChange={(e) => { setAccentColor(e.target.value); applyPreview(theme, e.target.value); }} className="font-mono" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Theme Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(THEME_PRESETS).map((t) => (
                <button key={t} onClick={() => { setTheme(t); applyPreview(t, accentColor); }}
                  className={`px-3 py-2 rounded-md border text-sm transition-colors ${theme === t ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-secondary text-muted-foreground"}`}>
                  {PRESET_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => updateMut.mutate()} loading={updateMut.isPending}>Save Branding</Button>
        </CardContent>
      </Card>
    </div>
  );
}
