export const createQueryKeys = <T extends string>(feature: T) => ({
  all: [feature] as const,
  lists: () => [feature, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    filters
      ? ([feature, "list", { filters }] as const)
      : ([feature, "list"] as const),
  details: () => [feature, "detail"] as const,
  detail: (id: string) => [feature, "detail", id] as const,
});

// Usage example:
// export const PROJECT_KEYS = createQueryKeys('projects');
