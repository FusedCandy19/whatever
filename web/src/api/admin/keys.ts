import { apiClient } from "../client";
import type { ApiKey } from "../../types";

export const adminKeysApi = {
  list: (params?: { page?: number; search?: string }) =>
    apiClient.get<{ keys: ApiKey[]; total: number }>("/admin/keys", { params }),
  revoke: (id: string) => apiClient.delete(`/admin/keys/${id}`),
};
