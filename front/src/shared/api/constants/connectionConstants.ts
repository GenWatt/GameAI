export const CONNECTION_CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  HEALTH_CHECK_INTERVAL: 30000,
  OFFLINE_CHECK_INTERVAL: 5000,
} as const;

export const CONNECTION_ERROR_TYPES = {
  NETWORK: "network",
  TIMEOUT: "timeout",
  SERVER: "server",
  UNKNOWN: "unknown",
} as const;

export const CONNECTION_MESSAGES = {
  OFFLINE: "You are currently offline",
  SERVER_UNAVAILABLE: "Server is currently unavailable",
  TIMEOUT: "Connection timeout occurred",
  NETWORK_ERROR: "Network connection failed",
  UNKNOWN_ERROR: "An unknown connection error occurred",
} as const;
