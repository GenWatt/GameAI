import type { ApiError } from '@/shared/types/apiTypes';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useErrorHandler = () => {
    const handleError = useCallback((error: ApiError | Error) => {
        let message = 'An unexpected error occurred';

        if ('status' in error && error.status) {
            // It's an ApiError
            message = error.message;

            if (error.status >= 500) {
                message = 'Server error - please try again later';
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        toast.error(message);

        // Log error for debugging
        console.error('Error:', error);

        return message;
    }, []);

    return { handleError };
};