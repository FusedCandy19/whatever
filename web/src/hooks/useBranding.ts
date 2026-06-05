import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { brandingApi } from "../api/branding";
import { THEME_PRESETS } from "../lib/constants";

export function useBranding() {
  const { data } = useQuery({
    queryKey: ["branding"],
    queryFn: () => brandingApi.get().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    const root = document.documentElement;
    const preset = THEME_PRESETS[data.theme] ?? THEME_PRESETS["dark-violet"];
    Object.entries(preset).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty("--brand", data.accentColor);
    document.title = data.platformName;
  }, [data]);

  return data;
}
