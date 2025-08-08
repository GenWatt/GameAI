using SynapseStudio.ProjectService.Domain.Entities;

namespace SynapseStudio.ProjectService.Application.Projects.Models;

public sealed record ProjectDto(Guid Id, string Name, string Description, DateTime CreatedAt, DateTime UpdatedAt, string Type, string? ImageUrl)
{
    public static ProjectDto From(Project p) => new(
        p.Id,
        p.Name,
        p.Description,
        p.CreatedAt,
        p.UpdatedAt,
        p.Type.ToString(),
        p.ImageUrl
    );
}
