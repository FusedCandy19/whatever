import type { User, ApiKey, DashboardSummary, BillingData, Model, Branding, AdminDashboardSummary } from "../../types";

export const mockUser: User = {
  id: "usr_1", name: "Demo User", email: "demo@example.com", role: "USER", plan: "PRO", createdAt: "2024-01-01T00:00:00Z",
};

export const mockAdmin: User = {
  id: "usr_0", name: "Admin", email: "admin@example.com", role: "ADMIN", plan: "ENTERPRISE", createdAt: "2024-01-01T00:00:00Z",
};

export const mockKeys: ApiKey[] = [
  { id: "key_1", name: "Production", prefix: "sk-prod", masked: "sk-prod...xxxx", status: "ACTIVE", lastUsedAt: "2024-06-01T10:00:00Z", expiresAt: null, createdAt: "2024-01-15T00:00:00Z" },
  { id: "key_2", name: "Development", prefix: "sk-dev", masked: "sk-dev...yyyy", status: "ACTIVE", lastUsedAt: null, expiresAt: null, createdAt: "2024-02-01T00:00:00Z" },
];

const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split("T")[0],
    requests: Math.floor(Math.random() * 500 + 100),
    tokens: Math.floor(Math.random() * 50000 + 10000),
    errors: Math.floor(Math.random() * 10),
  };
});

export const mockUsage = { data: days, byModel: [{ model: "gpt-4", requests: 3000, tokens: 1200000 }, { model: "gpt-3.5-turbo", requests: 7000, tokens: 2800000 }] };

export const mockDashboard: DashboardSummary = {
  requests: { current: 12450, prev: 10200 },
  tokens: { current: 4200000, prev: 3800000 },
  errors: { current: 45, prev: 52 },
  cost: { current: 4230, prev: 3900 },
  sparkline: days.slice(-7).map((d) => ({ date: d.date, requests: d.requests })),
};

export const mockBilling: BillingData = {
  plan: "PRO", periodStart: "2024-06-01", periodEnd: "2024-06-30",
  usage: { requests: 12450, tokens: 4200000 },
  invoices: [
    { id: "inv_1", amount: 2900, status: "PAID", period: "May 2024", createdAt: "2024-06-01T00:00:00Z" },
    { id: "inv_2", amount: 2900, status: "PAID", period: "Apr 2024", createdAt: "2024-05-01T00:00:00Z" },
  ],
};

export const mockModels: Model[] = [
  { id: "m1", name: "GPT-4", slug: "gpt-4", inputPrice: 0.03, outputPrice: 0.06, enabled: true, contextWindow: 128000 },
  { id: "m2", name: "GPT-3.5 Turbo", slug: "gpt-3.5-turbo", inputPrice: 0.001, outputPrice: 0.002, enabled: true, contextWindow: 16000 },
];

export const mockBranding: Branding = {
  platformName: "APIaaS", accentColor: "#8b5cf6", theme: "dark-violet", logoUrl: null,
};

export const mockAdminDashboard: AdminDashboardSummary = {
  users: 1234, activeKeys: 892, requestsToday: 45600, revenue: 289000, errorRate: 0.23,
  sparkline: days.slice(-7).map((d) => ({ date: d.date, requests: d.requests * 5 })),
};
