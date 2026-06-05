import { apiClient } from "./client";
import type { User } from "../types";

export const settingsApi = {
  get: () => apiClient.get<User>("/v1/settings"),
  updateProfile: (data: { name: string; email: string }) =>
    apiClient.patch<User>("/v1/settings/profile", data),
  changePassword: (current: string, next: string) =>
    apiClient.post("/v1/settings/password", { current, next }),
};
