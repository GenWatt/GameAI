export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
}

export interface ApiError {
    message: string;
    code: string;
    status?: number;
    details?: string;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    [key: string]: any;
}

// Generic API methods interface
export interface ApiService<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
    getAll: (params?: QueryParams) => Promise<ApiResponse<T[]>>;
    getById: (id: string) => Promise<ApiResponse<T>>;
    create: (data: CreateData) => Promise<ApiResponse<T>>;
    update: (id: string, data: UpdateData) => Promise<ApiResponse<T>>;
    delete: (id: string) => Promise<void>;
}