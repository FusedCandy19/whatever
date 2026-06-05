export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO" | "ENTERPRISE";
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  masked: string;
  status: "ACTIVE" | "REVOKED";
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  plaintext?: string;
}

export interface UsageDataPoint {
  date: string;
  requests: number;
  tokens: number;
  errors: number;
}

export interface ModelUsage {
  model: string;
  requests: number;
  tokens: number;
}

export interface DashboardSummary {
  requests: { current: number; prev: number };
  tokens: { current: number; prev: number };
  errors: { current: number; prev: number };
  cost: { current: number; prev: number };
  sparkline: { date: string; requests: number }[];
}

export interface BillingData {
  plan: "FREE" | "PRO" | "ENTERPRISE";
  periodStart: string;
  periodEnd: string;
  usage: { requests: number; tokens: number };
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  amount: number;
  status: "PAID" | "OPEN" | "VOID";
  period: string;
  createdAt: string;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  inputPrice: number;
  outputPrice: number;
  enabled: boolean;
  contextWindow: number;
}

export interface Branding {
  platformName: string;
  accentColor: string;
  theme: string;
  logoUrl: string | null;
}

export interface AdminUser extends User {
  suspended: boolean;
  keyCount: number;
  totalRequests: number;
}

export interface AdminDashboardSummary {
  users: number;
  activeKeys: number;
  requestsToday: number;
  revenue: number;
  errorRate: number;
  sparkline: { date: string; requests: number }[];
}
