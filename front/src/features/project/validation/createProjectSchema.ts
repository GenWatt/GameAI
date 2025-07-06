import z from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(1, 'Project name is required')
        .min(3, 'Project name must be at least 3 characters')
        .max(50, 'Project name must be less than 50 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Project name can only contain letters, numbers, spaces, hyphens, and underscores'),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    imageUrl: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    type: z.enum(['default', 'special'], {
        required_error: 'Please select a project type',
    }),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;