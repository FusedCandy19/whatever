import { apiClient } from "./client";
import type { UsageDataPoint, ModelUsage } from "../types";

export const usageApi = {
  get: (params: { from: string; to: string; keyId?: string; granularity?: string }) =>
    apiClient.get<{ data: UsageDataPoint[]; byModel: ModelUsage[] }>("/v1/usage", { params }),
};
