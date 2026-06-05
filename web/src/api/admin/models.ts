import { apiClient } from "../client";
import type { Model } from "../../types";

export const adminModelsApi = {
  list: () => apiClient.get<Model[]>("/admin/models"),
  update: (id: string, data: Partial<Model>) => apiClient.patch<Model>(`/admin/models/${id}`, data),
  create: (data: Omit<Model, "id">) => apiClient.post<Model>("/admin/models", data),
};
