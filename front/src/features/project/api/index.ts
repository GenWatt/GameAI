import type { IProject } from '@/shared/types';
import type { CreateProjectFormData } from '../validation/createProjectSchema';
import { createApiService } from '@/shared/api/ApiService';
import { createApiHooks } from '@/shared/api/createApiHooks';
import { createQueryKeys } from '@/shared/api/createQueryKeys';

// Create query keys
export const PROJECT_KEYS = createQueryKeys('projects');

console.log('PROJECT_KEYS:', PROJECT_KEYS);
// Create API service
export const projectService = createApiService<IProject, CreateProjectFormData>('/projects');

// Create hooks
export const {
    useList: useProjects,
    useDetail: useProject,
    useCreate: useCreateProjectMutation,
    useUpdate: useUpdateProjectMutation,
    useDelete: useDeleteProjectMutation,
} = createApiHooks(projectService, PROJECT_KEYS);