import { apiClient } from "../client";
import type { AdminUser } from "../../types";

export const adminUsersApi = {
  list: (params?: { page?: number; search?: string }) =>
    apiClient.get<{ users: AdminUser[]; total: number }>("/admin/users", { params }),
  get: (id: string) => apiClient.get<AdminUser>(`/admin/users/${id}`),
  suspend: (id: string, suspended: boolean) =>
    apiClient.patch(`/admin/users/${id}`, { suspended }),
};
