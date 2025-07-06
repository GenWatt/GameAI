import { apiClient } from "@/shared/api";

export const healthCheck = async (): Promise<string> => {
  const response = await apiClient.get("/health");
  return response.data;
};
