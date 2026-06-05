import { apiClient } from "./client";
import type { Model } from "../types";

export const modelsApi = {
  list: () => apiClient.get<{ data: Model[] }>("/v1/models"),
};
