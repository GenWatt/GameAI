import { apiClient } from ".";
import type { ApiResponse, ApiService, QueryParams } from "../types/apiTypes";

export const createApiService = <T, CreateData = Partial<T>, UpdateData = Partial<T>>(
    endpoint: string
): ApiService<T, CreateData, UpdateData> => ({
    getAll: async (params?: QueryParams): Promise<ApiResponse<T[]>> => {
        const { data } = await apiClient.get<ApiResponse<T[]>>(endpoint, { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<T>> => {
        const { data } = await apiClient.get<ApiResponse<T>>(`${endpoint}/${id}`);
        return data;
    },

    create: async (createData: CreateData): Promise<ApiResponse<T>> => {
        const { data } = await apiClient.post<ApiResponse<T>>(endpoint, createData);
        return data;
    },

    update: async (id: string, updateData: UpdateData): Promise<ApiResponse<T>> => {
        const { data } = await apiClient.put<ApiResponse<T>>(`${endpoint}/${id}`, updateData);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${endpoint}/${id}`);
    },
});