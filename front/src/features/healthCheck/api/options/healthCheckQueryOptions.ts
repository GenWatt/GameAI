import { createQueryKeys } from "@/shared/api/createQueryKeys";
import { queryOptions } from "@tanstack/react-query";
import { HEALTH_CHECK_CONFIG } from "../../constants";

export const healthCheckQueryOptions = queryOptions({
  queryKey: createQueryKeys("healthCheck").list(),
  refetchInterval: HEALTH_CHECK_CONFIG.REFETCH_INTERVAL,
  retry: HEALTH_CHECK_CONFIG.RETRY_ATTEMPTS,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  staleTime: HEALTH_CHECK_CONFIG.STALE_TIME,
});
