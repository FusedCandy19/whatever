import { apiClient } from "./client";
import type { Branding } from "../types";

export const brandingApi = {
  get: () => apiClient.get<Branding>("/admin/branding"),
  update: (data: Partial<Branding>) => apiClient.patch<Branding>("/admin/branding", data),
};
