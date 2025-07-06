import axios, { AxiosError, type AxiosResponse } from "axios";
import type { ApiError, ApiResponse } from "../types/apiTypes";
import { API_CONFIG } from "./configs/apiConfig";

export const apiClient = axios.create({
  baseURL: API_CONFIG.DEFAULT_BASE_URL(),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const isApiErrorResponse = (data: unknown): data is ApiError => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const errorData = data as Record<string, unknown>;

  return (
    typeof errorData.message === "string" &&
    typeof errorData.code === "string" &&
    typeof errorData.timestamp === "string"
  );
};

const createApiError = (error: AxiosError, errorData?: ApiError): ApiError => {
  const status = error.response?.status;

  let message = errorData?.message;
  if (!message) {
    message = getErrorMessageByStatus(status, error.code);
  }

  return {
    message,
    code: errorData?.code || API_CONFIG.ERROR_CODES.UNKNOWN,
    status,
    details: errorData?.details || API_CONFIG.ERROR_MESSAGES.NO_DETAILS,
    timestamp: new Date().toISOString(),
  };
};

const getErrorMessageByStatus = (status?: number, code?: string): string => {
  if (status === 404) return API_CONFIG.ERROR_MESSAGES.NOT_FOUND;
  if (status === 500) return API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
  if (code === "ECONNABORTED") return API_CONFIG.ERROR_MESSAGES.TIMEOUT;
  if (code === "ERR_NETWORK") return API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;

  return API_CONFIG.ERROR_MESSAGES.UNEXPECTED;
};

apiClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<ApiResponse<unknown>> => {
    return response;
  },
  (error: AxiosError) => {
    console.error("API Error:", error);

    const errorData = error.response?.data;
    const apiErrorDetails = isApiErrorResponse(errorData)
      ? errorData
      : undefined;

    console.error("API Error Details:", apiErrorDetails);

    const apiError = createApiError(error, apiErrorDetails);
    return Promise.reject(apiError);
  }
);
