import { apiClient } from "./client";
import type { DashboardSummary } from "../types";

export const dashboardApi = {
  summary: () => apiClient.get<DashboardSummary>("/v1/dashboard/summary"),
};
