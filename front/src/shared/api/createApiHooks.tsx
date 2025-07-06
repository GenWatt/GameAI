import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ApiService, ApiError, ApiResponse } from '../types/apiTypes';

export const createApiHooks = <T, CreateData = Partial<T>, UpdateData = Partial<T>>(
    service: ApiService<T, CreateData, UpdateData>,
    queryKeys: ReturnType<typeof import('./createQueryKeys').createQueryKeys>
) => {
    const useList = (
        params?: Parameters<typeof service.getAll>[0],
        options?: Omit<UseQueryOptions<ApiResponse<T[]>, ApiError>, 'queryKey' | 'queryFn'>
    ) => {
        return useQuery({
            queryKey: queryKeys.list(params),
            queryFn: () => service.getAll(params),
            ...options,
        });
    };

    const useDetail = (
        id: string,
        options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
    ) => {
        return useQuery({
            queryKey: queryKeys.detail(id),
            queryFn: () => service.getById(id),
            enabled: !!id,
            ...options,
        });
    };

    const useCreate = (
        options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, CreateData>, 'mutationFn'>
    ) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: service.create,
            onSuccess: (data, variables, context) => {
                console.log('Create success:', data);
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
                options?.onSuccess?.(data, variables, context);
            },
            ...options,
        });
    };

    const useUpdate = (
        options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, { id: string; data: UpdateData }>, 'mutationFn'>
    ) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ id, data }) => service.update(id, data),
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
                queryClient.setQueryData(queryKeys.detail(variables.id), data);
                options?.onSuccess?.(data, variables, context);
            },
            ...options,
        });
    };

    const useDelete = (
        options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>
    ) => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: service.delete,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
                queryClient.removeQueries({ queryKey: queryKeys.detail(variables) });
                options?.onSuccess?.(data, variables, context);
            },
            ...options,
        });
    };

    return {
        useList,
        useDetail,
        useCreate,
        useUpdate,
        useDelete,
    };
};