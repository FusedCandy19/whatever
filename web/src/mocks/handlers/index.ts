import { http, HttpResponse } from "msw";
import { API_BASE } from "../../lib/constants";
import { mockUser, mockAdmin, mockKeys, mockUsage, mockDashboard, mockBilling, mockModels, mockBranding, mockAdminDashboard } from "../fixtures";

const b = API_BASE;

export const handlers = [
  http.post(`${b}/auth/login`, async ({ request }) => {
    const { email } = await request.json() as any;
    const user = email === "admin@example.com" ? mockAdmin : mockUser;
    return HttpResponse.json({ user, accessToken: "mock-at", refreshToken: "mock-rt" });
  }),
  http.post(`${b}/auth/register`, async ({ request }) => {
    const { name, email } = await request.json() as any;
    return HttpResponse.json({ user: { ...mockUser, name, email }, accessToken: "mock-at", refreshToken: "mock-rt" });
  }),
  http.post(`${b}/auth/refresh`, () => HttpResponse.json({ accessToken: "mock-at", refreshToken: "mock-rt" })),
  http.post(`${b}/auth/forgot-password`, () => HttpResponse.json({ ok: true })),

  http.get(`${b}/v1/keys`, () => HttpResponse.json(mockKeys)),
  http.post(`${b}/v1/keys`, async ({ request }) => {
    const { name } = await request.json() as any;
    return HttpResponse.json({ id: "key_new", name, prefix: "sk-new", masked: "sk-new...zzzz", status: "ACTIVE", lastUsedAt: null, expiresAt: null, createdAt: new Date().toISOString(), plaintext: "sk-new-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" });
  }),
  http.delete(`${b}/v1/keys/:id`, () => HttpResponse.json({ ok: true })),

  http.get(`${b}/v1/usage`, () => HttpResponse.json(mockUsage)),
  http.get(`${b}/v1/dashboard/summary`, () => HttpResponse.json(mockDashboard)),
  http.get(`${b}/v1/billing`, () => HttpResponse.json(mockBilling)),
  http.patch(`${b}/v1/billing/plan`, () => HttpResponse.json({ ok: true })),
  http.get(`${b}/v1/settings`, () => HttpResponse.json(mockUser)),
  http.patch(`${b}/v1/settings/profile`, async ({ request }) => HttpResponse.json({ ...mockUser, ...await request.json() as any })),
  http.post(`${b}/v1/settings/password`, () => HttpResponse.json({ ok: true })),
  http.get(`${b}/v1/models`, () => HttpResponse.json({ object: "list", data: mockModels })),

  http.get(`${b}/admin/branding`, () => HttpResponse.json(mockBranding)),
  http.patch(`${b}/admin/branding`, async ({ request }) => HttpResponse.json({ ...mockBranding, ...await request.json() as any })),
  http.get(`${b}/admin/users`, () => HttpResponse.json({ users: [{ ...mockUser, suspended: false, keyCount: 2, totalRequests: 12450 }, { ...mockAdmin, suspended: false, keyCount: 1, totalRequests: 500 }], total: 2 })),
  http.patch(`${b}/admin/users/:id`, () => HttpResponse.json({ ok: true })),
  http.get(`${b}/admin/keys`, () => HttpResponse.json({ keys: mockKeys, total: mockKeys.length })),
  http.delete(`${b}/admin/keys/:id`, () => HttpResponse.json({ ok: true })),
  http.get(`${b}/admin/models`, () => HttpResponse.json(mockModels)),
  http.patch(`${b}/admin/models/:id`, async ({ request, params }) => {
    const m = mockModels.find((x) => x.id === params.id);
    return HttpResponse.json({ ...m, ...await request.json() as any });
  }),
  http.get(`${b}/admin/health/metrics`, () => HttpResponse.json({ cpu: 32.4, memory: 61.2, dbConnections: 12, uptime: 345600, requestsPerMin: 84, errorRate: 0.23, p99Latency: 142 })),
  http.get(`${b}/admin/dashboard/summary`, () => HttpResponse.json(mockAdminDashboard)),
  http.get(`${b}/admin/billing/invoices`, () => HttpResponse.json({ invoices: mockBilling.invoices, total: mockBilling.invoices.length })),
  http.post(`${b}/admin/billing/credits`, () => HttpResponse.json({ ok: true })),
];
