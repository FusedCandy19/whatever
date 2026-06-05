import { apiClient } from "./client";
import type { ApiKey } from "../types";

export const keysApi = {
  list: () => apiClient.get<ApiKey[]>("/v1/keys"),
  create: (name: string, expiresAt?: string) =>
    apiClient.post<ApiKey>("/v1/keys", { name, expiresAt }),
  revoke: (id: string) => apiClient.delete(`/v1/keys/${id}`),
};
