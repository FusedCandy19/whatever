import { apiClient } from "../client";
import type { Invoice } from "../../types";

export const adminBillingApi = {
  invoices: (params?: { page?: number }) =>
    apiClient.get<{ invoices: Invoice[]; total: number }>("/admin/billing/invoices", { params }),
  addCredits: (userId: string, amount: number, note: string) =>
    apiClient.post("/admin/billing/credits", { userId, amount, note }),
};
