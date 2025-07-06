export const API_CONFIG = {
  DEFAULT_BASE_URL: () =>
    import.meta.env.VITE_BASE_API_URL || "http://localhost:8000/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_TIME: 300000,
  STALE_TIME: 60000,

  ERROR_CODES: {
    UNKNOWN: "UNKNOWN_ERROR",
    NETWORK: "NETWORK_ERROR",
    TIMEOUT: "TIMEOUT_ERROR",
    SERVER: "SERVER_ERROR",
    NOT_FOUND: "NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    VALIDATION: "VALIDATION_ERROR",
  },

  ERROR_MESSAGES: {
    UNEXPECTED: "An unexpected error occurred",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Internal server error",
    TIMEOUT: "Request timeout",
    NETWORK_ERROR: "Network error - please check your connection",
    NO_DETAILS: "No additional details available",
    UNAUTHORIZED: "Authentication required",
    FORBIDDEN: "Access denied",
    VALIDATION: "Invalid data provided",
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  },

  HEADERS: {
    CONTENT_TYPE: "Content-Type",
    AUTHORIZATION: "Authorization",
    ACCEPT: "Accept",
    USER_AGENT: "User-Agent",
  },

  CONTENT_TYPES: {
    JSON: "application/json",
    FORM_DATA: "multipart/form-data",
    URL_ENCODED: "application/x-www-form-urlencoded",
  },
} as const;

export type ApiConfigType = typeof API_CONFIG;
