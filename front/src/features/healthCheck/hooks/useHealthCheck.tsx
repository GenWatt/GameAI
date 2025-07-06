import { useQuery } from '@tanstack/react-query';
import { useConnectionStore } from '@/shared/api/stores/useConnectionStore';
import { healthCheck } from '../api';
import { HEALTH_STATUS } from '../constants';
import { healthCheckQueryOptions } from '../api/options/healthCheckQueryOptions';

export const useHealthCheck = () => {
  const { setStatus } = useConnectionStore();

  const handleHealthCheck = async () => {
    try {
      const status = await healthCheck();

      if (status === HEALTH_STATUS.HEALTHY) {
        setStatus('online');
      }
    } catch {
      setStatus('offline');
    }
  }

  const query = useQuery({ ...healthCheckQueryOptions, queryFn: handleHealthCheck });

  return {
    ...query
  };
};
