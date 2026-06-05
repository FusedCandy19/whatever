import { apiClient } from "./client";
import type { BillingData } from "../types";

export const billingApi = {
  get: () => apiClient.get<BillingData>("/v1/billing"),
  updatePlan: (plan: string) => apiClient.patch("/v1/billing/plan", { plan }),
};
