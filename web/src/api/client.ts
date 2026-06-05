import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE } from "../lib/constants";
import { useAuthStore } from "../store/auth.store";
import { useUIStore } from "../store/ui.store";

export const apiClient = axios.create({ baseURL: API_BASE });

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const impId = useUIStore.getState().impersonatingUserId;
  if (impId) config.headers["X-Impersonate-User"] = impId;
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        const rt = useAuthStore.getState().refreshToken;
        refreshPromise = axios
          .post(`${API_BASE}/auth/refresh`, { refreshToken: rt })
          .then((r) => {
            const { accessToken, refreshToken } = r.data;
            const user = useAuthStore.getState().user!;
            useAuthStore.getState().setAuth(user, accessToken, refreshToken);
            return accessToken;
          })
          .finally(() => { refreshPromise = null; });
      }
      try {
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
