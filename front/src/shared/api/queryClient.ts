import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG } from "./configs/queryConfig";
import { toApiError } from "./types";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: QUERY_CONFIG.STALE_TIME,
            gcTime: QUERY_CONFIG.GC_TIME,
            retry: (failureCount, error) => {
                const apiError = toApiError(error);

                if (
                    apiError.status &&
                    apiError.status >= QUERY_CONFIG.HTTP_CLIENT_ERROR_MIN &&
                    apiError.status < QUERY_CONFIG.HTTP_CLIENT_ERROR_MAX
                ) {
                    return false;
                }

                return failureCount < QUERY_CONFIG.MAX_RETRIES;
            },
            retryDelay: (attemptIndex) =>
                Math.min(
                    QUERY_CONFIG.RETRY_DELAY_BASE * 2 ** attemptIndex,
                    QUERY_CONFIG.RETRY_DELAY_MAX
                ),
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: (failureCount, error) => {
                const apiError = toApiError(error);

                if (
                    apiError.status &&
                    apiError.status >= QUERY_CONFIG.HTTP_CLIENT_ERROR_MIN &&
                    apiError.status < QUERY_CONFIG.HTTP_CLIENT_ERROR_MAX
                ) {
                    return false;
                }

                return failureCount < QUERY_CONFIG.MAX_MUTATION_RETRIES;
            },
        },
    },
});
