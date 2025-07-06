export const HEALTH_CHECK_CONFIG = {
  REFETCH_INTERVAL: 30000,
  RETRY_ATTEMPTS: 2,
  STALE_TIME: 5000,
  TIMEOUT: 10000,
} as const;

export const HEALTH_STATUS = {
  HEALTHY: "Healthy",
  UNHEALTHY: "unhealthy",
  UNKNOWN: "unknown",
} as const;

export type HealthStatus = (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS];
