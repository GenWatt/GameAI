import { useProject as useProjectApi } from '../api';

interface UseProjectOptions {
    projectId: string;
    onProjectNotFound?: () => void;
}

export const useProject = ({ projectId }: UseProjectOptions) => {
    const { data, isLoading, error } = useProjectApi(projectId);

    const project = data?.data || null;

    return {
        project,
        loading: isLoading,
        error,
    };
};