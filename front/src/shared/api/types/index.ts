import type { ApiError } from "@/shared/types/apiTypes";

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error &&
    "timestamp" in error &&
    typeof (error as ApiError).message === "string" &&
    typeof (error as ApiError).code === "string" &&
    typeof (error as ApiError).timestamp === "string"
  );
};

export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
      status: undefined,
      details: undefined,
    };
  }

  return {
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
    timestamp: new Date().toISOString(),
    status: undefined,
    details: undefined,
  };
};
