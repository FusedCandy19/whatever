import { apiClient } from "../client";
import type { AdminDashboardSummary } from "../../types";

export const adminHealthApi = {
  metrics: () => apiClient.get<{
    cpu: number; memory: number; dbConnections: number; uptime: number;
    requestsPerMin: number; errorRate: number; p99Latency: number;
  }>("/admin/health/metrics"),
  dashboard: () => apiClient.get<AdminDashboardSummary>("/admin/dashboard/summary"),
};
