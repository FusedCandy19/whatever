import { apiClient } from "./client";
import type { User } from "../types";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    apiClient.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/register", { name, email, password }),
  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),
  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken }),
};
