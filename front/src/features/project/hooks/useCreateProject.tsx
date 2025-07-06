import { useCreateProjectMutation } from "../api";

export const useCreateProject = () => {
    const { mutateAsync, ...rest } = useCreateProjectMutation();

    return {
        createProject: mutateAsync,
        ...rest,
    };
};